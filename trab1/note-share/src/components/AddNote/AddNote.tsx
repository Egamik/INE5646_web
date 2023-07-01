import React, { useState } from "react";
import Message from "../Message/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from '@fortawesome/free-solid-svg-icons';
import { requestAddNote } from "../../utils/requests";

interface AddNoteProps {
    userToken: string,
    userID: string,
    setShow: () => void
}

/**
 * Componente popup para adicao de novas notas
 * @param props 
 * @returns 
 */
const AddNote = (props: AddNoteProps) => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [showMessage, setShowMessage] = useState(false)
    const [messageState, setMessageState] = useState("")
    const [messageStr, setMessageStr] = useState("")

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };

    // Seta parametros para mensagem para usuario
    const handleAddNote = () => {
        requestAddNote(title, content, props.userToken, "", props.userID).then(result => {
            if (typeof(result) === 'string') {
                setMessageState("success")
                setMessageStr("Note added successfully!")
                setShowMessage(true)
            } else {
                // carregar mensagem de erro
                setMessageState("danger")
                setMessageStr("Something whent wrong :(")
                setShowMessage(true)
            }
        }).catch(error => {
            setMessageState("danger")
            setMessageStr("Something went wrong :(")
            setShowMessage(true)
            console.log(error)
        })
        setTitle("");
        setContent("");
    };

    return (
        <div className="popup">
            <p>Add New Note</p>
            {/* Fecha popup */}
            <br-button 
                circle="true"
                type="secondary"
                onClick={props.setShow}
            >
                <FontAwesomeIcon icon={faX} />
            </br-button>
            <div>
                <br-input 
                    label="Title"
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                />
                <br-divider />
                <label htmlFor="content">Content:</label>
                <textarea 
                    id="content" 
                    value={content} 
                    onChange={handleContentChange} 
                />
                <br />
                <br-button
                    label="Add Note"
                    type="primary"
                    submit="true"
                    onClick={handleAddNote}
                />
            </div>
            <div>
                {showMessage && <Message state={messageState} text={messageStr} />}
            </div>
        </div>
    );
};

export default AddNote;
