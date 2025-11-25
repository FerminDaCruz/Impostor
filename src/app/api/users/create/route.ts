import { supabase } from "@/src/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { nickname, avatar_url } = await req.json();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user)
        return NextResponse.json({ error: "No auth user" }, { status: 401 });

    const { error } = await supabase
        .from("users")
        .insert({ id: user.id, nickname, avatar_url });

    if (error)
        return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
}
