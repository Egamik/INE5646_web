import { useEffect, useState } from "react";
import axios from "axios";
import AddNote from "../components/AddNote/AddNote";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Item from "../components/Item/Item";
import Note from "../components/Note/Note";

// Funcao responsavel por requisicao de notas
/**
 * Recebe token e id de usuario
 * Faz requisicao para pegar todos os ids de grupos aos quais o usuario
 * faz parte
 * Faz requisicao sobre todos os grupos encontrados para obter notas salvas em grupos
 * @param token accessToken
 * @param userID user id
 * @returns Note[]
 */
async function requestNotes(token: string, userID: string) {
    try {
        const getUserGOptions = {
            data: {
                accessToken: token,
                user_id: userID
            }
        }
        
        // Pega ids dos grupos de notas de um usuario
        const groupIDS = await axios.get<APIGetUserGroupsResponse>(
            'http://progweb.isac.campos.vms.ufsc.br:8080/user-groups',
            getUserGOptions
        )
        console.log(groupIDS)

        // Se nao existem notas associadas retornar
        if (groupIDS.data.groups_ids.length === 0) {
            return []
        } 
        else {
            // Para cada id de grupo de notas pegar notas
            const notes: Note[] = []
            groupIDS.data.groups_ids.forEach(id => {
                const options = {
                    data: {
                        accessToken: token,
                        group_id: id
                    }
                }
                axios.get<APIGetGroupResponse>(
                    "http://progweb.isac.campos.vms.ufsc.br:8080/group",
                    options
                ).then(response => {
                    console.log('Response de getGroup: ', response)
                    if (response.data.notes.length !== 0) {
                        notes.concat(response.data.notes)
                    }
                }).catch(error => {
                    console.log(error)
                    return { error: true }
                })
            })
            return notes
        }
    } catch (err) {
        console.log(err);
        return { error: true };
    }
}

/**
 * 
 * @param token 
 * @param uid 
 * @returns string[] contendo ids dos grupos aos quais usuario participa
 */
async function getUserGroups(token: string, uid: string) {
    // user-groups GET
    const options = {
        data: {
            accessToken: token,
            user_id: uid
        }
    }
    try {
        const response = await axios.post<APIGetUserGroupsResponse>(
            'http://progweb.isac.campos.vms.ufsc.br:8080/user-groups',
            {
                accessToken: token,
                user_id: uid
            }
        )

        if (response.data.groups_ids) {
            return response.data.groups_ids
        }
        return []
    } catch (error) {
        console.log('Error em getUserGroups MainPage', error)
        return []
    }
}

interface MainPageProps {
    token: string,
    userID: string
}

const MainPage = (props: MainPageProps) => {
    const initSelected: Note = {
        _id: "",
        title: "",
        content: "",
        status: ""
    }

    const [notes, setNotes] = useState<APIResponse["notes"]>([]);
    // [_id_nota, _id_grupo]
    const [groups, setGroups] = useState<string[]>([])
    const [selectedNote, setSelectedNote] = useState<APIResponse['notes'][0]>(initSelected)
    const [showNote, setShowNote] = useState<boolean>(false)
    const [showAddNote, setShowAddNote] = useState<boolean>(false)

    // Pega notas do servidor antes de renderizar
    useEffect(() => {
        console.log('Use effect de MainPage: ', props)
        // Pegar groupID do user antes
        getUserGroups(props.token, props.userID).then((result) => {
            if (result.length !== 0) {
                setGroups(result)
            }
        }).catch((error) => {

            console.log('Error while getting user groups', error)
        })
        if (groups.length !== 0) {
            requestNotes(props.token, props.userID)
            .then((result) => {
                if (Array.isArray(result)) {
                    setNotes(result);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }, []);

    const closePopUp = () => {
        setShowAddNote(false)
    }
    // Gera componentes filhos
    const generateItems = (notes: APIResponse["notes"], token: string): JSX.Element[] => {
        const result: JSX.Element[] = []
        notes.forEach(note => {
            result.push(
                <div>
                    <Item 
                        note={note} 
                        groupID={token} 
                        token={""}
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
                    setShow={closePopUp}
                />}
            </div>
            <div>
                {/* Popup Note */}
                {/* {showNote && 
                <Note 
                    token={props.token} 
                    groupID={props.groupID} 
                    note={selectedNote} 
                    toggleClose={setShowNote}
                />
                } */}
            </div>
        </div>
    );
};

export default MainPage;
