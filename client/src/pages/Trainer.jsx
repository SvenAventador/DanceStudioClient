import React from 'react'
import {getAll} from "../http/trainer.js"
import {CLASSES_PATH} from "../utils/utils.jsx"
import {useNavigate} from "react-router-dom"
import useTrainer from "../store/Trainer.js";

const Trainer = () => {
    const [trainers, setTrainers] = React.useState([]);
    const history = useNavigate()

    const {setSelectedTrainer} = useTrainer()

    React.useEffect(() => {
        getAll().then(({trainers}) => {
            setTrainers(trainers);
        })
    }, [])

    const handleSelectTrainer = (trainer) => {
        setSelectedTrainer(trainer)
        history(CLASSES_PATH)
    }

    return (
        <section className="trainers">
            <div className="dynamic-grid"></div>

            <div className="trainers__container">
                <h2 className="animated-title">
                    <span className="title-main">Наши тренеры</span>
                    <span className="title-reflection"></span>
                </h2>
                {
                    trainers.length > 0 ? (
                        <div className="trainers__grid">
                            {trainers.map((trainer, index) => (
                                <div key={trainer.id}
                                     className="trainer-card"
                                     style={{'--delay': index * 0.15 + 's'}}>
                                    <div className="card-wave-effect"></div>
                                    <div className="card-content">
                                        <div className="image-wrapper">
                                            <img src={import.meta.env.VITE_API_IMAGE_URL + '/' + trainer.image}
                                                 alt={trainer.user.fullName}
                                                 className="trainer-photo"/>
                                            <div className="specialization-tag">
                                                {trainer.specialization.name}
                                            </div>
                                        </div>

                                        <div className="info-wrapper">
                                            <h3 className="trainer-name">
                                                {trainer.user.fullName}
                                                <span className="experience">{trainer.experience} лет опыта </span>
                                            </h3>

                                            <p className="bio">
                                                {trainer.bio}
                                            </p>

                                            <button className="action-button"
                                            onClick={() => handleSelectTrainer(trainer)}>
                                                Посмотреть занятия
                                                <svg className="subscription-card__arrow" viewBox="0 0 24 24">
                                                    <path
                                                        d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                                                </svg>
                                            </button>
                                        </div>
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
                            <h3 className="empty__title">Нет доступных тренеров</h3>
                            <p className="empty__text">Что-то не так... Мы скоро исправим это!</p>
                        </div>
                    )
                }
            </div>
        </section>
    );
};

export default Trainer;