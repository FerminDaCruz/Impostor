import { cleanupRooms } from "@/src/lib/cleanupRooms";
import { themes } from "@/src/lib/defaultThemes";
import { broadcast } from "@/src/lib/eventStore";
import { rooms } from "@/src/lib/roomStore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    cleanupRooms();

    const body = await req.json();
    const {
        roomCode,
        hostId,
        theme,
        customWord,
    }: {
        roomCode: string;
        hostId: string;
        theme: keyof typeof themes;
        customWord?: string;
    } = body;

    const room = rooms[roomCode];

    if (!room)
        return NextResponse.json({ error: "Room not found" }, { status: 404 });

    if (room.hostId !== hostId) {
        return NextResponse.json(
            { error: "Only host can set theme" },
            { status: 403 }
        );
    }

    let chosenWord = customWord;

    if (!chosenWord) {
        const list = themes[theme];
        if (!list) {
            return NextResponse.json(
                { error: "Theme not found" },
                { status: 404 }
            );
        }
        chosenWord = list[Math.floor(Math.random() * list.length)];
    }

    room.theme = theme;
    room.word = chosenWord;

    broadcast(room.code, "theme-chosen", { theme, chosenWord, room });

    return NextResponse.json({ ok: true, theme, word: chosenWord, room });
}
