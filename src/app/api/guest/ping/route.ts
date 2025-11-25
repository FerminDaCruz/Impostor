import { supabase } from "@/src/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { id } = await req.json();

    const { error } = await supabase
        .from("guest_users")
        .update({ last_active: new Date() })
        .eq("id", id);

    if (error)
        return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
}
