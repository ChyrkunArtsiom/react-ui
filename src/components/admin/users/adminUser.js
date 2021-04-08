import React, {Component} from "react";
import ErrorForm from "../errorForm";
import {getTokenFromLocalStorage} from "../../localStorageMethods";
import "../../../css/admin/admin-user.css";

class AdminUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            error: null,
            showError: false
        }
        this.closeErrorForm = this.closeErrorForm.bind(this);
    }

    render() {
        let user = this.state.user;
        let errorForm = null;
        let userForm = null;

        if (this.state.showError) {
            errorForm = <ErrorForm key="error" error={this.state.error} onClick={() => this.closeErrorForm}/>
        }

        if (user) {
            userForm = (
                <div key="admin-user-container" className="admin-user-container">
                    <div className="admin-user-header">
                        <h1>User №{this.state.user.id}</h1>
                    </div>
                    <div className="admin-user-data">
                        <p>Name: {this.state.user.name}</p>
                        <p>First name: {this.state.user.firstName}</p>
                        <p>Second name: {this.state.user.secondName}</p>
                        <p>Birthday: {new Date(this.state.user.birthday).toLocaleDateString()}</p>
                    </div>
                </div>
            )
        }

        return (
            [
                errorForm,
                userForm
            ]
        );
    }

    componentDidMount() {
        document.title = `User №${this.props.match.params.id}`;
        let tagsUri = `http://localhost:8080/esm/users/${this.props.match.params.id}`;
        console.log(tagsUri);

        let authorization_header;
        let token = getTokenFromLocalStorage();
        if (token !== null) {
            authorization_header = "Bearer ".concat(token);
        }

        fetch(tagsUri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': authorization_header
            }
        }).then(response => {
            if (response.ok) {
                response.json().then((result) => this.setState({user: result}));
            } else {
                response.json().then((result) => this.setState({error: result, showError: true}));
            }
        });
    }

    closeErrorForm() {
        this.setState({showError: false});
    }

}

export default AdminUser;