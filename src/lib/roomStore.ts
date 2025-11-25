type Player = {
    id: string;
    username: string;
    avatar: string;
    lastActive: number;
};

export type Room = {
    code: string;
    hostId: string;
    players: Player[];
    status: "waiting" | "playing";
    impostorId: string | null;
    impostorIds: string[];
    createdAt: number;
    lastActive: number;
    theme: string | null;
    word: string | null;
};

export const rooms: Record<string, Room> = {};
