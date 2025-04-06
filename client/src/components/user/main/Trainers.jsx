import React from 'react';
import { Link } from 'react-router-dom';
import { getAll } from "../../../http/trainer.js";
import {TRAINER_PATH} from "../../../utils/utils.jsx";

const Trainers = () => {
    const [trainers, setTrainers] = React.useState([]);

    React.useEffect(() => {
        getAll().then(({ trainers }) => {
            setTrainers(trainers.slice(0, 6));
        })
    }, [])

    return (
        <section className="trainers">
            <div className="trainers__container">
                <h2 className="trainers__title">Наши тренеры</h2>

                <div className="trainers__grid">
                    {trainers.map((trainer) => (
                        <article key={trainer.id} className="trainer-card">
                            <div className="trainer-card__image-wrapper">
                                <img
                                    src={`${import.meta.env.VITE_API_IMAGE_URL}/${trainer.image}`}
                                    alt={trainer.user.fullName}
                                    className="trainer-card__image"
                                />
                                <div className="trainer-card__overlay">
                                    <span className="trainer-card__experience">
                                        Опыт: {trainer.experience} лет
                                    </span>
                                    <span className="trainer-card__specialization">
                                        {trainer.specialization.name}
                                    </span>
                                </div>
                            </div>

                            <div className="trainer-card__content">
                                <h3 className="trainer-card__name">
                                    {trainer.user.fullName}
                                </h3>
                                <p className="trainer-card__bio" title={trainer.bio}>
                                    {trainer.bio}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                <Link to={TRAINER_PATH}
                      className="trainers__all-button">
                    Просмотреть всех тренеров
                    <svg className="trainers__arrow"
                         viewBox="0 0 24 24">
                        <path d="M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59a.996.996 0 0 0 0-1.41l-6.58-6.6a.996.996 0 1 0-1.41 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1z"/>
                    </svg>
                </Link>
            </div>
        </section>
    );
};

export default Trainers;