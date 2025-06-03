import EventsTable from '../ui/EventsTable'
export default async function Dashboard() {

  return (
    <div>
      <h1 className='text-2xl font-bold'>Event Manager</h1>
      <EventsTable />
    </div >
  );
}
