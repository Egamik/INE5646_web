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
        const response = await axios.delete("http://")
    } catch (err) {
        console.log(err)
    }
}
/**
 * Funciona como popup
 */
const Note = (props: NoteProps) => {
    const [text, setText] = useState<string>()
    const [content, setContent] = useState<string>()

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContent(event.target.value);
    }
    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value)
    }

    // Sends delete request
    const onDeleteClick = () => {
        deleteNote(props.groupID, props.noteID).then(result => {
            //
        })
        .catch(err => {
            console.log(err)
        })
    }

    const onSaveClick = () => {
        //request, carrega componente de loading, retorna mensagem
        console.log("click salve")
    }

    return (
        <div>
            <h2>{props.title}</h2>
            <textarea 
                onChange={handleContentChange}
                placeholder={text}
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
            />
        </div>
    )
}

export default Note;