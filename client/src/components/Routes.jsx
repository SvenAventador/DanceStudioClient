import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Header from "./user/global/Header.jsx";
import Footer from "./user/global/Footer.jsx";
import {ADMIN_PATH, LOGIN_PATH, MAIN_PATH, REGISTRATION_PATH} from "../utils/utils.jsx";
import Main from "../pages/Main.jsx";
import Auth from "../pages/Auth.jsx";
import Admin from "../pages/admin/Admin.jsx";

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
                                <Main />
                            </Layout>
                       } />

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
            </Routes>
        </BrowserRouter>
    )
}

export default SiteNavigation;