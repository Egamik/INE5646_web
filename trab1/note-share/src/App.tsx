import "@govbr-ds/core/dist/core.min.css"
import "@govbr-ds/webcomponents/dist/webcomponents.common.js"
import "./App.css"
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import { useState } from "react"
// Components
import Header from "./components/Header/Header.tsx"
import Menu from "./components/Menu/Menu.tsx"
// Pages
import Login from "./pages/LogIn.tsx"
import MainPage from "./pages/MainPage.tsx"
import UpdateUser from "./pages/UpdateUser.tsx"


export default function App() {
    const [token, setToken] = useState<string>('')
    const [uID, setUID] = useState<string>('')
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
                                                uID={uID} 
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

