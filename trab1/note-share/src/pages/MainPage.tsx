import React, { useEffect, useState } from "react";
import axios from "axios";
import AddNote from "../components/AddNote/AddNote";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Item from "../components/Item/Item";

async function requestNotes() {
    const ept: APIResponse["notes"] = []
    try {
        const response = await axios.post<any, APIResponse>("http://api-url");
        if (Object.prototype.hasOwnProperty.call(response, "notes")) {
            if (Array.isArray(response.notes)) {
                return response.notes;
            }
            return ept
        }
        return ept
    } catch (err) {
        console.log(err);
        return { error: true };
    }
}

function generateItems(notes: APIResponse["notes"]): JSX.Element[] {
    const result: JSX.Element[] = []
    notes.forEach(note => {
        result.push(
            <Item 
                title={note.title} 
                content={note.content}
                // Id do grupo
                noteID={0}
                groupID={0}
            />
        )
    })
    return notes.map((note, index) => (
        <br-item 
            hover={true} 
            key={index}
            // onclick abre note
        >
            {note.title}
        </br-item>
    ));
}

const MainPage: React.FC = () => {
    const [notes, setNotes] = useState<APIResponse["notes"]>([]);
    const [showAddNote, setShowAddNote] = useState<boolean>(false)

    useEffect(() => {
        requestNotes()
            .then((result) => {
                if (Array.isArray(result)) {
                    setNotes(result);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const closePopUp = () => {
        setShowAddNote(false)
    }

    return (
        <div>
            <h1>Welcome to NoteShare</h1>
            <p>Add and share notes with your contacts</p>
            <br />
            {/* Note list */}
            <div>
                <h2>Note list</h2>
                <br-list
                    density="small"
                >
                    <br-item 
                        hover={true} 
                        active={true} 
                        onClick={() => setShowAddNote(true)}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Add new note.
                    </br-item>
                    {generateItems(notes)}
                </br-list>
            </div>
            <div>
                {showAddNote && 
                <AddNote 
                    setShow={closePopUp}
                />}
            </div>
        </div>
    );
};

export default MainPage;
