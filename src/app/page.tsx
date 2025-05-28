import { db } from '../db/index'
import { events } from '../db/drizzle/schema'
import { eq } from 'drizzle-orm';
import EventForm from './ui/EventForm';
import { revalidatePath } from 'next/cache';
import DeleteButton from './ui/DeleteButton';
import EditButton from './ui/EditButton';
import SortButton from './ui/SortButton'


export default async function Page() {

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

  async function editEvent(formData: FormData) {
    'use server';
    const id = Number(formData.get('id'));
    const component = formData.get('component') as string;
    if (component === 'title') {
      const newTitle = formData.get('newValue') as string;
      await db.update(events).set({ title: newTitle }).where(eq(events.id, id));
    }
    else if (component === 'date') {
      const newDate = new Date(formData.get('newValue') as string);
      await db.update(events).set({ date: newDate }).where(eq(events.id, id));
    }
    else {
      return;
    }
    revalidatePath('/');
  }

  return (
    <div>
      <EventForm createEventAction={createEvent} />
      <h1 className='text-2xl font-bold'>Event List</h1>
      <SortButton />
      <table className='mx-auto'>
        <thead>
          <tr>
            <th>Event</th>
            <th>Date</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        {allEvents.map(event => (
          <tr key={event.id}>
            <td className='px-4 py-2'>{event.title}</td>
            <td className='px-4 py-2'>{event.date.toISOString()}</td>
            <td className='px-4 py-2'>
              <EditButton editEventAction={editEvent} id={event.id} />
            </td>
            <td className='px-4 py-2'>
              <DeleteButton deleteEventAction={deleteEvent} id={event.id} />
            </td>
          </tr >
        ))
        }
      </table >
    </div >
  );
}
