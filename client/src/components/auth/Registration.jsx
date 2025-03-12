import React from 'react'
import {useUser} from "../../store/User.js"
import {useNavigate} from "react-router-dom"
import {
    footer,
    MAIN_PATH,
    showToast} from "../../utils/utils.jsx"

import {Toast} from 'primereact/toast'
import {InputText} from "primereact/inputtext"
import {FloatLabel} from "primereact/floatlabel"
import {Password} from "primereact/password"

const Registration = () => {
    const {registrationUser} = useUser()
    const navigate = useNavigate()

    const toast = React.useRef(null)

    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [repeatPassword, setRepeatPassword] = React.useState('')

    const registration = (e) => {
        e.preventDefault();

        if (!email || !password || !repeatPassword) {
            return showToast(toast, 'error', 'Ошибка', 'Пожалуйста, заполните необходимые поля', 3000)
        } else if (password !== repeatPassword) {
            return showToast(toast, 'error', 'Ошибка', 'Пароли не совпадают', 3000)
        } else {
            const user = new FormData()
            user.append('email', email)
            user.append('password', password)

            registrationUser(user).then(() => {
                showToast(toast, 'success', 'Добро пожаловать', 'Вы успешно зарегистрировались', 3000)

                setTimeout(() => {
                    navigate(MAIN_PATH)
                }, 3000)
            }).catch((error) => {
                return showToast(toast, 'error', 'Ошибка регистрации', `${error.response.data.message}`, 3000)
            })
        }
    }

    return (
        <form className="registration">
            <Toast ref={toast}/>
            <FloatLabel className="registration__input-group">
                <InputText id="email"
                           className="registration__input"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}/>
                <label htmlFor="email">Введите почту</label>
            </FloatLabel>
            <FloatLabel className="registration__input-group">
                <Password inputId="password"
                          type="password"
                          value={password}
                          className="p-password p-fluid"
                          onChange={(e) => setPassword(e.target.value)}
                          feedback={true}
                          toggleMask={true}
                          footer={footer}/>
                <label htmlFor="password">Введите пароль</label>
            </FloatLabel>
            <FloatLabel className="registration__input-group">
                <Password inputId="password"
                          type="password"
                          value={repeatPassword}
                          className="p-password p-fluid"
                          onChange={(e) => setRepeatPassword(e.target.value)}
                          feedback={false}
                          toggleMask={true}/>
                <label htmlFor="repeatPassword">Повторите пароль</label>
            </FloatLabel>
            <button type="submit"
                    className="registration__btn"
                    onClick={registration}>
                Зарегистрироваться
            </button>
        </form>
    );
};

export default Registration;
