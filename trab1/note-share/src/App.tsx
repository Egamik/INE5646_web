import "@govbr-ds/core/dist/core.min.css"
import "@govbr-ds/webcomponents/dist/webcomponents.common.js"
import "./App.css"
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import { useEffect, useState } from "react"
// Components
import Header from "./components/Header/Header.tsx"
import Menu from "./components/Menu/Menu.tsx"
// Pages
import Login from "./pages/LogIn.tsx"
import MainPage from "./pages/MainPage.tsx"
import UpdateUser from "./pages/UpdateUser.tsx"

export default function App() {
    // Salva token em cache do navegador
    const [token, setToken] = useState<TokenState>(()=> {
        const storedToken = localStorage.getItem('token')
        return storedToken ? JSON.parse(storedToken): ''

    })
    const [uID, setUID] = useState<UIDState>(() => {
        const storedUID = localStorage.getItem('user_id')
        return storedUID ? JSON.parse(storedUID) : ''
    })
    const [auth, setAuth] = useState<AuthState>(() => {
        // Retrieve authentication state from localStorage
        const storedAuth = localStorage.getItem("auth");
        return storedAuth ? JSON.parse(storedAuth) : { auth: false };
    });
    const [userName, setUserName] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [email, setEmail] = useState<string>()

    useEffect(() => {
        // Update localStorage quando ha mudanca em auth
        localStorage.setItem("auth", JSON.stringify(auth));
    }, [auth]);

    useEffect(()=> {
        // Update localStorage quando ha mudanca em auth
        localStorage.setItem('token', JSON.stringify(token))
    }, [token])

    useEffect(() => {
        // Update localStorage quando ha mudanca em auth
        localStorage.setItem("user_id", JSON.stringify(uID));
    }, [uID]);
    
    if (!auth.auth) {
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
    console.log('App token', token)
    
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
                                                token={token.token} 
                                                userID={uID.user_id}
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

