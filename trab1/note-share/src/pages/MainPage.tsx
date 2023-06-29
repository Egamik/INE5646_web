import { useEffect, useState } from "react";
import axios from "axios";
import AddNote from "../components/AddNote/AddNote";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Item from "../components/Item/Item";
import Note from "../components/Note/Note";

async function requestNotes(token: string, groupID: string) {
    let ept: APIResponse["notes"] = []
    try {
        // Concertar request type interface
        const response = await axios.get<any, APIResponse>(
            "http://progweb.isac.campos.vms.ufsc.br:8080/group",
            {
                accessToken: token,
                group_id: groupID
            }
        );
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
            <div>
                <Item 
                    title={note.title} 
                    content={note.content}
                    // Id do grupo
                    noteID={0}
                    groupID={0}
                />
            </div>
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

interface MainPageProps {
    token: string,
    groupID: string
}

const MainPage = (props: MainPageProps) => {
    const [notes, setNotes] = useState<APIResponse["notes"]>([]);
    const [selectedNote, setSelectedNote] = useState<APIResponse['notes'][0] | null>(null)
    const [showNote, setShowNote] = useState<boolean>(false)
    const [showAddNote, setShowAddNote] = useState<boolean>(false)

    useEffect(() => {
        requestNotes(props.token, props.groupID)
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
                    userToken={props.token}
                    setShow={closePopUp}
                />}
            </div>
            <div>
                {showNote &&
                <Note 
                    token={props.token} 
                    groupID={props.groupID} 
                    title={props} 
                    body={""} 
                    noteID={""} 
                    note={[]} 
                />
                }
            </div>
        </div>
    );
};

export default MainPage;
