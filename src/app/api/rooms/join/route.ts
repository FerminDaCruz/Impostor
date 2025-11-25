export const runtime = "nodejs";

import { cleanupRooms } from "@/src/lib/cleanupRooms";
import { rooms } from "@/src/lib/roomStore";
import { supabase } from "@/src/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    cleanupRooms();
    const body = await req.json();
    const { roomCode, userId } = body;

    const room = rooms[roomCode];

    if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const { data: user, error } = await supabase
        .from("guest_users")
        .select("*")
        .eq("id", userId)
        .single();

    if (error || !user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const exist = room.players.some((p) => p.id === user.id);
    if (!exist) {
        room.players.push({
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            lastActive: Date.now(),
        });
    }

    return NextResponse.json({ ok: true, room });
}
