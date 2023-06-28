interface ItemProps {
    title: string,
    content: string,
    noteId: number
}
const Item = (props: ItemProps) => {

    return (
        <br-item
            hover="true"
            key={props.title}
        >
            {props.title}
        </br-item>
    )
}

export default Item