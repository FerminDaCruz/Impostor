import { subscribe, unsubscribe } from "@/src/lib/eventStore";
import { rooms } from "@/src/lib/roomStore";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    params: { params: Promise<{ code: string }> }
) {
    const { code } = await params.params;
    console.log(code);
    const roomCode = code.toUpperCase();
    console.log(roomCode);

    const room = rooms[roomCode];
    if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const headers = new Headers();
    headers.set("Content-Type", "text/event-stream");
    headers.set("Cache-Control", "no-cache");
    headers.set("Connection", "keep-alive");

    subscribe(roomCode, writer);

    writer.write(
        `data: ${JSON.stringify({ type: "connected", roomCode })}\n\n`
    );

    req.signal.addEventListener("abort", () => {
        unsubscribe(roomCode, writer);
        writer.close();
    });

    return new Response(stream.readable, { headers });
}
