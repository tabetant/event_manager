import { db } from '../db/index'
import { events } from '../db/drizzle/schema'
import EventForm from './ui/EventForm';
import { revalidatePath } from 'next/cache';
import SortButton from './ui/SortButton'
import EventsTable from './ui/EventsTable'

export default async function Page() {
  return (
    <div>
      <EventForm />
      <h1 className='text-2xl font-bold'>Event List</h1>
      <SortButton />
      <EventsTable />
    </div >
  );
}
