import "@govbr-ds/core/dist/core.min.css"
import "@govbr-ds/webcomponents/dist/webcomponents.common.js"
import "./App.css"
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import { useState, useEffect } from "react"
import axios from 'axios'
// Components
import Header from "./components/Header/Header.tsx"
import Menu from "./components/Menu/Menu.tsx"
// Pages
import Login from "./pages/LogIn.tsx"
import MainPage from "./pages/MainPage.tsx"
import UpdateUser from "./pages/UpdateUser.tsx"


async function getUserGroups(token: string, uid: string) {
    // user-groups GET
    const body: APIGetUserGroupsRequest = {
        accessToken: token,
        user_id: uid
    }
    try {
        const response = await axios.get<APIGetUserGroupsResponse>(
            'http://progweb.isac.campos.vms.ufsc.br:8080/user-groups'
        )
        if (response.data.groups_ids) {
            return response.data.groups_ids
        }
        return true
    } catch(error) {
        console.log(error)
        return false
    }
}

export default function App() {
    const [token, setToken] = useState<string>('')
    const [uID, setUID] = useState<string>('')
    const [groups, setGroups] = useState<string[]>([])
    const [userName, setUserName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [auth, setAuth] = useState<boolean>(false)
    
    if (!auth) {
        return (
            <Login 
                setToken={setToken}
                setUID={setUID} 
                setAuth={setAuth}
                setUserName={setUserName}
                setEmail={setEmail}
                setPassword={setPassword}
            />
        )
    }
    
    // Pega id dos grupos de notas do usuario
    useEffect(() => {
        getUserGroups(token, uID).then(result => {
            if (typeof(result) === 'boolean') {
                if (result) {
                    // Vazio
                }
                // Erro
            } else if (Array.isArray(result)) {
                // Ids dos grupos
                setGroups((prev) => ({...prev, result}))
            }
        })
    }, [token])
    
    return (
        <Router>
            <header>
                <Header />
            </header>
            <main className="mb-5" id="main">
                <div className="container-lg">
                    <div className="row">
                        <div className="col-sm-4 col-lg-3">
                            <Menu />
                        </div>
                        <div className="col mb-5">
                            <div className="main-content pl-sm-3 mt-4" id="main-content">
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <MainPage 
                                                token={token} 
                                                userID={uID}
                                            />
                                        }
                                        errorElement={<></>}
                                    />
                                    <Route 
                                        path="/edit-user"
                                        element={
                                            <UpdateUser 
                                                token={token} 
                                                username={userName} 
                                                email={email} 
                                                password={password}    
                                            />
                                        }
                                    />
                                </Routes>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Router>
  )
}

