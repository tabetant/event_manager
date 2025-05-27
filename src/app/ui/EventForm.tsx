
type Props = {
    createEventAction: (formData: FormData) => void;
}
export default function EventForm({ createEventAction }: Props) {
    return (
        <form action={createEventAction}>
            <input type="text" name="title" placeholder="Event Title" required />
            <input type="date" name="date" required />
            <button type="submit">Create Event</button>
        </form>
    );
} 