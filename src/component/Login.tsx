import { useEffect, useState } from "react";
import { Account } from "../service/model/account";
import axios from "axios";
import * as React from "react";
import { useHistory } from "react-router-dom";
import './Login.css';

const accountDefaul = new Account('', '');

function Login() {

    const [accountLogin, setAccount] = useState(accountDefaul);
    const history = useHistory();
    useEffect(() => {
    }, []);

    const login = async () => {
        try {
            // @ts-ignore
            let result = await axios.post('http://localhost:8080/accounts/login?email=' + accountLogin._email + '&password=' + accountLogin._password);
            if (result.data.accountName !== undefined) {
                localStorage.setItem('token', result.data.token);
                alert('Success');
                history.push('/todo')
            }
        } catch {
            alert('Err')
        }
    };

    const handelOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // @ts-ignore
        setAccount({ ...accountLogin, [name]: value });
    };

    return (
        <div className="Login">
            <hgroup>
                <h1>Login Form {accountLogin.email}</h1>
            </hgroup>
            <form>
                <div className="group">
                    <input placeholder="Email" name={'_email'} onChange={handelOnchange} type="email" /><span/><span/>
                </div>
                <div className="group">
                    <input placeholder="Password" name={'_password'} onChange={handelOnchange} type="password" /><span
                        className="" /><span className="" />
                </div>
                <button type="button" onClick={login} className="button buttonBlue">Submit
                    <div className="ripples buttonRipples"><span className="ripplesCircle" /></div>
                </button>
            </form>
        </div>
    )
}

export default Login;
