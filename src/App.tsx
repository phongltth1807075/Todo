import './App.css';
import React, { } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Login from "./component/Login";
import Todo from "./component/Todo";

function App() {
    // let isAuthentication = false;
    // useEffect(() => {
    //     let a = localStorage.getItem('token')
    //     if (a !== null) {
    //         isAuthentication = true
    //     }
    // })
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/">
                        <Login />
                    </Route>
                    <Route path="/todo">
                        <Todo />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
