import { useEffect, useState } from "react";
import AddNote from "../components/AddNote/AddNote";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Item from "../components/Item/Item";
import Note from "../components/Note/Note";
import { getUserGroups, getNotes } from "../utils/requests";


interface MainPageProps {
    token: string,
    userID: string,
}

const MainPage = (props: MainPageProps) => {
    const initSelected: Note = {
        _id: "",
        title: "",
        content: "",
        status: ""
    }

    const [notes, setNotes] = useState<APIResponse["notes"]>([]);
    const [groups, setGroups] = useState<string[]>([])
    const [selectedNote, setSelectedNote] = useState<APIResponse['notes'][0]>(initSelected)
    const [showNote, setShowNote] = useState<boolean>(false)
    const [showAddNote, setShowAddNote] = useState<boolean>(false)

    // Pega notas do servidor antes de renderizar
    useEffect(() => {
        console.log('Use effect de MainPage: ', JSON.stringify(props));
        // Pegar groupID do user antes
        getUserGroups(props.token, props.userID)
            .then((result) => {
                if (result.length !== 0) {
                    setGroups(result);
                }
            })
            .catch((error) => {
                console.log('Error while getting user groups', error);
            });
    }, []);

    // Fetch notes when the groups state changes
    useEffect(() => {
        if (groups.length !== 0) {
            getNotes(props.token, props.userID)
                .then((result) => {
                    if (Array.isArray(result)) {
                        setNotes(result);
                    }
                })
                .catch((err) => {
                    console.log('Error while getting notes: ', err);
                });
        }
    }, [groups]);

    const closePopUp = () => {
        setShowAddNote(false)
    }
    // Gera componentes filhos dinamicamente
    const generateItems = (notes: APIResponse["notes"], token: string): JSX.Element[] => {
        const result: JSX.Element[] = []
        notes.forEach(note => {
            result.push(
                <div>
                    <Item 
                        note={note} 
                        groupID={token} 
                        token={token}
                        setSelectedNote={setSelectedNote} 
                        showNote={setShowNote}            
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
                    {generateItems(notes, props.token)}
                </br-list>
            </div>
            <div>
                {/* Popup AddNote */}
                {showAddNote && 
                <AddNote
                    userToken={props.token}
                    userID={props.userID}
                    setShow={closePopUp}
                />}
            </div>
            <div>
                {/* Popup Note */}
                {showNote && 
                <Note 
                    token={props.token} 
                    groupID={groups[0]} // Refatorar 
                    note={selectedNote} 
                    toggleClose={setShowNote}
                />
                }
            </div>
        </div>
    );
};

export default MainPage;
