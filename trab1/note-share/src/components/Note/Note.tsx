import axios from "axios";
import { useState } from "react";

interface NoteProps {
    title: string,
    body: string,
    groupID: number,
    noteID: number,
}

async function deleteNote(groupID: number, noteID: number) {
    try {
        const response = await axios.delete(
            "http://progweb.isac.campos.vms.ufsc.br:8080/note",
            {
                
            }
        )
    } catch (err) {
        console.log(err)
    }
}
/**
 * Funciona como popup
 */
const Note = (props: NoteProps) => {
    const [title, setTitle] = useState<string>()
    const [content, setContent] = useState<string>()

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }
    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value)
    }

    // Sends delete request
    const onDeleteClick = () => {
        deleteNote(props.groupID, props.noteID).then(result => {
            // se deu bom chamar mensagem de success
        })
        .catch(err => {
            console.log(err)
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
    )
}

export default Note;