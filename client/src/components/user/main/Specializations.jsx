import React from 'react';
import {Link} from 'react-router-dom';
import {getAll} from "../../../http/specialization.js";
import {SPECIALIZATION_PATH} from "../../../utils/utils.jsx";

const Specializations = () => {
    const [specializations, setSpecializations] = React.useState([])

    React.useEffect(() => {
        getAll().then(({specializations}) => {
            setSpecializations(specializations.slice(0, 6))
        });
    }, [])

    return (
        <section className="directions">
            <div className="directions__container">
                <h2 className="directions__title">Наши направления</h2>

                <div className="directions__grid">
                    {specializations.map((dir) => (
                        <div key={dir.id}
                             className="directions__card">
                            <div className="directions__image-wrapper">
                                <img src={`${import.meta.env.VITE_API_IMAGE_URL}/${dir.image}`}
                                     alt={dir.name}
                                     className="directions__image"/>
                                <div className="directions__overlay">
                                    <h3 className="directions__name">{dir.name}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Link to={SPECIALIZATION_PATH}
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

export default Specializations;