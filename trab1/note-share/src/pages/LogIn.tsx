import { ChangeEvent, useEffect, useState } from "react"
import Message from "../components/Message/Message"
import "../App.css"
import { sendLogIn, sendSignIn } from "../utils/requests";

interface AuthState {
    auth: boolean;
}

// Funcoes setState herdadas
// Usado para passar parametros para contexto do App
type Props = {
    setToken: React.Dispatch<React.SetStateAction<string>>,
    setUID: React.Dispatch<React.SetStateAction<string>>,
    setAuth: React.Dispatch<React.SetStateAction<AuthState>>
    setUserName: React.Dispatch<React.SetStateAction<string>>,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    setPassword: React.Dispatch<React.SetStateAction<string>>
}

// Login page component
export default function Login(props: Props) {
    // Estados internos do componente
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>("")
    const [showMessage, setShowMessage] = useState<boolean>(false)
    const [messageStr, setMsgStr] = useState<string>('')
    const [messageState, setMsgState] = useState<string>('')

    // Garante showMessage == false em todo render
    useEffect(() => {
        setShowMessage(false)
    }, [])

    // Hook para submissao de login
    const handleSubmit = () => {
        sendLogIn(email, password).then(response => {

            if (typeof(response) === "object") {
                if (Object.prototype.hasOwnProperty.call(response, 'token')
                && Object.prototype.hasOwnProperty.call(response, 'id')) {
                    setShowMessage(true)
                    setMsgState('success')
                    setMsgStr('Log In successful')
                    
                    props.setToken(response.token)
                    props.setUID(response.id)
                    props.setUserName(username)
                    props.setEmail(email)
                    props.setPassword(password)
                    props.setAuth({auth: true})
                }
            } else {
                setShowMessage(true)
                setMsgState('danger')
                setMsgStr('Error on Login')
                return
            }
        }).catch(error => {
            setShowMessage(true)
            setMsgState('danger')
            setMsgStr('Error on request. Server may be offline')
            console.log(error)
        })
    }

    // Hook para submissao de novo usuario
    const handleSignIn = () => {
        sendSignIn(username, email, password).then(id => {
            if (id === '') {
                setShowMessage(true)
                setMsgState('danger')
                setMsgStr('Error on Login')
                return
            }
            setShowMessage(true)
            setMsgState('success')
            setMsgStr('Sign In successful')

            props.setEmail(email)
            props.setUserName(username)
            props.setPassword(password)
            props.setUID(id)

        }).catch(error => {
            setShowMessage(true)
            setMsgState('danger')
            setMsgStr('Error on request. Server may be offline')
            console.log(error)
        })
    }

    return (
        <div className="container">
            <div>
                <label>Username</label>
                <input
                    className="input-field"
                    placeholder="Enter username"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                ></input>

                <label>Email</label>
                <input 
                    className="input-field"
                    placeholder="Enter your email"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>{
                        e.persist()
                        setEmail(e.target.value)
                    }}
                />

                <label>Password</label>
                <input
                    className="input-field"
                    placeholder="Enter password"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                ></input>
            </div>
            {/* Link mainpage */}
            <div className="button-container">
                <br-button
                    label="Log In"
                    icon="user"
                    onClick={handleSubmit}
                >
                    Log In
                </br-button>
                <br-button
                    label="Sign In"
                    onClick={handleSignIn}
                />
            </div>
            {showMessage && <Message state={messageState} text={messageStr} />}
        </div>
    )
}