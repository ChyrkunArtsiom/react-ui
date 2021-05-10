import React, {Component} from "react";
import "../../css/register.css";
import check from "../../images/success-green-check-mark.svg";
import {Link} from "react-router-dom";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: '',
            repeatedPassword: '',
            firstName: '',
            secondName: '',
            birthday: '',
            error: '',
            showInfo: false
        }
        this.registerUser = this.registerUser.bind(this);
    }


    render() {
        let registerForm = null;
        let infoForm = null;
        let message = `You are successfully registered. You can now`;
        let link = <Link key='log_status' to='/' className="register-info-link">login</Link>;
        let point = ".";

        if(this.state.showInfo) {
            infoForm = (
                <div className="info-register-container" key="info-register-container">
                    <div className="circle-cross">
                        <img src={check} alt="circle-cross" />
                    </div>
                    {message}&nbsp;{link}{point}
                </div>
            );
        } else {
            registerForm = (
                <div className="register-form-container" key="register-form-container">
                    <div className="register-form-header">
                        <p className="register-header-text">Register</p>
                    </div>
                    <form className="register-form" onSubmit={this.registerUser}>
                        <div className='register-row-form'>
                            <label htmlFor='login-name'>Name</label>
                            <input id='login-name'
                                   type='text'
                                   value={this.state.name}
                                   required
                                   maxLength="45"
                                   onChange={event => this.setState({name: event.target.value})}
                            />
                        </div>
                        <div className='register-row-form'>
                            <label htmlFor='first-name'>First Name</label>
                            <input id='first-name'
                                   type='text'
                                   value={this.state.firstName}
                                   required
                                   maxLength="45"
                                   onChange={event => this.setState({firstName: event.target.value})}
                            />
                        </div>
                        <div className='register-row-form'>
                            <label htmlFor='second-name'>Second Name</label>
                            <input id='second-name'
                                   type='text'
                                   value={this.state.secondName}
                                   required
                                   maxLength="45"
                                   onChange={event => this.setState({secondName: event.target.value})}
                            />
                        </div>
                        <div className='register-row-form'>
                            <label htmlFor='address'>Birthday</label>
                            <input id='address'
                                   type='date'
                                   min="1900-01-01"
                                   max={`${new Date().toISOString().slice(0,10)}`}
                                   required
                                   value={this.state.birthday}
                                   onChange={event => this.setState({birthday: event.target.value})}
                            />
                        </div>
                        <div className='register-row-form'>
                            <label htmlFor='password'>Password</label>
                            <input id='password'
                                   type='password'
                                   min="3"
                                   max="45"
                                   required
                                   value={this.state.password}
                                   onChange={event => this.setState({password: event.target.value})}
                            />
                        </div>
                        <div className='register-row-form'>
                            <label htmlFor='repeat-password'>Repeat Password</label>
                            <input id='repeat-password'
                                   type='password'
                                   min="3"
                                   max="45"
                                   required
                                   value={this.state.repeatedPassword}
                                   onChange={event => this.setState({repeatedPassword: event.target.value})}
                            />
                        </div>
                        <div className="register-error-text">
                            {this.state.error.errorMessage}
                        </div>
                        <div className="register-buttons">
                            <button className="signup-button">Sign Up</button>
                        </div>
                    </form>
                </div>
            );
        }

        return (
            [
                infoForm,
                registerForm
            ]
        );
    }

    componentDidMount() {
        document.title = "Register";
    }

    registerUser(event) {
        event.preventDefault();
        console.log("Register");
        if (this.state.password !== this.state.repeatedPassword) {
            this.setState({error: {errorMessage: "Passwords should match."}});
        } else {
            let signupURI = `http://localhost:8080/esm/signup`;
            console.log(signupURI);

            let data = {
                name: this.state.name,
                password: this.state.password,
                firstName: this.state.firstName,
                secondName: this.state.secondName,
                birthday: this.state.birthday
            }

            fetch(signupURI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': 'en_US',
                },
                body: JSON.stringify(data)
            }).then(response => {
                if (response.ok) {
                    console.log("success");
                    response.json().then(result => {
                        this.setState({showInfo: true})
                    });
                } else {
                    response.json().then((result) => this.setState({error: result}));
                }
            });
        }
    }
}

export default Register;