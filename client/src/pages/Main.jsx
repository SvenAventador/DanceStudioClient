import React from 'react'
import Hero from "../components/user/main/Hero.jsx"
import Specializations from "../components/user/main/Specializations.jsx"
import Subscriptions from "../components/user/main/Subscriptions.jsx";
import Trainers from "../components/user/main/Trainers.jsx";

const Main = () => {
    return (
        <div className="page-wrapper">
            <main className="main-content">
                <Hero />
                <Specializations />
                <Subscriptions />
                <Trainers />
            </main>

        </div>
    );
};

export default Main;