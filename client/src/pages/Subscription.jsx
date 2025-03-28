import React from 'react'
import {buy, getAll} from "../http/subscription.js"
import {useUser} from "../store/User.js";
import {showToast} from "../utils/utils.jsx";
import {Toast} from "primereact/toast";

const Subscription = () => {
    const [subscriptions, setSubscriptions] = React.useState([])

    const toast = React.useRef(null);

    React.useEffect(() => {
        getAll().then(({subscription}) => {
            setSubscriptions(subscription)
        })
    }, [])

    const {user} = useUser()

    const buySubscription = (e, subscriptionId) => {
        e.preventDefault()

        if (!user)
            return showToast(toast, 'error', 'Ошибка покупки абонемента', 'Перед покупкой абонемента необходимо авторизоваться', 5000)

        const data = new FormData()
        data.append('userId', user.id)
        data.append('subscriptionId', subscriptionId)

        buy(data).then(({message}) => {
            return showToast(toast, 'success', 'Поздравляем', `${message}`, 5000)
        }).catch((error) => {
            return showToast(toast, 'error', 'Ошибка покупки абонемента', `${error.response.data.message}`, 5000)
        })
    }

    return (
        <section className="subscriptions">
            <Toast ref={toast}/>
            <div className="subscriptions__container">
                <h2 className="subscriptions__title">Абонементы</h2>

                {
                    subscriptions.length > 0 ? (
                        <div className="subscriptions__grid">
                            {subscriptions.map((sub, index) => (
                                <div key={sub.id}
                                     className="subscription-card"
                                     data-aos="card-glow"
                                     data-aos-delay={index * 100}>
                                    <div className="subscription-card__hover-layer"></div>
                                    <div className="subscription-card__glow"></div>

                                    <div className="subscription-card__content">
                                        <h3 className="subscription-card__name"
                                            title={sub.name}>
                                    <span data-text={sub.name}>
                                        {sub.name}
                                    </span>
                                        </h3>

                                        <p className="subscription-card__description"
                                           title={sub.description}>
                                            {sub.description}
                                        </p>

                                        <div className="subscription-card__details">
                                            <div className="subscription-card__price">
                                        <span className="subscription-card__amount">
                                            {sub.price}₽
                                        </span>
                                                <span className="subscription-card__period">/месяц</span>
                                            </div>

                                            <div className="subscription-card__classes">
                                        <span className="subscription-card__count">
                                            {sub.classCount}
                                        </span>
                                                <span className="subscription-card__label">занятий</span>
                                            </div>
                                        </div>

                                        <button className="subscription-card__button"
                                                onClick={(e) => buySubscription(e, sub.id)}>
                                            <span className="button__text">Купить абонемент</span>
                                            <div className="button__liquid"></div>
                                            <svg className="subscription-card__arrow" viewBox="0 0 24 24">
                                                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="subscriptions__empty">
                            <div className="empty__icon">
                                <div className="empty__pulse"></div>
                                <svg className="empty__symbol" viewBox="0 0 24 24">
                                    <path
                                        d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2m0 18a8 8 0 01-8-8 8 8 0 018-8 8 8 0 018 8 8 8 0 01-8 8"/>
                                </svg>
                            </div>
                            <h3 className="empty__title">Нет доступных абонементов</h3>
                            <p className="empty__text">Скоро мы добавим новые предложения</p>
                        </div>
                    )
                }
            </div>
        </section>
    )
}

export default Subscription