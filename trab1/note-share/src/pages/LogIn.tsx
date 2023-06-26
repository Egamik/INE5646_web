import { ChangeEvent, FormEvent, useState } from "react"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"

// Inherit setState
type Props = {
    setToken: React.Dispatch<React.SetStateAction<Object>>
}

// Axios call
async function sendLogIn(creds: object) {
    return axios.post(
        'http://localhost:8080/login',
        creds
    )
}

// Login page component
export default function Login(props: Props) {
    const [username, setUsername] = useState<string>()
    const [password, setPassword] = useState<string>()

    const handleSubmit = async (e: FormEvent) => {
        console.log('alo')
        e.preventDefault()
        const token = await sendLogIn({
            usr: username,
            pw: password
        })
        console.log('Enviou token: ', token)
        props.setToken(token)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <br-input
                    label="Usuário"
                    placeholder="Digite seu usuário"
                    id="user"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                ></br-input>
                <br-input
                    label="Senha"
                    placeholder="Digite sua senha"
                    id="password"
                    ispassword="true"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                ></br-input>
            </div>
            <button
                type="submit"
            >
                <FontAwesomeIcon icon={faUser} />
                Entrar
            </button>
        </form>
    )
}