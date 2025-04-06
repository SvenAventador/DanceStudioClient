import React from 'react'
import {useUser} from "../../store/User.js"
import {
    editData,
    getCurrentClass,
    getCurrentSubscription,
    deleteCurrentClass
} from "../../http/personal.js"
import {Toast} from "primereact/toast"
import {showToast} from "../../utils/utils.jsx"
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";

const UserCabinet = () => {
    const {user, updateUserLocal} = useUser()
    const [subscription, setSubscription] = React.useState([])
    const [bookings, setBookings] = React.useState([])
    const [isEditing, setIsEditing] = React.useState(false)
    const [tempData, setTempData] = React.useState({...user})
    const [loading, setLoading] = React.useState(false)
    const toast = React.useRef(null)

    React.useEffect(() => {
        if (user?.id) {
            getCurrentSubscription(user.id).then(setSubscription)
            getCurrentClass(user.id).then(setBookings)
        }
    }, [user?.id])

    const handleEdit = async () => {
        if (!isEditing) {
            setTempData({
                ...user,
                password: ''
            })
            setIsEditing(true)
            return
        }

        try {
            setLoading(true)

            if (!tempData.email)
                return showToast(toast, 'error', 'Ошибка записи', 'Пожалуйста, введите почту!', 5000)
            if (!tempData.fullName)
                return showToast(toast, 'error', 'Ошибка записи', 'Пожалуйста, введите ФИО!', 5000)
            if (tempData.fullName.split(' ').length < 2)
                return showToast(toast, 'error', 'Ошибка записи', 'Пожалуйста, введите  корректное ФИО!', 5000)
            if (!tempData.phone)
                return showToast(toast, 'error', 'Ошибка записи', 'Пожалуйста, введите почту!', 5000)

            updateUserLocal(tempData.email, tempData.fullName, tempData.phone)

            const editUser = new FormData()
            editUser.append('userId', user.id)
            editUser.append('email', tempData.email)
            tempData.password && editUser.append('password', tempData.password)
            editUser.append('fullName', tempData.fullName)
            editUser.append('phone', tempData.phone)

            await editData(editUser)
            showToast(toast, 'success', 'Поздравляем', 'Вы успешно обновили свои данные', 5000)
            setIsEditing(false)
        } catch (error) {
            showToast(toast, 'error', 'Ошибка изменения данных', error.response?.data?.message, 5000)
            setIsEditing(true)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setTempData({
            ...tempData,
            [e.target.name]: e.target.value
        })
    }

    const formatDate = (dateString) => {
        const options = {day: 'numeric', month: 'long', year: 'numeric'}
        return new Date(dateString).toLocaleDateString('ru-RU', options)
    }

    const translateLevel = (level) => {
        const levels = {
            'Elementary': 'Начальный',
            'Intermediate': 'Средний',
            'UpperIntermediate': 'Продвинутый'
        }
        return levels[level] || level
    }

    const deleteCurrentClasses = (id) => {
        confirmDialog({
            message: "Вы уверены, что хотите удалить запись?",
            header: "Подтверждение",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Да, удалить",
            rejectLabel: "Отмена",
            rejectClassName: "p-button-danger",
            acceptClassName: "p-button-success",
            accept: async () => {
                try {
                    deleteCurrentClass(id).then(() => {
                        showToast(toast, "success", "Удалено", "Запись успешно удалена", 3000)
                        getCurrentSubscription(user.id).then(setSubscription)
                        getCurrentClass(user.id).then(setBookings)
                    })
                } catch (error) {
                    return showToast(toast, 'error', 'Ошибка', `${error.response.data.message}`, 5000)
                }
            }
        })
    }


    return (
        <div className="user-cabinet">
            <Toast ref={toast}/>
            <ConfirmDialog/>

            <div className="cabinet-header">
                <h1 className="welcome-title">
                    Добро пожаловать, {user.fullName}!
                </h1>
            </div>

            <div className="cabinet-content">
                <div className="personal-info">
                    <div className="info-card">
                        <h2 className="section-title">Личные данные</h2>
                        {isEditing ? (
                            <div className="edit-form">
                                <div className="form-group">
                                    <label>Электронная почта</label>
                                    <input type="email"
                                           name="email"
                                           value={tempData.email}
                                           onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <label>Новый пароль</label>
                                    <input type="password"
                                           name="password"
                                           placeholder="Оставьте пустым, если не меняется"
                                           value={tempData.password || ''}
                                           onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <label>ФИО</label>
                                    <input type="text"
                                           name="fullName"
                                           value={tempData.fullName}
                                           onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <label>Телефон</label>
                                    <input type="tel"
                                           name="phone"
                                           value={tempData.phone}
                                           onChange={handleChange}/>
                                </div>
                            </div>
                        ) : (
                            <div className="info-content">
                                <div className="info-item">
                                    <span className="info-icon">📧</span>
                                    {user.email}
                                </div>
                                <div className="info-item">
                                    <span className="info-icon">🔒</span>
                                    ✷✷✷✷✷✷✷✷✷✷
                                </div>
                                <div className="info-item">
                                    <span className="info-icon">👤</span>
                                    {user.fullName}
                                </div>
                                <div className="info-item">
                                    <span className="info-icon">📱</span>
                                    {user.phone}
                                </div>
                            </div>
                        )}

                        <button className="edit-button"
                                onClick={handleEdit}
                                disabled={loading}>
                            {
                                loading ? 'Сохранение...' :
                                    isEditing ? 'Сохранить изменения' : 'Редактировать данные'
                            }
                        </button>
                    </div>
                </div>

                <div className="subscription-section">
                    <div className="subscription-card">
                        <div className="card-glow"></div>
                        <div className="card-particles">
                            {[...Array(100)].map((_, i) => (
                                <div
                                    className="particle"
                                    key={i}
                                    style={{
                                        '--x': Math.random(),
                                        '--y': Math.random(),
                                        '--delay': Math.random() * 2
                                    }}
                                ></div>
                            ))}
                        </div>
                        <h3 className="subscription-title">{subscription.name}</h3>
                        <div className="subscription-details">
                            <div className="detail-item">
                                <span className="detail-icon">⭐</span>
                                Осталось занятий: {subscription.classCount}
                            </div>
                            <div className="detail-item">
                                <span className="detail-icon">💰</span>
                                Стоимость: {subscription.price} ₽
                            </div>
                        </div>
                        <div className="subscription-description">
                            {subscription.description}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bookings-section">
                <h2 className="bookings-title">Ваши записи</h2>
                <div className="bookings-grid">
                    {
                        bookings.length > 0 ? (
                            bookings.map((booking, index) => (

                                <div className="booking-card"
                                     key={booking.id}
                                     style={{
                                         animationDelay: `${index * 0.1}s`
                                     }}>
                                    <div className="card-header">
                                        <h3 className="class-name">
                                            {booking.schedule.class.name}
                                        </h3>
                                        <span className="class-level">
                                    {translateLevel(booking.schedule.class.level)}
                                </span>
                                    </div>

                                    <div className="card-details">
                                        <div className="detail">
                                            <span className="detail-icon">📅</span>
                                            {formatDate(booking.schedule.date)}
                                        </div>
                                        <div className="detail">
                                            <span className="detail-icon">🕒</span>
                                            {booking.schedule.time.slice(0, 5)}
                                        </div>
                                        <div className="detail">
                                            <span className="detail-icon">⏳</span>
                                            Длительность: {booking.schedule.duration} мин
                                        </div>
                                    </div>

                                    <button className="cancel-button"
                                            onClick={() => deleteCurrentClasses(booking.id)}>
                                        Отменить запись
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state-container">
                                <div className="subscriptions__empty">
                                    <div className="empty__icon">
                                        <div className="empty__pulse"></div>
                                        <svg className="empty__symbol" viewBox="0 0 24 24">
                                            <path d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2m0 18a8 8 0 01-8-8 8 8 0 018-8 8 8 0 018 8 8 8 0 01-8 8"/>
                                        </svg>
                                    </div>
                                    <h3 className="empty__title">Нет доступных записей</h3>
                                    <p className="empty__text">Вы никуда не записаны? Время это исправить!</p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default UserCabinet