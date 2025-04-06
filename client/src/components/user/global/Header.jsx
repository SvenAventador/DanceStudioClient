import React from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import {useUser} from "../../../store/User.js"
import {
    CLASSES_PATH,
    LOGIN_PATH,
    MAIN_PATH,
    PERSONAL_PATH, showToast,
    SPECIALIZATION_PATH,
    SUBSCRIPTION_PATH,
    TRAINER_PATH
} from "../../../utils/utils.jsx"
import {Toast} from "primereact/toast"

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const history = useNavigate()
    const location = useLocation()
    const {user, logoutUser} = useUser()

    const toast = React.useRef(null)
    const isOnPersonalPage = user && location.pathname === `${PERSONAL_PATH}/${user.id}`

    const handleButtonClick = () => {
        if (!user) {
            history(LOGIN_PATH)
        } else if (isOnPersonalPage) {
            logoutUser().then(() => {
                showToast(toast, "success", "Дорогой друг", "До скорых встреч!", 3000)
            })
            history(MAIN_PATH)
        } else {
            history(`${PERSONAL_PATH}/${user.id}`)
        }
    }

    const getButtonText = () => {
        if (!user)
            return "Авторизоваться"
        if (isOnPersonalPage)
            return "Выход"
        return "Личный кабинет"
    }

    return (
        <header className="header">
            <Toast ref={toast}/>

            <div className="header-container">
                <Link to={MAIN_PATH}
                      className="logo">BD Dance</Link>

                <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
                    <Link to={SUBSCRIPTION_PATH} onClick={() => setIsMenuOpen(false)}>Абонементы</Link>
                    <Link to={TRAINER_PATH} onClick={() => setIsMenuOpen(false)}>Тренера</Link>
                    <Link to={SPECIALIZATION_PATH} onClick={() => setIsMenuOpen(false)}>Направления</Link>
                    <Link to={CLASSES_PATH} onClick={() => setIsMenuOpen(false)}>Занятия</Link>
                </nav>

                <button className="login-btn" onClick={handleButtonClick}>
                    {getButtonText()}
                </button>

                <div className={`burger-menu ${isMenuOpen ? 'open' : ''}`}
                     onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </header>
    )
}

export default Header