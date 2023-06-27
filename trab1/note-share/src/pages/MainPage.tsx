import { useEffect, useState } from "react"
import Card from "../components/Card/Card"
import axios from "axios"

function generateItems(input: APIResponse) : JSX.Element[] {
    const cardList: JSX.Element[] = []
    input.noteList.forEach(note => {
        cardList.push((
            <>
                <br-item hover="true">
                    {note.title}
                    {note.body}
                </br-item>
            </>
        ))
    })
    return cardList
}

// Requisita lista de notas
async function requestNotes() {
    try {
        const response = axios.post<any, APIResponse>("http://")
        return response
    } catch (err) {
        console.log(err)
    }
}

/**
 * Lista items
 * ao clicar sobe popup com a nota
 * 
 * @returns 
 */
const MainPage = () => {
    // Click em item seta selectedNote
    const [selectedNote, setSelectedNote] = useState<number>(0);
    const [showPopUp, setShowPopUp] = useState<boolean>(false);
    const [notes, setNotes] = useState<APIResponse>()

    const togglePopUp = () => {
        setShowPopUp(!showPopUp)
    }

    useEffect(() => {
        requestNotes().then(result => {
            //
            setNotes(result)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <div>
            <h1>Welcome to NoteShare</h1>
            <p>
                Add and share notes with your contacts
            </p>
            <br-divider/>
            {/* linhas de notas */}
            <div>
                <br-list
                    title="Note list"
                >
                    <br-item
                        hover="true"
                        selected="true"
                        onClick={()=>{console.log('Request addNote')}}
                    >
                        Add new note.
                    </br-item>
                    { () => {
                        if (notes !== undefined) {
                            generateItems(notes)
                        }
                    } }
                </br-list>
            </div>

        </div>
    )
}

export default MainPage