import React from 'react'
import {useNavigate} from "react-router-dom"
import {CLASSES_PATH} from "../../../utils/utils.jsx";

const Hero = () => {
    const history = useNavigate()
    return (
        <section className="hero">
            <div className="hero__parallax-wrapper">
                <div className="hero__content">
                    <h1 className="hero__title">
                        <span className="hero__title-line">Начни танцевать</span>
                        <span className="hero__title-line">сегодня!</span>
                    </h1>
                    <p className="hero__text">
                        Профессиональные тренеры и современные залы
                        <span className="hero__text-underline"></span>
                    </p>
                    <button className="hero__cta-button"
                            onClick={() => history(CLASSES_PATH)}>
                        <span className="cta-button__text">
                            Перейти к доступным занятиям
                        </span>
                        <div className="cta-button__hover-effect"></div>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;