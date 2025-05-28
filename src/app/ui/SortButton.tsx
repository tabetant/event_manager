
export default function SortButton() {
    return (
        <form>
            Sort
            <select className='text-right'>
                <option value='auto'>Auto</option>
                <option value='event_date'>Event Date</option>
                <option value='created_date'>Creation Date</option>
            </select>
            <div>
                Filter
                <select className='text-right'>
                    <option value='none'>No Filter</option>
                    <option value='upcoming'>Only Upcoming</option>
                </select>
            </div>
            <div>
                <input type='submit' value='Apply' />
            </div>
        </form>
    );
}