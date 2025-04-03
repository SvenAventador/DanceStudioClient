import React from 'react'
import {useUser} from "../../store/User.js"
import {useNavigate} from "react-router-dom"
import {
    footer,
    MAIN_PATH
} from "../../utils/utils.jsx"

import {InputText} from "primereact/inputtext"
import {FloatLabel} from "primereact/floatlabel"
import {Password} from "primereact/password"
import Swal from "sweetalert2";
import {InputMask} from "primereact/inputmask";

const Registration = () => {
    const {registrationUser} = useUser()
    const navigate = useNavigate()

    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [fio, setFio] = React.useState('')
    const [phone, setPhone] = React.useState('')
    const [repeatPassword, setRepeatPassword] = React.useState('')

    const registration = (e) => {
        e.preventDefault();
        if (!email || !password || !repeatPassword || !fio || !phone) {
            return Swal.fire({
                title: 'Ошибка',
                text: 'Пожалуйста, заполните необходимые поля'
            })
        } else if (password !== repeatPassword) {
            return Swal.fire({
                title: 'Ошибка',
                text: 'Пароли не совпадают'
            })
        } else {
            const user = new FormData()
            user.append('email', email)
            user.append('password', password)
            user.append('fullName', fio)
            user.append('phone', phone)

            registrationUser(user).then(() => {
                Swal.fire({
                    title: 'Дорогой пользователь',
                    text: 'Поздравляем Вас с успешной регистрацией на нашей платформе'
                }).then(() => {
                    setTimeout(() => {
                        navigate(MAIN_PATH)
                    }, 2000)
                })
            }).catch((error) => {
                return Swal.fire({
                    title: 'Ошибка регистрации',
                    text: error.response.data.message
                })
            })
        }
    }

    return (
        <form className="registration">
            <FloatLabel className="registration__input-group">
                <InputText id="email"
                           className="registration__input"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}/>
                <label htmlFor="email">Введите почту</label>
            </FloatLabel>
            <FloatLabel className="registration__input-group">
                <InputText inputId="fio"
                           type="text"
                           value={fio}
                           className="p-password p-fluid"
                           onChange={(e) => setFio(e.target.value)}/>
                <label htmlFor="fio">Введите ФИО</label>
            </FloatLabel>
            <FloatLabel className="registration__input-group">
                <InputMask value={phone}
                           onChange={(e) => setPhone(e.target.value)}
                           mask="+7 (999) 999-99-99"
                           placeholder="+7 (999) 999-99-99"/>
                <label htmlFor="fio">Введите телефон</label>
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
