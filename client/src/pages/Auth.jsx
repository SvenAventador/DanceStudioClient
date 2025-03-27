import React, {useState} from 'react'
import Login from "../components/auth/Login.jsx"
import Registration from "../components/auth/Registration.jsx"
import {NavLink} from "react-router-dom"
import {
    LOGIN_PATH,
    REGISTRATION_PATH
} from "../utils/utils.jsx"

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true)

    return (
        <div className="auth">
            <div className="auth__form-container">
                <div className="auth__header">
                    <h2 className="auth__title">
                        BDDance Studio
                    </h2>
                </div>
                <p className="auth__welcome">
                    {
                        isLogin ? "С возвращением 👋"
                                : "Дорбро пожаловать 👋"
                    }
                </p>
                <p className="auth__sub-title">
                    {
                        isLogin ? "Пожалуйста, войдите в аккаунт, чтобы пользоваться всем нашим функционалом"
                                : "Пожалуйста, зарегистрируйтесь, чтобы начать пользоваться всем нашим функционалом"
                    }
                </p>
                {isLogin ? <Login/> : <Registration/>}
                <NavLink to={isLogin ? REGISTRATION_PATH : LOGIN_PATH}
                         onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? (
                        <>
                            <span style={{cursor: "default", color: '#000'}}>Впервые на платформе?</span>
                            <span style={{cursor: "pointer", color: "#666cff"}}> Зарегистрируйтесь!</span>
                        </>
                    ) : (
                        <>
                            <span style={{cursor: "default", color: '#000'}}>Уже есть аккаунт?</span>
                            <span style={{cursor: "pointer", color: "#666cff"}}> Войдите!</span>
                        </>
                    )}
                </NavLink>
            </div>
        </div>
    );
};

export default Auth;