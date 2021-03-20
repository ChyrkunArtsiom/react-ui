import React from "react";
import Header from "./client/header";
import Footer from "./client/footer";
import Content from "./content";
import {BrowserRouter, Route} from "react-router-dom";

class ClientContainer extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <div className='container'>
                    <Route component={Header} />
                    <Content/>
                    <Footer/>
                </div>
            </BrowserRouter>
        )
    }
}

export default ClientContainer;