import React from 'react'
import {useUser} from "../../store/User.js"
import {useNavigate} from "react-router-dom"
import {
    ADMIN_PATH,
    footer,
    MAIN_PATH,
    TRAINER_PERSONAL_PATH
} from "../../utils/utils.jsx"

import {InputText} from "primereact/inputtext"
import {FloatLabel} from "primereact/floatlabel"
import {Dialog} from "primereact/dialog"
import {Password} from "primereact/password"
import {
    changePassword,
    getVerifyCode
} from "../../http/auth.js"
import Swal from "sweetalert2"

const Login = () => {
    const {loginUser} = useUser()
    const navigate = useNavigate()

    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    const [resetEmail, setResetEmail] = React.useState('')
    const [verificationCode, setVerificationCode] = React.useState('')
    const [checkCode, setCheckCode] = React.useState('')
    const [newPassword, setNewPassword] = React.useState('')

    const [step, setStep] = React.useState(1)
    const [visible, setVisible] = React.useState(false)

    const login = (e) => {
        e.preventDefault()

        if (!email || !password) {
            return Swal.fire({
                title: "Ошибка",
                text: "Пожалуйста, заполните необходимые поля",
            })
        } else {
            const user = new FormData()
            user.append('email', email)
            user.append('password', password)

            loginUser(user).then((data) => {
                Swal.fire({
                    title: "Дорогой пользователь",
                    text: "Поздравляем Вас с успешным входом в систему!",
                }).then(() => {
                    setTimeout(() => {
                        data.role === 'ADMIN' ? navigate(ADMIN_PATH) : (data.role === 'TRAINER' ? navigate(TRAINER_PERSONAL_PATH) : navigate(MAIN_PATH))
                    }, 2000)
                })
            }).catch((error) => {
                return Swal.fire({
                    title: 'Ошибка',
                    text: error.response.data.message
                })
            })
        }
    }

    const forgotPassword = (e) => {
        e.preventDefault()
        setStep(1)
        setVisible(true)
    }

    const clearData = () => {
        setVisible(false)
        setResetEmail('')
        setVerificationCode('')
        setCheckCode('')
        setNewPassword(newPassword)
    }

    const handleNext = () => {
        if (step === 1) {
            if (!resetEmail)
                return Swal.fire({
                    title: 'Ошибка',
                    text: 'Пожалуйста, введите почту!',
                    zIndex: 99999999
                })

            getVerifyCode(resetEmail).then(({verifyCode}) => {
                setVerificationCode(verifyCode)
                setStep(2)
            }).catch((error) => {
                return Swal.fire({
                    title: 'Ошибка получения кода',
                    text: error.response.data.message
                })
            })
        } else if (step === 2) {
            if (!checkCode)
                return Swal.fire({
                    title: 'Ошибка',
                    text: 'Пожалуйста, введите код с почты!'
                })

            if (+verificationCode !== +checkCode)
                return Swal.fire({
                    title: 'Ошибка',
                    text: 'Код, который был отправлен на почту не совпадает с введеным Вами кодом!'
                })

            setStep(3)
        } else if (step === 3) {
            if (!newPassword)
                return Swal.fire({
                    title: 'Ошибка',
                    text: 'Пожалуйста, введите новый пароль!'
                })
            changePassword(resetEmail, newPassword).then(({message}) => {
                Swal.fire({
                    title: 'Смена пароля',
                    text: message
                }).then(() => {
                    clearData()
                })
            }).catch((error) => {
                return Swal.fire({
                    title: 'Ошибка смены пароля',
                    text: error.response.data.message
                })
            })
        }
    }

    return (
        <>
            <form className="login">
                <FloatLabel className="login__input-group">
                    <InputText id="email"
                               className="login__input"
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}/>
                    <label htmlFor="email">Введите почту</label>
                </FloatLabel>
                <FloatLabel className="login__input-group">
                    <Password inputId="password"
                              className="p-password p-fluid"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              feedback={false}
                              toggleMask={true}/>
                    <label htmlFor="password">Введите пароль</label>
                </FloatLabel>
                <button className="login__forgot-password btn-reset"
                        onClick={forgotPassword}>
                    Забыли пароль?
                </button>
                <button type="submit"
                        className="login__btn"
                        onClick={login}>
                    Войти
                </button>
            </form>

            <Dialog header="BDDanceStudio"
                    visible={visible}
                    onHide={() => clearData()}
                    style={{width: '100%', maxWidth: '500px'}}>
                {
                    step === 1 && (
                        <>
                            <InputText value={resetEmail}
                                       style={{
                                           marginTop: '5px',
                                           marginBottom: '10px',
                                           width: '100%'
                                       }}
                                       className="login__input"
                                       placeholder="Пожалуйста, введите почту"
                                       onChange={(e) => setResetEmail(e.target.value)}
                            />
                            <button className="login__btn"
                                    style={{
                                        width: "100%"
                                    }}
                                    onClick={handleNext}>
                                Отправить код
                            </button>
                        </>
                    )
                }
                {
                    step === 2 && (
                        <>
                            <InputText value={checkCode}
                                       style={{
                                           marginTop: '5px',
                                           marginBottom: '10px',
                                           width: '100%'
                                       }}
                                       className="login__input"
                                       placeholder="Пожалуйста, введите код"
                                       onChange={(e) => setCheckCode(e.target.value)}
                            />
                            <button className="login__btn"
                                    style={{
                                        width: "100%"
                                    }}
                                    onClick={handleNext}>
                                Подтвердить код
                            </button>
                        </>
                    )
                }
                {
                    step === 3 && (
                        <>
                            <Password value={newPassword}
                                      style={{
                                          marginTop: '5px',
                                          marginBottom: '10px',
                                          width: '100%'
                                      }}
                                      className="p-password p-fluid"
                                      placeholder="Пожалуйста, введите пароль"
                                      onChange={(e) => setNewPassword(e.target.value)}
                                      toggleMask
                                      footer={footer}/>
                            <button className="login__btn"
                                    style={{
                                        width: "100%"
                                    }}
                                    onClick={handleNext}>
                                Сохранить
                            </button>
                        </>
                    )
                }
            </Dialog>
        </>
    );
};

export default Login;
