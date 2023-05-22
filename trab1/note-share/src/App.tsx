import "@govbr-ds/core/dist/core.min.css"
import "@govbr-ds/webcomponents/dist/webcomponents.common.js"
import "./App.css"
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
// Components
import Header from "./components/Header/Header.tsx"
import Menu from "./components/Menu/Menu.tsx"
// Pages
import Home from "./pages/Home.tsx"


export default function App() {

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
                                        element={<Home />}
                                        errorElement={<></>}
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

