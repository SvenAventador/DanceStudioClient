import React from 'react';
import {getAll} from "../http/specialization.js";

const Specialization = () => {
    const [specialization, setSpecialization] = React.useState([]);
    React.useEffect(() => {
        getAll().then(({specializations}) => {
            setSpecialization(specializations)
        })
    }, [])
    return (
        <section className="specializations">
            <div className="specializations__container">
                <h2 className="specializations__title">Направления тренировок</h2>
                {
                    specialization.length > 0 ? (
                        <div className="specializations__grid">
                            {specialization.map((spec, index) => (
                                <div key={spec.id}
                                     className="specialization-card"
                                     style={{'--delay': index * 0.1 + 's'}}>
                                    <div className="specialization-card__hover-effect"></div>

                                    <div className="specialization-card__image-container">
                                        <img
                                            src={import.meta.env.VITE_API_IMAGE_URL + '/' + spec.image}
                                            alt={spec.name}
                                            className="specialization-card__image"
                                        />
                                    </div>

                                    <div className="specialization-card__content">
                                        <h3 className="specialization-card__title" title={spec.name}>
                                            {spec.name}
                                        </h3>

                                        <button className="specialization-card__button">
                                            Перейти к направлению
                                            <div className="button-arrow">
                                                <svg className="subscription-card__arrow" viewBox="0 0 24 24">
                                                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                                                </svg>
                                            </div>
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
                            <h3 className="empty__title">Нет доступных направлений</h3>
                            <p className="empty__text">Что-то не так... Мы скоро исправим это!</p>
                        </div>
                    )
                }
            </div>
        </section>
    );
};

export default Specialization;