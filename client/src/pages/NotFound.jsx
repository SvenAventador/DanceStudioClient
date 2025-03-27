import React from 'react'
import {Link} from 'react-router-dom'
import {MAIN_PATH} from "../utils/utils.jsx"

const NotFound = () => {
    return (
        <section className="not-found">
            <div className="not-found__container">
                <div className="not-found__content">
                    <div className="not-found__illustration">
                        <svg viewBox="0 0 500 500"
                             className="astro">
                            <g className="astro__body">
                                <path fill="#2A5D8A"
                                      d="M250 350c-60.6 0-110-49.4-110-110s49.4-110 110-110 110 49.4 110 110-49.4 110-110 110z"/>
                                <path fill="#3A7BAE"
                                      d="M250 260c-33.1 0-60-26.9-60-60s26.9-60 60-60 60 26.9 60 60-26.9 60-60 60z"/>
                            </g>
                            <g className="astro__stars">
                                <path fill="#FFF"
                                      d="M80 120l20-10-10 20-20 10z"
                                      className="star"/>
                                <path fill="#FFF"
                                      d="M420 80l15-5-5 15-15 5z"
                                      className="star"/>
                                <path fill="#FFF"
                                      d="M180 40l10-10-10 10-10 10z"
                                      className="star"/>
                            </g>
                            <path className="astro__comet" fill="#FFD54F" d="M490 50l-30 10 20-20-10-30z"/>
                        </svg>
                    </div>

                    <div className="not-found__text">
                        <h1 className="not-found__title">
                            <span>4</span>
                            <span>0</span>
                            <span>4</span>
                        </h1>
                        <p className="not-found__subtitle">Страница потерялась в космосе</p>
                        <Link to={MAIN_PATH}
                              className="not-found__button">
                            Вернуться на орбиту
                            <svg viewBox="0 0 24 24">
                                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NotFound;