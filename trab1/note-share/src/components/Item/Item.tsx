import { useState } from "react"

interface ItemProps {
    title: string,
    body: string,
    noteId: number
}
const Item = (props: ItemProps) => {
    const [title, setTitle] = useState<string>(props.title)
    const [body, setBody] = useState<string>(props.body)

    return (
        <br-item>
        </br-item>
    )
}

export default Item