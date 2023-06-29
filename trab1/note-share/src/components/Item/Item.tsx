import { useState } from "react"
import Note from "../Note/Note"

interface ItemProps {
    title: string,
    content: string,
    noteID: number,
    groupID: number
}
const Item = (props: ItemProps) => {

    const [toggleNote, setToggleNote] = useState(false)


    return (
        <div>
            <br-item
                hover="true"
                key={props.title}
            >
                {props.title}
            </br-item>
            {toggleNote && 
            <Note 
                title={""} 
                body={""} 
                groupID={""} 
                noteID={""} 
            />}
        </div>
    )
}

export default Item