

async function addNote() {
    let title = document.getElementById("atitle")
    let body = document.getElementById("abody")
    return
}

const AddNote = () => {
    
    return(
        <div>
            <form>
                <br-input
                    label="Title"
                    placeholder="Enter your title"
                    id="atitle"
                />
                <br-input
                    label="Note Text"
                    id="abody"
                />
                <br-button 
                    label="Add Note"
                    type="primary"
                    submit="true"
                    onClick={addNote}
                />
            </form>

        </div>
    )
}

export default AddNote