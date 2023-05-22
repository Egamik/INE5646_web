import { FormEvent, useState } from "react"
import axios from "axios"

type Props = {
    setToken: React.Dispatch<React.SetStateAction<any>>
}
async function sendLogIn(creds: object) {
    return axios.post(
        'http://localhost:8080/login',
        creds
    )
}
export default function Login(setToken: Props) {
    const [username, setUsername] = useState<string>()
    const [password, setPassword] = useState<string>()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const token = await sendLogIn({
            usr: username,
            pw: password
        }).then(() => {
            setToken(token)
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                <p>Usuário</p>
                <input 
                    type="text"
                    onChange={e => setUsername(e.target.value)}
                />
            </label>
            <label>
                <p>Senha</p>
                <input 
                    type="password"
                    onChange={e => setPassword(e.target.value)}    
                />
            </label>
            <div>
                <br-sign-in 
                    type="primary"
                    density="middle"
                    icon="fa-user"
                    label="Entrar"
                />
            </div>
        </form>
    )
}