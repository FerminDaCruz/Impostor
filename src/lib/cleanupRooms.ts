import { rooms } from "./roomStore";

export function cleanupRooms() {
    const now = Date.now();
    const maxInactivity = 1000 * 60 * 30;

    Object.keys(rooms).forEach((code) => {
        const room = rooms[code];

        if (now - room.lastActive > maxInactivity) {
            delete rooms[code];
            return;
        }

        room.players = room.players.filter(
            (p) => now - p.lastActive < 1000 * 60 * 10
        );
    });
}
