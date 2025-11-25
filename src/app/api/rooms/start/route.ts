import { cleanupRooms } from "@/src/lib/cleanupRooms";
import { rooms } from "@/src/lib/roomStore";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getRandomPlayers(players: any[], count: number) {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

export async function POST(req: Request) {
    cleanupRooms();
    const body = await req.json();
    const { roomCode, hostId, impostorCount = 1 } = body;

    const room = rooms[roomCode];

    if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.hostId !== hostId) {
        return NextResponse.json(
            { error: "Only host can start the game" },
            { status: 403 }
        );
    }

    const players = room.players;

    if (players.length <= 2) {
        return NextResponse.json(
            { error: "Not enough players to start" },
            { status: 400 }
        );
    }

    if (impostorCount >= players.length) {
        return NextResponse.json(
            { error: "Too many impostors" },
            { status: 400 }
        );
    }

    const impostors = getRandomPlayers(players, impostorCount);
    const impostorIds = impostors.map((p) => p.id);

    room.impostorIds = impostorIds;
    room.impostorId = impostorIds.length === 1 ? impostorIds[0] : null;

    room.status = "playing";

    return NextResponse.json({
        ok: true,
        roles: players.map((p) => ({
            id: p.id,
            role: impostorIds.includes(p.id) ? "impostor" : "crew",
        })),
        room,
    });
}
