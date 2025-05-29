import EventsTable from './ui/EventsTable'

export default async function Page() {
  return (
    <div>

      <h1 className='text-2xl font-bold'>Event List</h1>
      <EventsTable />
    </div >
  );
}
