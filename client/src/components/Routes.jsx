import React from 'react'
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom"

import Header from "./user/global/Header.jsx"
import Footer from "./user/global/Footer.jsx"
import {
    ADMIN_PATH,
    CLASSES_PATH,
    CURRENT_CLASS,
    LOGIN_PATH,
    MAIN_PATH,
    PERSONAL_PATH,
    REGISTRATION_PATH,
    SPECIALIZATION_PATH,
    SUBSCRIPTION_PATH,
    TRAINER_PATH,
    TRAINER_PERSONAL_PATH
} from "../utils/utils.jsx"

import Main from "../pages/Main.jsx"
import Auth from "../pages/Auth.jsx"
import Admin from "../pages/admin/Admin.jsx"
import Subscription from "../pages/Subscription.jsx"
import Trainer from "../pages/Trainer.jsx"
import TrainerPerson from "../pages/trainer/Trainer.jsx"
import Specialization from "../pages/Specialization.jsx"
import Personal from "../pages/user/Personal.jsx"
import NotFound from "../pages/NotFound.jsx"
import Classes from "../pages/Classes.jsx"
import CurrentClass from "../pages/CurrentClass.jsx"

const Layout = ({children}) => {
    return (
        <>
            <div className="content-wrapper">
                <Header/>
                <main className="main">
                    {children}
                </main>
                <Footer/>
            </div>
        </>
    )
}

const SiteNavigation = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={MAIN_PATH}
                       element={
                           <Layout>
                               <Main/>
                           </Layout>
                       }/>

                <Route path={REGISTRATION_PATH}
                       element={
                           <main className="main">
                               <Auth/>
                           </main>
                       }/>
                <Route path={LOGIN_PATH}
                       element={
                           <main className="main">
                               <Auth/>
                           </main>
                       }/>
                <Route path={ADMIN_PATH}
                       element={
                           <main className="main">
                               <Admin/>
                           </main>
                       }/>
                <Route path={TRAINER_PATH}
                       element={
                           <Layout>
                               <Trainer/>
                           </Layout>
                       }/>
                <Route path={SUBSCRIPTION_PATH}
                       element={
                           <Layout>
                               <Subscription/>
                           </Layout>
                       }/>
                <Route path={TRAINER_PERSONAL_PATH}
                       element={
                           <main className="main">
                               <TrainerPerson/>
                           </main>
                       }/>
                <Route path={SPECIALIZATION_PATH}
                       element={
                           <Layout>
                               <Specialization/>
                           </Layout>
                       }/>
                <Route path={CLASSES_PATH}
                       element={
                           <Layout>
                               <Classes/>
                           </Layout>
                       }/>
                <Route path={PERSONAL_PATH + '/:id'}
                       element={
                           <Layout>
                               <Personal/>
                           </Layout>
                       }/>
                <Route path={CURRENT_CLASS + '/:id'}
                       element={
                           <Layout>
                               <CurrentClass/>
                           </Layout>
                       }/>


                <Route path="*"
                       element={
                           <NotFound/>
                       }/>
            </Routes>
        </BrowserRouter>
    )
}

export default SiteNavigation;