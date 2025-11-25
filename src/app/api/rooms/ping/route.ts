import { cleanupRooms } from "@/src/lib/cleanupRooms";
import { rooms } from "@/src/lib/roomStore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    cleanupRooms();
    const body = await req.json();
    const { roomCode, playerId } = body;

    const room = rooms[roomCode];
    if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    room.lastActive = Date.now();

    const player = room.players.find((p) => p.id === playerId);
    if (player) {
        player.lastActive = Date.now();
    }

    return NextResponse.json({ ok: true });
}
