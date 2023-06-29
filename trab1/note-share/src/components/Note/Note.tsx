import axios from "axios";
import { useState } from "react";

interface NoteProps {
    title: string,
    body: string,
    groupID: string
}

async function deleteNote(groupID: string) {
    try {
        const response = await axios.delete(
            "http://progweb.isac.campos.vms.ufsc.br:8080/note",
            {
                group_id: groupID
            }
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

async function addNote(title: string, content: string) {
    try {
        const response = await axios.post(
            "http://progweb.isac.campos.vms.ufsc.br:8080/note",
            {
                title:title,
                content:content,
                status: ""
            }
        )
        if (response.status === 200) {
            return true
        }
        return false
    } catch(error) {
        console.log(error)
        return false
    }
}

async function editNote(groupID: string, note: string) {
    try {
        const response = await axios.put(
            "http://progweb.isac.campos.vms.ufsc.br:8080/note",
            {
                group_id: groupID
                note: note
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
/**
 * Funciona como popup
 */
const Note = (props: NoteProps) => {
    const [title, setTitle] = useState<string>()
    const [content, setContent] = useState<string>()
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

    // Sends delete request
    const onDeleteClick = () => {
        deleteNote(props.groupID, props.noteID).then(result => {
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

    const onSaveClick = () => {
        //request, carrega componente de loading, retorna Message
        
        console.log("click salve")
    }

    const onShareClick = () => {
        // n sei
        console.log('share')
    }

    return (
        <div>
            <div>
                <h2>{props.title}</h2>
                <textarea 
                    onChange={handleContentChange}
                    placeholder={title}
                />
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
            <div>
                {}
            </div>
        </div>
    )
}

export default Note;