import { ChangeEvent, useState } from "react"
import axios from "axios"
import Message from "../components/Message/Message"
import "../App.css"

// Inherit setState
type Props = {
    setToken: React.Dispatch<React.SetStateAction<string>>
    setUID: React.Dispatch<React.SetStateAction<string>>
    setAuth: React.Dispatch<React.SetStateAction<boolean>>
}

// Axios call
async function sendLogIn(email: string, password: string) {
    try {
        console.log('email: ',email)
        const response = await axios.post<any, APIResponseLogIn>(
            'http://progweb.isac.campos.vms.ufsc.br:8080/', 
            {
                email: email,
                password: password
            }
        )
        if (response.accessToken) {
            return response.accessToken
        }
        return ''
    } catch(err) {
        console.log(err)
        return ''
    }
}

async function sendSignIn(username: string, email: string, password: string) {
    try {
        const response = await axios.post<APIRequest, any>(
            "http://progweb.isac.campos.vms.ufsc.br:8080/user",
            {
            name: username,
            email: email,
            password: password
            }
        )
        
        if (response.status === 200) {
            return response.data.id
        }
        return ''
    } catch(err) {
        console.log(err)
        return ''
    }
}

// Login page component
export default function Login(props: Props) {
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>("")
    const [showMessage, setShowMessage] = useState<boolean>(false)
    const [messageStr, setMsgStr] = useState<string>('')
    const [messageState, setMsgState] = useState<string>('')

    const handleSubmit = () => {
        sendLogIn(email, password).then(token => {
            if (token === '') {
                setShowMessage(true)
                setMsgState('danger')
                setMsgStr('Error on Login')
                return
            }
            setShowMessage(true)
            setMsgState('success')
            setMsgStr('Log In successful')
            console.log('Recebeu token: ', token)
            props.setToken(token)
            props.setAuth(true)
        }).catch(error => {
            setShowMessage(true)
            setMsgState('danger')
            setMsgStr('Error on request. Server may be offline')
            console.log(error)
        })
    }

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
            console.log('Recebeu token: ', id)
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