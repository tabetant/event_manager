'use client'
import { useState, useEffect } from 'react';

type Event = {
    id: number;
    title: string;
    date: string;
    createdAt: string;
}

export default function EventsTable() {
    const [events, setEvents] = useState<Event[]>([]);
    const [sort, setSort] = useState('event_date');
    const [filter, setFilter] = useState('none');
    const [edits, setEdits] = useState<{ [id: number]: { field: string, value: string } }>({});
    const [date, setDate] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchEvents = async () => {
        setLoading(true);          // Optional: Show loading state
        setError('');              // Clear previous errors
        try {
            const res = await fetch(`/api/events?sort=${sort}&filter=${filter}`);
            if (!res.ok) {
                throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
            }
            const data = await res.json();
            setEvents(data);
        } catch (err: any) {
            console.error('Error fetching events:', err);
            setError(err.message || 'Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [sort, filter]);

    async function deleteEvent(event: Event) {
        const res = await fetch('/api/events', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: event.id }),
        })
        if (!res.ok) {
            console.error('Failed to delete event');
            return;
        }
        setLoading(true);
        await fetchEvents();
        setLoading(false);
    }

    async function editEvent(id: number, field: string, value: string) {
        const res = await fetch('/api/events', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, component: field, newValue: value }),
        })
        if (!res.ok) {
            console.error('Failed to edit event');
            return;
        }
        setLoading(true);
        await fetchEvents();
        setLoading(false);
    }

    async function addEvent(date: string, title: string) {
        console.log({ title, date });
        const res = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, date: date }),
        })
        if (!res.ok) {
            console.error('Failed to add event');
            return;
        }
        setLoading(true);
        await fetchEvents();
        setLoading(false);
    }

    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <p className='text-red-500'>{error}</p>}
            <input type="text" name="title" placeholder="Event Title" onChange={(e) => setTitle(e.target.value)} required />
            <input type="date" name="date" onChange={(e) => setDate(e.target.value)} required />
            <button className='bg-green-500' onClick={() => addEvent(date, title)}>Create Event</button>
            <div className='flex flex-row justify-center px-4 py-2'>
                <div>
                    <h1>Sort</h1>
                    <select onChange={(e) => setSort(e.target.value)} value={sort}>
                        <option value='event_date'>Event Date</option>
                        <option value='created_date'>Created Date</option>
                    </select>
                </div>
                <div>
                    <h1>Filter</h1>
                    <select onChange={(e) => setFilter(e.target.value)} value={filter}>
                        <option value='none'>No Filter</option>
                        <option value='upcoming'>Only Upcoming</option>
                    </select>
                </div>
            </div>
            <table className='mx-auto'>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Date</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event.id}>
                            <td className='px-4 py-2'>{event.title}</td>
                            <td className='px-4 py-2'>{event.date.toString()}</td>
                            <td className='px-4 py-2'>
                                <select onChange={(e) => {
                                    setEdits(prev => ({ // updating state based on previous state to avoid overwriting
                                        ...prev, // keep all previous edits for all events
                                        [event.id]: { // updates specific event and adds/modifies its data
                                            ...prev[event.id], // if there is already data for this event keep it
                                            field: e.target.value, // set/overwrite the field to be what was selected
                                        }
                                    }))
                                }}>
                                    <option value='None'>None</option>
                                    <option value='title'>Title</option>
                                    <option value='date'>Date</option>
                                </select>

                                <input
                                    disabled={!edits[event.id]?.field || edits[event.id].field === 'none'}
                                    type={edits[event.id]?.field === 'date' ? 'date' : 'text'}
                                    onChange={(e) => {
                                        setEdits(prev => ({ // updating state based on previous state to avoid overwriting
                                            ...prev, // keep all previous edits for all events
                                            [event.id]: { // updates specific event and adds/modifies its data
                                                ...prev[event.id], // if there is already data for this event keep it
                                                value: e.target.value, // set/overwrite the value to be what was selected
                                            }
                                        }))
                                    }} />
                                <button className='bg-yellow-500' onClick={() => {
                                    if (!edits[event.id]?.field || !edits[event.id]?.value) {
                                        alert('Please select a field and enter a value.');
                                        return;
                                    }
                                    editEvent(event.id, edits[event.id].field, edits[event.id].value)
                                }}><strong>Edit Event</strong></button>
                            </td>
                            <td className='px-4 py-2'>
                                <button className='bg-red-500' onClick={() => deleteEvent(event)}><strong>Delete</strong></button>
                            </td>
                        </tr >
                    ))
                    }
                </tbody>
            </table >
        </>
    )
}