import React from 'react'
import {useUser} from "../../store/User.js"
import {useNavigate} from "react-router-dom"
import {
    ADMIN_PATH,
    footer,
    MAIN_PATH,
    showToast
} from "../../utils/utils.jsx"

import {Toast} from "primereact/toast"
import {InputText} from "primereact/inputtext"
import {FloatLabel} from "primereact/floatlabel"
import {Dialog} from "primereact/dialog"
import {Password} from "primereact/password"
import {changePassword, getVerifyCode} from "../../http/auth.js"

const Login = () => {
    const {loginUser} = useUser()
    const navigate = useNavigate()

    const toast = React.useRef(null)

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
            return showToast(toast, 'error', 'Ошибка', 'Пожалуйста, заполните необходимые поля', 3000)
        } else {
            const user = new FormData()
            user.append('email', email)
            user.append('password', password)

            loginUser(user).then((data) => {
                showToast(toast, 'success', 'Приветствуем', 'С возвращением', 3000)

                setTimeout(() => {
                    data.role === 'ADMIN' ? navigate(ADMIN_PATH) : navigate(MAIN_PATH)
                }, 3000)
            }).catch((error) => {
                return showToast(toast, 'error', 'Ошибка авторизации', `${error.response.data.message}`, 3000)
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
                return showToast(toast, 'error', 'Ошибка', `Пожалуйста, введите почту!`, 3000);

            getVerifyCode(resetEmail).then(({verifyCode}) => {
                setVerificationCode(verifyCode)
                setStep(2)
            }).catch((error) => {
                return showToast(toast, 'error', 'Ошибка авторизации', `${error.response.data.message}`, 3000)
            })
        } else if (step === 2) {
            if (!checkCode)
                return showToast(toast, 'error', 'Ошибка', `Пожалуйста, введите код с почты!`, 3000);

            if (+verificationCode !== +checkCode)
                return showToast(toast, 'error', 'Ошибка', 'Код, который был отправлен на почту не совпадает с введеным Вами кодом', 3000)

            setStep(3)
        } else if (step === 3) {
            if (!newPassword)
                return showToast(toast, 'error', 'Ошибка', `Пожалуйста, введите новый пароль!`, 3000);
            changePassword(resetEmail, newPassword).then(({message}) => {
                showToast(toast, 'success', 'Пароль изменен', message, 3000)
                clearData()
            }).catch((error) => {
                return showToast(toast, 'error', 'Ошибка авторизации', `${error.response.data.message}`, 5000)
            })
        }
    }

    return (
        <>
            <form className="login">
                <Toast ref={toast}/>
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
                                           marginBottom: '10px'
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
                                           marginBottom: '10px'
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
                                          marginBottom: '10px'
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
