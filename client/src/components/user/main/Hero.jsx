import React from 'react';

const Hero = () => {
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
                    <button className="hero__cta-button">
                        <span className="cta-button__text">Перейти к доступным занятиям</span>
                        <div className="cta-button__hover-effect"></div>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;