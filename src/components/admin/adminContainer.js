import React, {Component} from "react";
import {BrowserRouter, Redirect, Route} from "react-router-dom";
import AdminHeader from "./adminHeader";
import AdminFooter from "./adminFooter";
import AdminContent from "./adminContent";

class AdminContainer extends Component {
    render() {
        if (!localStorage.getItem("jwt") || !localStorage.getItem("login") || !checkIfAdmin()) {
            return (
                <Redirect to='/error' />
            );
        }

        return (
            <BrowserRouter>
                <div className='container'>
                    <Route component={AdminHeader} />
                    <AdminContent />
                    <AdminFooter />
                </div>
            </BrowserRouter>
        );
    }
}

function checkIfAdmin() {
    let roles = localStorage.getItem("roles");
    if (roles) {
        roles = roles.split(',');
        console.log("ROLES: ", roles);
        if (roles.indexOf("ROLE_ADMIN") > -1) {
            return true;
        }
    }
    return false;
}

export default AdminContainer;