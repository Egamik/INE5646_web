import { ChangeEvent, FormEvent, useState } from "react"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"

// Inherit setState
type Props = {
    setToken: React.Dispatch<React.SetStateAction<Object>>
}

// Axios call
async function sendLogIn(username: string, email: string, password: string) {
    return axios.post(
        'http://progweb.isac.campos.vms.ufsc.br:8080', 
        {
            username: username,
            email: email,
            password: password
        }
    )
}

async function sendSignIn(username: string, email: string, password: string) {
    try {
        const response = await axios.post("http://progweb.isac.campos.vms.ufsc.br:8080/user", {
            name: username,
            email: email,
            password: password
        })
        if (response.status == 200) {
            return true
        } else if (response.status === 400) {
            return true
        }
        return false
    } catch(err) {
        console.log(err)
        return false
    }
}

// Login page component
export default function Login(props: Props) {
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>("")

    const handleSubmit = async (e: FormEvent) => {
        console.log('alo')
        e.preventDefault()
        const token = await sendLogIn(username, email, password)
        console.log('Recebeu token: ', token)
        props.setToken(token)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <br-input
                    label="Username"
                    placeholder="Enter username"
                    id="user"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                ></br-input>
                <br-input 
                    label="Email"
                    placeholder="Enter your email"
                    id="email"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
                <br-input
                    label="Password"
                    placeholder="Enter password"
                    id="password"
                    ispassword="true"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                ></br-input>
            </div>
            {/* Link mainpage */}
            <br-button
                type="submit"
                icon="user"
            >
                Log In
            </br-button>
            <br-button
                label="Sign In"
                
            />
        </form>
    )
}