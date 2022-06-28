import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function LoginPage({ setIsLogged, setUserData }) {
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [requestError, setRequestError] = useState("");

    const handleForm = (event) => {
        event.preventDefault();

        setUsernameError(false);
        setPasswordError(false);
        setRequestError(false);

        if (!username) {
            setUsernameError(true);
        }
        if (!password) {
            setPasswordError(true);
        }


        if (username && password) {
            axios('http://localhost:3030/users/login', {
                method: 'GET',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                params: {
                    username: username,
                    password: password
                }
            }).then((res) => {
                const data = res.data;
                const userData = {
                    accessToken: data.accessToken,
                    accessTokenExpires: data.expiration,
                    username: username
                }

                localStorage.setItem("userData", JSON.stringify(userData));

                setUserData(userData);
                setIsLogged(true);
            }).catch((err) => {
                if (err.response && err.response.data) {
                    const errorMessage = err.response.data.message;
                    setRequestError(errorMessage);
                }
            });
        }
    }

    return (
        <div className="grid h-screen place-items-center ">
            <form onSubmit={(event) => handleForm(event)} style={{width: '392px'}} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input onChange={(event) => setUsername(event.target.value)} className={`${usernameError ? "border-red-500" : null} shadow appearance-none border rounded w-full mb-3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`} id="username" type="text" placeholder="Username" />
                    {usernameError ?
                        <p className="text-red-500 text-xs italic">Entrez votre nom d'utilisateur.</p>
                        :
                        <></>
                    }
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input onChange={(event) => setPassword(event.target.value)} className={`${passwordError ? "border-red-500" : null} shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`} id="password" type="password" placeholder="******************" />
                    {passwordError ?
                        <p className="text-red-500 text-xs italic">Entrez votre mot de passe.</p>
                        :
                        <></>
                    }
                </div>
                <div className="mb-1">
                    <button className="mt-6 w-full block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Se connecter
                    </button>
                    {requestError || requestError.length > 0 ?
                        <p className="mt-3 text-red-500 text-xs italic">{requestError}</p>
                        :
                        <></>
                    }
                </div>
            </form>
            <p className="text-center text-gray-500 text-xs">
                &copy;2022 Hyzen. Tous droits réservés.
            </p>
        </div>
    )
}
