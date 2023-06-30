import { useEffect, useState } from "react";
import axios from "axios";
import AddNote from "../components/AddNote/AddNote";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Item from "../components/Item/Item";
import Note from "../components/Note/Note";

async function requestNotes(token: string, groupID: string) {
    const ept: APIResponse["notes"] = []
    try {
        // Concertar request type interface
        const options = {
            data: {
                accessToken: token,
                group_id: groupID
            }
        }
        const response = await axios.get<APIGetGroupResponse>(
            "http://progweb.isac.campos.vms.ufsc.br:8080/group",
            options
        );
        if (Object.prototype.hasOwnProperty.call(response, "notes")) {
            if (Array.isArray(response.data.notes)) {
                return response.data.notes;
            }
            return ept
        }
        return ept
    } catch (err) {
        console.log(err);
        return { error: true };
    }
}

interface MainPageProps {
    token: string,
    groupID: string
}

const MainPage = (props: MainPageProps) => {
    const initSelected: Note = {
        _id: "",
        title: "",
        content: "",
        status: ""
    }

    const [notes, setNotes] = useState<APIResponse["notes"]>([]);
    const [selectedNote, setSelectedNote] = useState<APIResponse['notes'][0]>(initSelected)
    const [showNote, setShowNote] = useState<boolean>(false)
    const [showAddNote, setShowAddNote] = useState<boolean>(false)

    // Pega notas do servidor antes de renderizar
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
    // Gera componentes filhos
    const generateItems = (notes: APIResponse["notes"]): JSX.Element[] => {
        const result: JSX.Element[] = []
        notes.forEach(note => {
            result.push(
                <div>
                    <Item 
                        note={note} 
                        groupID={""} 
                        token={""}                        
                    />
                </div>
            )
        })
        return result;
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
                    {/* Item de adicao de notas */}
                    <br-item 
                        hover={true} 
                        active={true} 
                        onClick={() => setShowAddNote(true)}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Add new note.
                    </br-item>
                    {/* Listagem de notas */}
                    {generateItems(notes)}
                </br-list>
            </div>
            <div>
                {/* Popup AddNote */}
                {showAddNote && 
                <AddNote
                    userToken={props.token}
                    setShow={closePopUp}
                />}
            </div>
            <div>
                {/* Popup Note */}
                {showNote && 
                <Note 
                    token={props.token} 
                    groupID={props.groupID} 
                    note={selectedNote} 
                />
                }
            </div>
        </div>
    );
};

export default MainPage;
