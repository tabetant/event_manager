import { gt, asc, eq } from 'drizzle-orm';
import { db } from '../../../db/index'
import { events } from '../../../db/drizzle/schema'

export async function GET(request: Request) {
    l
    const url = new URL(request.url);
    const sort = url.searchParams.get('sort') ?? 'event_date';
    const filter = url.searchParams.get('filter') ?? 'none';
    const validSorts = ['event_date', 'created_date'];
    const validFilters = ['none', 'upcoming'];

    if (!validSorts.includes(sort) || !validFilters.includes(filter)) {
        throw new Error('Invalid sort or filter option');
    }
    const whereClause =
        filter === 'upcoming' ? gt(events.date, new Date()) : undefined;

    const orderClause =
        sort === 'event_date'
            ? asc(events.date)
            : asc(events.createdAt);

    const allEvents =
        whereClause !== undefined
            ? await db
                .select()
                .from(events)
                .where(whereClause)
                .orderBy(orderClause)
            : await db.select().from(events).orderBy(orderClause);

    return Response.json(allEvents);
}

export async function POST(request: Request) {
    const body = await request.json();
    const title = body.title as string;
    const date = new Date(body.date as string);

    if (!title || !date || isNaN(date.getTime())) {
        return new Response('Invalid input', { status: 400 });
    }

    await db.insert(events).values({
        title: title as string, // Ensure type compatibility
        date: date, // Use Date object directly if schema expects Date
        createdAt: new Date(),
    })


    return new Response(JSON.stringify({ message: 'Event created' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function DELETE(request: Request) {
    const body = await request.json();
    const id = Number(body.id);

    if (!id || isNaN(id)) {
        return new Response('Invalid input', { status: 400 });
    }
    await db.delete(events).where(eq(events.id, id));

    return new Response(JSON.stringify({ message: 'Event Deleted' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function PATCH(request: Request) {
    const body = await request.json();
    const id = Number(body.id);
    const component = body.component as string;
    if (!id || isNaN(id) || !component || !body.newValue) {
        return new Response('Invalid input', { status: 400 });
    }
    if (component === 'title') {
        const newTitle = body.newValue as string;
        await db.update(events).set({ title: newTitle }).where(eq(events.id, id));
    }
    else if (component === 'date') {
        const newDate = new Date(body.newValue as string);
        await db.update(events).set({ date: newDate }).where(eq(events.id, id));
    }
    else {
        return;
    }
    return new Response(JSON.stringify({ message: 'Event updated' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });

}