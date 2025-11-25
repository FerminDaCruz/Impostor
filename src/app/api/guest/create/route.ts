import { supabase } from "@/src/lib/supabase";
import { NextResponse } from "next/server";

function generateGuestName() {
    const animals = [
        "LaCobra",
        "Davo",
        "Benito",
        "Teo",
        "Agusneta",
        "Will",
        "Vincent",
    ];
    const number = Math.floor(Math.random() * 900) + 100;
    return animals[Math.floor(Math.random() * animals.length)] + number;
}

export async function POST() {
    const nickname = generateGuestName();

    const { data, error } = await supabase
        .from("guest_users")
        .insert({ nickname, avatar_url: null })
        .select()
        .single();

    if (error)
        return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ guest: data });
}
