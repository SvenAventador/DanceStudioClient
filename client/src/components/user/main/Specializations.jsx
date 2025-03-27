import React from 'react';
import {Link} from 'react-router-dom';
import {getAll} from "../../../http/specialization.js";

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

                <Link to="/directions"
                      className="directions__button">
                    Просмотреть все
                </Link>
            </div>
        </section>
    );
};

export default Specializations;