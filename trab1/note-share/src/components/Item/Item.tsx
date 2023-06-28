interface ItemProps {
    title: string,
    content: string,
    noteID: number,
    groupID: number
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