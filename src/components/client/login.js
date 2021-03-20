import React from 'react';
import {Redirect} from 'react-router-dom';
import '../../css/login.css';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {currentUserAction} from "../../actions/currentUserAction";

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            errorMessage: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleConnectionProblem = this.handleConnectionProblem.bind(this);
    }

    handleLoginChange(event) {
        this.setState({
            login: event.target.value
        });
    }

    handlePasswordChange(event) {
        this.setState({
            password: event.target.value
        });
    }

    handleSubmit(event) {
        const authenticateUri = 'http://localhost:8080/esm/authenticate';

        fetch(authenticateUri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.login,
                password: this.state.password
            })
        }).then(response => {
            if (response.ok) {
                this.extractData(response.json());
            } else {
                this.extractError(response.json());
            }
        }, this.handleConnectionProblem);

        event.preventDefault();
    }

    extractData(result) {
        result.then(result => {
            console.log('Saving data into local storage');
            localStorage.setItem('login', this.state.login);
            localStorage.setItem('jwt', result.jwt);
            localStorage.setItem("user", JSON.stringify(result.user));
            localStorage.setItem("roles", result.roles);
            console.log(result.user);
            this.setState({errorMessage: ''});
/*            this.setState({redirectTo: '/certificates'});*/
            this.props.currentUserAction(this.state.login);
        });
    }

    extractError(result) {
        result.then(result => {
            this.setState({
                errorMessage: result.errorMessage
            });
/*            localStorage.removeItem('jwt');
            localStorage.removeItem('login');
            localStorage.removeItem('isLogged');*/
        });
    }

    handleConnectionProblem() {
        this.setState({errorMessage: "Database is not available"});
    }

    render() {
        let login = localStorage.getItem('login');
        let jwt = localStorage.getItem('jwt');

        if (login && jwt) {
            console.log("Redirecting");
            return <Redirect to={"/certificates"}/>;
        } else {
            return (
                <div className='login-form-container'>
                    <h1 className="logo-h1">Logo</h1>
                    <form className='login-form' onSubmit={this.handleSubmit}>
                        <div className='login-input'>
                            <input type='text'
                                   className='custom-input'
                                   value={this.state.login}
                                   required
                                   onChange={this.handleLoginChange}
                                   placeholder='Login'/>
                        </div>
                        <div className='password-input'>
                            <input type='password'
                                   className='custom-input'
                                   value={this.state.password}
                                   required
                                   onChange={this.handlePasswordChange}
                                   placeholder='Password'/>
                        </div>
                        <div className='error-container'>
                            {this.state.errorMessage}
                        </div>
                        <input type='submit' className='submit-button' value='Login'/>
                    </form>
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        loggedUser: state.loggedUser
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        currentUserAction: currentUserAction
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(LoginForm);