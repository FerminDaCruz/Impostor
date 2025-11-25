import { cleanupRooms } from "@/src/lib/cleanupRooms";
import { rooms } from "@/src/lib/roomStore";
import { NextResponse } from "next/server";

function generateRoomCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let code = "";
    for (let i = 0; i < 5; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

export async function POST(req: Request) {
    cleanupRooms();
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    let code = generateRoomCode();

    while (rooms[code]) {
        code = generateRoomCode();
    }

    rooms[code] = {
        code,
        hostId: userId,
        players: [],
        status: "waiting",
        impostorId: null,
        impostorIds: [],
        createdAt: Date.now(),
        lastActive: Date.now(),
        theme: null,
        word: null,
    };

    return NextResponse.json({
        ok: true,
        room: rooms[code],
    });
}
