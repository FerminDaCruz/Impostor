type Event = any;

const roomStreams: Record<string, Set<WritableStreamDefaultWriter>> = {};

export function subscribe(
    roomCode: string,
    writer: WritableStreamDefaultWriter
) {
    if (!roomStreams[roomCode]) {
        roomStreams[roomCode] = new Set();
    }
    roomStreams[roomCode].add(writer);
}

export function unsubscribe(
    roomCode: string,
    writer: WritableStreamDefaultWriter
) {
    const set = roomStreams[roomCode];
    if (!set) return;

    set.delete(writer);
}

export async function broadcast(
    roomCode: string,
    eventName: string,
    data: Event
) {
    const set = roomStreams[roomCode];
    if (!set) return;

    const payload =
        `event: ${eventName}\n` + `data: ${JSON.stringify(data)}\n\n`;

    for (const writer of set) {
        try {
            await writer.write(payload);
        } catch {
            set.delete(writer);
        }
    }
}
