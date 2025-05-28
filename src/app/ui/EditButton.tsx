type Props = {
    editEventAction: (formData: FormData) => void;
    id: number;
}

export default function EditButton({ editEventAction, id }: Props) {
    return (
        <form action={editEventAction}>
            <input type="hidden" name="id" value={id} />
            <select name='component'>
                What would you like to edit?
                <option value='title'>Title</option>
                <option value='date'>Date</option>
            </select>
            <input type="text" name='newValue' placeholder='enter edited field' />
            <button className='bg-yellow-500' type="submit"><strong>Edit Event</strong></button>
        </form>
    )
}