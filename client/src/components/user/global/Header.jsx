import React from 'react'
import {
    Link,
    useNavigate
} from 'react-router-dom';
import {useUser} from "../../../store/User.js"
import {
    CLASSES_PATH,
    LOGIN_PATH,
    MAIN_PATH,
    PERSONAL_PATH,
    SUBSCRIPTION_PATH,
    TRAINER_PATH
} from "../../../utils/utils.jsx"

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const history = useNavigate()
    const {user} = useUser()

    return (
        <header className="header">
            <div className="header-container">
                <Link to={MAIN_PATH}
                      className="logo">
                    BD Dance
                </Link>

                <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
                    <Link to={SUBSCRIPTION_PATH} onClick={() => setIsMenuOpen(false)}>Наши абонементы</Link>
                    <Link to={TRAINER_PATH} onClick={() => setIsMenuOpen(false)}>Наши тренера</Link>
                    <Link to={SUBSCRIPTION_PATH} onClick={() => setIsMenuOpen(false)}>Наши направления</Link>
                    <Link to={CLASSES_PATH} onClick={() => setIsMenuOpen(false)}>Доступные занятия</Link>
                </nav>

                <button className="login-btn"
                        onClick={() => user ? history(PERSONAL_PATH + user.id) : history(LOGIN_PATH)}>
                    {user ? "Личный кабинет" : "Войти"}
                </button>

                <div className={`burger-menu ${isMenuOpen ? 'open' : ''}`}
                     onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </header>
    );
};

export default Header;