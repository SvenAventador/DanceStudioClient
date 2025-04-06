import React from 'react'
import {useParams} from "react-router-dom"
import {getOne} from "../http/classes.js"
import {useUser} from "../store/User.js"
import {signUp} from "../http/schedule.js"
import {showToast} from "../utils/utils.jsx"
import {Toast} from "primereact/toast"

const CurrentClass = () => {
    const {id} = useParams()
    const {user} = useUser()

    const toast = React.useRef(null)

    const [currentClass, setCurrentClass] = React.useState(null)

    const levelTranslations = {
        'Elementary': 'Начальный',
        'Intermediate': 'Средний',
        'UpperIntermediate': 'Продвинутый'
    }

    React.useEffect(() => {
        getOne(id).then(({currentClass}) => {
            setCurrentClass(currentClass)
        })
    }, [id])

    const formatDate = (dateString) => {
        const options = {year: 'numeric', month: 'long', day: 'numeric'}
        return new Date(dateString).toLocaleDateString('ru-RU', options)
    }

    if (!currentClass)
        return (
            <div className="current-class-loading">
                <div className="loading-spinner"></div>
            </div>
        )

    const handleSignUpForClasses = (scheduleId) => {
        try {
            if (!user)
                return showToast(toast, 'error', 'Ошибка записи', 'Перед тем, как записаться на данное мероприятие, необходимо авторизоваться!', 5000)

            const signUpData = new FormData()
            signUpData.append('userId', user?.id)
            signUpData.append('scheduleId', parseInt(scheduleId))

            signUp(signUpData).then(() => {
                showToast(toast, 'success', 'Успешно', 'Поздравляем с успешной записью на данное занятие ', 5000)
                getOne(id).then(({currentClass}) => {
                    setCurrentClass(currentClass)
                })
            }).catch((error) => {
                return showToast(toast, 'error', 'Ошибка записи', `${error.response.data.message}`, 5000)
            })
        } catch (error) {
            return showToast(toast, 'error', 'Ошибка записи', `${error.message}`, 5000)
        }
    }

    return (
        <div className="current-class">
            <Toast ref={toast}/>
            <div className="current-class__hero">
                <div className="hero-image-container">
                    <img src={`${import.meta.env.VITE_API_IMAGE_URL}/${currentClass.image}`}
                         alt={currentClass.name}
                         className="hero-image"/>
                    <div className="hero-overlay"></div>
                </div>

                <div className="hero-content">
                    <h1 className="hero-title">
                        <span>{currentClass.name}</span>
                    </h1>
                    <div className="hero-level">
                        {levelTranslations[currentClass.level]} уровень
                    </div>
                </div>
            </div>

            <div className="current-class__container">
                <div className="class-details">
                    <div className="detail-card">
                        <h2 className="detail-title">Описание занятия</h2>
                        <p className="detail-description">{currentClass.description}</p>
                    </div>

                    <div className="detail-card">
                        <h2 className="detail-title">Детали</h2>
                        <div className="detail-meta">
                            <div className="meta-item">
                                <span className="meta-icon">👥</span>
                                Макс. участников: {currentClass.maxParticipant}
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="schedule-title">Расписание занятий</h2>
                <div className="schedule-grid">
                    {currentClass.schedules.map((schedule, index) => (
                        <div className="schedule-card"
                             key={schedule.id}
                             style={{animationDelay: `${index * 0.1}s`}}>
                            <div className="schedule-card__content">
                                <h3 className="schedule-date">
                                    {formatDate(schedule.date)}
                                </h3>
                                <div className="schedule-time">
                                    <span className="time-icon">🕒</span>
                                    {schedule.time.slice(0, 5)}
                                </div>
                                <div className="schedule-info">
                                    <div className="info-item">
                                        <span className="info-icon">⏳</span>
                                        {schedule.duration} минут
                                    </div>
                                    <div className="info-item">
                                        <span className="info-icon">🎫</span>
                                        Свободных мест: {schedule.availableSlots}
                                    </div>
                                </div>
                                <button className="schedule-button"
                                        onClick={() => handleSignUpForClasses(schedule.id)}>
                                    Записаться
                                    <span className="button-arrow"></span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CurrentClass