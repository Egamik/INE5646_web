import { ChangeEvent, useEffect, useState } from "react"
import axios, { AxiosResponse } from "axios"
import "../App.css"

// Axios call
async function sendLogOut(userID: string, token: string) {
    try {
        const options = {
            data: {
                user_id: userID,
                accessToken: token
            }
        }
        const response = await axios.post<any, AxiosResponse<APIDefaultResponse>>(
            'http://progweb.isac.campos.vms.ufsc.br:8080/logout',
            options
        )

        if (response.data.msg) {
            return true
        }
        return false
    } catch (err) {
        console.log(err)
        return false
    }
}

interface AuthState {
    auth: boolean;
}

// Funcoes setState herdadas
// Usado para passar parametros para contexto do App
type Props = {
    token: string
    uID: string
    setAuth: React.Dispatch<React.SetStateAction<AuthState>>
}

// Logout page component
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

    return (
        <br-button 
            circle=""
            primary=""
        >
            
        </br-button>
    )
}