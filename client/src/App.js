import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import About from './About.js';
import Home from './Home.js'

const App = () => {
    return (
        <Router>
            <div style={{ textAlign: "center" }}>
                <div className="ui three item menu">
                    <Link className="item" to="/">Home</Link>
                    <Link className="item" to="/about">About</Link>
                </div>
                <Switch>
                    <Route path="/about">
                        <About />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
