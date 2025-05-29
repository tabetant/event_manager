'use client'
import { useState, useEffect } from 'react';
import { revalidatePath } from 'next/cache';
import { db } from '../../db/index'

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

    const fetchEvents = async () => {
        const res = await fetch(`api/events?sort=${sort}&filter=${filter}`);
        const data = await res.json();
        setEvents(data);
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
        await fetchEvents();
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
        await fetchEvents();
    }

    async function addEvent(date: string, title: string) {
        const res = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, date: date }),
        })
        if (!res.ok) {
            console.error('Failed to add event');
            return;
        }
        await fetchEvents();
    }

    return (
        <>
            <input type="text" name="title" placeholder="Event Title" onChange={(e) => setTitle(e.target.value)} required />
            <input type="date" name="date" onChange={(e) => setDate(e.target.value)} required />
            <button className='bg-green-500' onClick={() => addEvent(date, title)}>Create Event</button>
            <table className='mx-auto'>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Date</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                {events.map(event => (
                    <tr key={event.id}>
                        <td className='px-4 py-2'>{event.title}</td>
                        <td className='px-4 py-2'>{event.date.toString()}</td>
                        <td>
                            <select onChange={(e) => {
                                setEdits(prev => ({ // updating state based on previous state to avoid overwriting
                                    ...prev, // keep all previous edits for all events
                                    [event.id]: { // updates specific event and adds/modifies its data
                                        ...prev[event.id], // if there is already data for this event keep it
                                        field: e.target.value, // set/overwrite the field to be what was selected
                                    }
                                }))
                            }}>
                                <option value='title'>Title</option>
                                <option value='date'>Date</option>
                            </select>
                        </td>
                        <td>
                            <input type={(edits[event.id].field === 'date') ? 'date' : 'text'} onChange={(e) => {
                                setEdits(prev => ({ // updating state based on previous state to avoid overwriting
                                    ...prev, // keep all previous edits for all events
                                    [event.id]: { // updates specific event and adds/modifies its data
                                        ...prev[event.id], // if there is already data for this event keep it
                                        value: e.target.value, // set/overwrite the value to be what was selected
                                    }
                                }))
                            }} />
                        </td>
                        <td className='px-4 py-2'>
                            <button onClick={() => editEvent(event.id, edits[event.id].field, edits[event.id].value)}>Edit Event</button>
                        </td>
                        <td className='px-4 py-2'>
                            <button onClick={() => deleteEvent(event)}>Delete</button>
                        </td>
                    </tr >
                ))
                }
            </table >
        </>
    )
}