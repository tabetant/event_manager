import { db } from '../db/index'
import { events } from '../db/drizzle/schema'
import { eq } from 'drizzle-orm';
import EventForm from './ui/EventForm';
import { revalidatePath } from 'next/cache';
import DeleteButton from './ui/DeleteButton';
export default async function Page() {
  const allEvents = await db.select().from(events);

  async function createEvent(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    const date = new Date(formData.get('date') as string);

    await db.insert(events).values({
      title: title as string, // Ensure type compatibility
      date: date, // Use Date object directly if schema expects Date
      createdAt: new Date(),
    })
    revalidatePath('/');
  }

  async function deleteEvent(formData: FormData) {
    'use server';
    const id = Number(formData.get('id'));
    await db.delete(events).where(eq(events.id, id));
    revalidatePath('/');
  }

  return (
    <div>
      <EventForm createEventAction={createEvent} />
      <h1>Event List</h1>
      <ul>
        {allEvents.map(event => (
          <li key={event.id}>
            {event.title} - {event.date.toISOString()} <DeleteButton deleteEventAction={deleteEvent} id={event.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
