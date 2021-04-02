import React from "react";
import "./login.css"

export default class Login extends React.Component{
    render() {
        return(
            <div className="Login">

                <form onSubmit={this.props.login}>
                    <p>Вход в систему:</p>
                    <p id="warning">{this.props.message}</p>
                    <input size = "24" name="name" id="password" type="text" placeholder="Ваш ник" title="type &quot;a&quot;"></input>
                    <p><button id="a">Войти</button> </p>
                </form>
            </div>
        );
    }
}
