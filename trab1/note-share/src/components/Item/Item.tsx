import { useState } from "react"
import Note from "../Note/Note"

interface ItemProps {
    note: Note
    groupID: string
    token: string
    setSelectedNote: React.Dispatch<React.SetStateAction<APIResponse['notes'][0]>>
    showNote: React.Dispatch<React.SetStateAction<boolean>>
}

const Item = (props: ItemProps) => {

    return (
        <div>
            <br-item
                hover="true"
                key={props.note.title}
                onClick={() => {
                    props.setSelectedNote(props.note)
                    props.showNote(true)
                }}
            >
                {props.note.title}
            </br-item>
        </div>
    )
}

export default Item