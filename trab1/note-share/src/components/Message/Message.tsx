interface MessageProps {
    state: string,
    text: string,
    feedback?: boolean,
    showIcon?: boolean
}

/**
 * Defines a message object on our web app.
 * @param props defines the characteristics expected on the message.
 * @returns a message <br-message>.
 */
function Message(props: MessageProps) {
    if (props.feedback) {
        return (
            <br-message
                state={props.state}
                feedback="true"
                showIcon={props.showIcon && true}
            >
                {props.text}
            </br-message>
        )
    }
    return (
        <br-message
            state={props.state}
            showIcon={props.showIcon && true}
        >
            {props.text}
        </br-message>
    )
}

export default Message