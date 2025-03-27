import React from 'react'
import {getAll} from "../../../http/subscription.js"
import {Link} from "react-router-dom";

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = React.useState([])
    React.useEffect(() => {
        getAll().then(({subscription}) => {
            setSubscriptions(subscription.slice(0, 6))
        })
    }, [])

    return (
        <section className="subscriptions">
            <div className="subscriptions__container">
                <h2 className="subscriptions__title">Абонементы</h2>

                <div className="subscriptions__grid">
                    {subscriptions.map((sub) => (
                        <article key={sub.id} className="subscription-card">
                            <div className="subscription-card__content">
                                <h3 className="subscription-card__name"
                                    title={sub.name}>
                                    {sub.name}
                                </h3>
                                <p className="subscription-card__description"
                                   title={sub.description}>
                                    {sub.description}
                                </p>

                                <div className="subscription-card__details">
                                    <div className="subscription-card__price">
                                        <span className="subscription-card__amount"
                                              title={sub.price}>
                                            {sub.price}₽
                                        </span>
                                        <span className="subscription-card__period">/месяц</span>
                                    </div>

                                    <div className="subscription-card__classes">
                                        <span className="subscription-card__count"
                                              title={sub.classCount}>
                                            {sub.classCount}
                                        </span>
                                        <span className="subscription-card__label">занятий</span>
                                    </div>
                                </div>
                                <button className="subscription-card__button">
                                    Выбрать абонемент
                                    <svg className="subscription-card__arrow" viewBox="0 0 24 24">
                                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                                    </svg>
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
                <Link to="/subscriptions"
                      className="subscriptions__all-button">
                    <span>Просмотреть все абонементы</span>
                    <svg className="subscriptions__arrow" viewBox="0 0 24 24">
                        <path d="M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59a.996.996 0 0 0 0-1.41l-6.58-6.6a.996.996 0 1 0-1.41 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1z"/>
                    </svg>
                </Link>
            </div>
        </section>
    );
};

export default Subscriptions;