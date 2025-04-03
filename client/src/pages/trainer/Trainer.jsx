import React, {useState} from 'react'
import {
    TabView,
    TabPanel
} from 'primereact/tabview'
import Personal from "../../components/trainer/Personal.jsx"
import Classes from "../../components/trainer/Classes.jsx"
import Clients from "../../components/trainer/Clients.jsx"
import {useUser} from "../../store/User.js";
import {MAIN_PATH, showToast} from "../../utils/utils.jsx";
import {Toast} from "primereact/toast";
import {useNavigate} from "react-router-dom";

const Trainer = () => {
    const [activeIndex, setActiveIndex] = useState(0)

    const toast = React.useRef(null)
    const history = useNavigate()

    const {logoutUser} = useUser()

    const headerTemplate = (icon, text) => (
        <div className="flex align-items-center gap-2">
            <i className={`pi ${icon}`}/>
            <span>{text}</span>
        </div>
    )

    const handleLogout = () => {
        logoutUser().then(() => {
            showToast(toast, "success", "До скорых встреч!", "Приходите к нам снова 💘", 3000)
            setTimeout(() => {
                history(MAIN_PATH);
            }, 3000)
        })
    }

    return (
        <div className="card">
            <Toast ref={toast}/>

            <TabView activeIndex={activeIndex}
                     onTabChange={(e) => setActiveIndex(e.index)}
                     panelContainerClassName="p-3"
                     className="w-full"
                     transitionOptions={{
                         timeout: 150,
                         classNames: 'fade'
                     }}
                     scrollable={false}>
                <TabPanel header={headerTemplate('pi-user', 'Личный кабинет')}>
                    <Personal/>
                </TabPanel>
                <TabPanel header={headerTemplate('pi-calendar', 'Занятия')}>
                    <Classes/>
                </TabPanel>
                <TabPanel header={headerTemplate('pi-users', 'Пользователи')}>
                    <Clients/>
                </TabPanel>
                <TabPanel header={
                    <div className="flex align-items-center gap-2"
                         onClick={(e) => {
                             e.stopPropagation()
                             handleLogout()
                         }}>
                        <i className="pi pi-sign-out"/>
                        <span>Выйти</span>
                    </div>
                }>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default Trainer;