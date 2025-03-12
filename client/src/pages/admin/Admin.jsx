import React from 'react';
import {Menu} from 'primereact/menu';
import {useNavigate} from 'react-router-dom';
import {PrimeIcons} from 'primereact/api';
import {useUser} from "../../store/User.js";
import {Toast} from "primereact/toast";
import {MAIN_PATH, showToast} from "../../utils/utils.jsx";
import Trainer from "../../components/admin/Trainer.jsx";
import Subscription from "../../components/admin/Subscription.jsx";
import Specialization from "../../components/admin/Specialization.jsx";

const Admin = () => {
    const toast = React.useRef(null)

    const [selectedMenuItem, setSelectedMenuItem] = React.useState('specialization')
    const navigate = useNavigate()

    const {logoutUser} = useUser()

    const items = [
        {
            label: 'Специализация тренера',
            icon: PrimeIcons.STAR,
            command: () => setSelectedMenuItem('specialization')
        },
        {
            label: 'Тренеры',
            icon: PrimeIcons.USER,
            command: () => setSelectedMenuItem('trainers')
        },
        {
            label: 'Абонементы',
            icon: PrimeIcons.ID_CARD,
            command: () => setSelectedMenuItem('subscriptions')
        },
        {
            label: 'Выход',
            icon: PrimeIcons.SIGN_OUT,
            command: () => {
                logoutUser().then(() => {
                    showToast(toast, 'success', 'До встречи', 'Приходите к нам снова', 3000)

                    setTimeout(() => {
                        navigate(MAIN_PATH)
                    }, 3000)
                })
            }
        }
    ]

    return (
        <div style={{
            display: 'flex',
            width: "100wv",
            height: "100vh"
        }}>
            <Toast ref={toast}/>
            <Menu model={items}/>

            <div>
                {selectedMenuItem === 'trainers' && <Trainer/>}
                {selectedMenuItem === 'subscriptions' && <Subscription/>}
                {selectedMenuItem === 'specialization' && <Specialization/>}
            </div>
        </div>
    );
};

export default Admin;