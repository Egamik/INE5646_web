import { ChangeEvent, useState } from "react";
import axios from "axios";
import Message from "../components/Message/Message";

interface UpdateUserProps {
    token: string,
    username: string,
    email: string,
    password: string
};

async function updateCredentials(token: string, username: string, email: string, password: string) {
    try {
        const response = await axios.put<APIUpdateUserRequest, any>(
            "http://progweb.isac.campos.vms.ufsc.br:8080/user",
            {
                token: token,
                username: username,
                email: email,
                password: password,
            }
        );
        if (response.status === 200) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const UpdateUser = (props: UpdateUserProps) => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [messageState, setMessageState] = useState<string>("");
    const [messageText, setMessageText] = useState<string>("");

    const handleUpdate = () => {
        updateCredentials(props.token, username, email, password)
            .then((success) => {
                if (success) {
                    setShowMessage(true);
                    setMessageState("success");
                    setMessageText("Credentials updated successfully.");
                } else {
                    setShowMessage(true);
                    setMessageState("danger");
                    setMessageText("Error updating credentials.");
                }
            })
            .catch((error) => {
                setShowMessage(true);
                setMessageState("danger");
                setMessageText("Error updating credentials. Server may be offline.");
                console.log(error);
            });
    };

    return (
        <div>
            <h1>Change Credentials</h1>
            <div>
                <label>Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                />

                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
            </div>
            <button onClick={handleUpdate}>Update</button>
            {showMessage && <Message state={messageState} text={messageText} />}
        </div>
    );
}

export default UpdateUser