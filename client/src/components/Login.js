import React, { Component } from 'react';
import '../CSS/login.css';
import notesCover from '../Images/bgimg.jpeg';
import { browserHistory } from 'react-router';

class Login extends Component {
    componentDidMount() {
        document.title = "Login";
    }

    state = {
        username: '',
        password: ''
    };
    validate = () => {
        const { username, password } = this.state;
        if (!username || !password) {
            alert("Username / Password Missing!!!");
        } else {
            if (username === "PO1234" && password === "1234") {
                browserHistory.push('/police');
            } else if (username === "FO1234" && password === "1234") {
                browserHistory.push('/forensichome');
            } else {
                alert("Wrong Username or Password");
                browserHistory.push('/');
            }
        }
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    render() {
        return (
            <div className="container signInCard center">
                <div className="card setCardWidth">
                    <div className="card-image">
                        <img src={notesCover} alt="Notes" className="cardImageHeight" />
                    </div>
                    <div className="signInContainer card-content">
                        <h4 className="grey-text card-title">Sign In</h4>
                        <form onSubmit={this.submitted} className="signInForm">
                            <div className="input-field">
                                <i className="material-icons prefix grey-text text-darken-3">fingerprint</i>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    onChange={this.handleInputChange}
                                />
                                <label htmlFor="username">Login ID</label>
                            </div>
                            <div className="input-field">
                                <i className="material-icons prefix grey-text text-darken-3">lock</i>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    onChange={this.handleInputChange}
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                            <div className="input-field row">
                                <p className="col s4">
                                    <label>
                                        <input name="dept" type="radio" value="police" />
                                        <span>Police</span>
                                    </label>
                                </p>
                                <p className="col s4">
                                    <label>
                                        <input name="dept" type="radio" value="forensics" />
                                        <span>Forensics</span>
                                    </label>
                                </p>
                                <p className="col s4">
                                    <label>
                                        <input name="dept" type="radio" value="hospital" />
                                        <span>Hospital</span>
                                    </label>
                                </p>
                            </div>
                            <div className="input-field center card-action">
                                <button className="btn grey darken-3" type="button" onClick={this.validate}>Sign In!</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
