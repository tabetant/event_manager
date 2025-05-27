type Props = {
    deleteEventAction: (formData: FormData) => void;
    id: number;
}
export default function DeleteButton({ deleteEventAction, id }: Props) {
    return (
        <form action={deleteEventAction}>
            <input type="hidden" name="id" value={id} />
            <button type="submit">Delete Event</button>
        </form>
    );
}