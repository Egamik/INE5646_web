import axios from "axios";
import { useState } from "react";
import Message from "../Message/Message";

// Requisicao para deletar nota
async function deleteNote(groupID: string, token: string) {
    try {
        const options = {
            data: {
                accessToken: token,
                group_id: groupID
            }
        }
        const response = await axios.delete(
            "http://progweb.isac.campos.vms.ufsc.br:8080/note",
            options
        )
        if (response.status === 200) {
            return true
        }
        return false
    } catch (err) {
        console.log(err)
        return false
    }
}

// Requisicao para editar notas
async function editNote(title: string, content: string,
    groupID: string, noteID: string, token: string) 
    {
    try {
        const response = await axios.put(
            "http://progweb.isac.campos.vms.ufsc.br:8080/note",
            {
                group_id: groupID,
                accessToken: token,
                note: {
                    title: title,
                    content: content,
                    status: "",
                    _id: noteID
                }
            }
        )
        if (response.status === 200) {
            return 0
        }
        if (response.status === 204) {
            return 1
        }
        return 2
    } catch (error) {
        console.log(error)
        return 2
    }
}

interface NoteProps {
    token: string,
    groupID: string,
    note: APIResponse['notes'][0]
    toggleClose: React.Dispatch<React.SetStateAction<boolean>>
}
/**
 * Componente para uma nota
 * Funcionamento como popup
 */
const Note = (props: NoteProps) => {
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [showMessage, setShowMessage] = useState<boolean>(false)
    const [messageStr, setMsgStr] = useState<string>('')
    const [messageState, setMsgState] = useState<string>('')

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }
    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log('aloalo madureira')
        setContent(event.target.value)
    }

    // Handler de delete
    const onDeleteClick = () => {
        deleteNote(props.groupID, props.note._id).then(result => {
            setShowMessage(true)
            if (result) {
                setMsgState('success')
                setMsgStr('Note deleted')
                return
            }
            setMsgState('danger')
            setMsgStr('Something went wrong')
        })
        .catch(err => {
            console.log(err)
            setShowMessage(true)
            setMsgState('danger')
            setMsgStr('Something went wrong')
        })
    }

    // Handler de save
    const onSaveClick = () => {
        //request, carrega componente de loading, retorna Message
        editNote(title, content, props.groupID, props.note._id, props.token).then(result => {
            switch (result) {
                case 0:
                    setMsgState('success')
                    setMsgStr('Note updated')
                    break
                case 1:
                    setMsgState('warning')
                    setMsgStr('Couldn\'t update note')
                    break
                case 2:
                    setMsgState('danger')
                    setMsgStr('Something went wrong')
                    break
                default:
                    break
            }
            setShowMessage(true)
        }).catch(error => {
            console.log(error)
            setMsgState('danger')
            setMsgStr('Something went wrong')
            setShowMessage(true)
        })
        console.log("click salve")
    }

    const onShareClick = () => {
        // n sei
        console.log('share')
    }

    return (
        <div>
            <div>
                <div>
                    {/* Transformar titulo em editavel */}
                    <h2>{props.note.title}</h2>
                    <br-button 
                        type="secondary"
                        circle="true"
                        onClick={props.toggleClose(true)}
                    />
                </div>
                <textarea 
                    onChange={handleContentChange}
                    placeholder={title}
                />
                <div>
                    <br-button
                        label="Save note"
                        type="primary"
                        onClick={onSaveClick}
                    />
                    <br-button
                        label="Delete note"
                        type="secondary"
                        onClick={onDeleteClick}
                    />
                    <br-button 
                        type="secondary"
                        circle="true"
                        icon="share-nodes"
                        onClick={onShareClick}
                    />
                </div>
            </div>
            <div>
                {showMessage &&
                <Message 
                    state={messageState} 
                    text={messageStr} />
                }
            </div>
        </div>
    )
}

export default Note;