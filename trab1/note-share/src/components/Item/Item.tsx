import { useState } from "react"
import Note from "../Note/Note"

interface ItemProps {
    note: Note
    groupID: string
    token: string
}
const Item = (props: ItemProps) => {

    const [toggleNote, setToggleNote] = useState(false)


    return (
        <div>
            <br-item
                hover="true"
                key={props.note.title}
            >
                {props.note.title}
            </br-item>
            {toggleNote && 
            <Note 
                token={props.token}
                groupID={props.groupID} 
                note={props.note} 
            />}
        </div>
    )
}

export default Item