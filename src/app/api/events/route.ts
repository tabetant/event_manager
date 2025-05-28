import { gt, asc, desc } from 'drizzle-orm';
import { db } from '../../../db/index'
import { events } from '../../../db/drizzle/schema'

export async function GET(request: Request) {
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