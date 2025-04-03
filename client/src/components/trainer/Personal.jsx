import React from 'react'
import {InputText} from 'primereact/inputtext'
import {Button} from 'primereact/button'
import {Password} from 'primereact/password'
import {InputTextarea} from 'primereact/inputtextarea'
import {Avatar} from 'primereact/avatar'
import {Toast} from 'primereact/toast'
import {Dropdown} from 'primereact/dropdown'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import {useUser} from "../../store/User.js"
import {incline} from "lvovich"
import {
    changeImage,
    editPersonalData,
    getOneByUserId
} from "../../http/trainer.js"
import {getAll} from "../../http/specialization.js"
import {footer, showToast} from "../../utils/utils.jsx"
import {InputMask} from "primereact/inputmask";

const Personal = () => {
    const [isEditing, setIsEditing] = React.useState(false)
    const [avatarUrl, setAvatarUrl] = React.useState('/demo/images/avatar/amyelsner.png')
    const {user} = useUser()
    const fileInputRef = React.useRef(null)
    const toast = React.useRef(null)
    const [currentTrainer, setCurrentTrainer] = React.useState(null)
    const [specializations, setSpecializations] = React.useState([])
    const [selectedSpecialization, setSelectedSpecialization] = React.useState(null)

    React.useEffect(() => {
        getOneByUserId(user.id).then(({trainer}) => {
            setCurrentTrainer(trainer)
        })
        getAll().then(({specializations}) => {
            setSpecializations(specializations)
        })
    }, [user.id])

    const [userData, setUserData] = React.useState({
        fullName: '',
        email: '',
        password: '',
        experience: '',
        bio: '',
        phone: ''
    })

    React.useEffect(() => {
        if (currentTrainer) {
            setUserData({
                fullName: currentTrainer.user?.fullName || '',
                email: currentTrainer.user?.email || '',
                password: '',
                experience: currentTrainer.experience || '',
                bio: currentTrainer.bio || '',
                phone: currentTrainer.user?.phone || '',
            })

            if (currentTrainer.image) {
                setAvatarUrl(`${import.meta.env.VITE_API_IMAGE_URL}/${currentTrainer.image}`)
            }

            if (currentTrainer.specializationId && specializations.length > 0) {
                const spec = specializations.find(s => s.id === currentTrainer.specializationId)
                setSelectedSpecialization(spec)
            }
        }
    }, [currentTrainer, specializations])

    const handleAvatarClick = () => {
        fileInputRef.current.click()
    }

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0]
        if (file) {
            try {
                const trainer = new FormData()
                trainer.append('image', file)
                trainer.append('id', currentTrainer.id)

                changeImage(trainer).then(() => {
                    setAvatarUrl(URL.createObjectURL(file))
                    showToast(toast, "success", "Внимание", "Аватар успешно обновлен!", 3000)
                }).catch((error) => {
                    return showToast(toast, 'error', 'Ошибка', `${error.response.data.message}`, 5000)
                })
            } catch (error) {
                return showToast(toast, 'error', 'Ошибка', `${error.response.data.message}`, 5000)
            }
        }
    }

    const handleEditSave = () => {
        if (!isEditing) {
            setIsEditing(!isEditing)
        } else {
            if (!userData.fullName)
                return showToast(toast, 'error', 'Ошибка', `Пожалуйста, введите ФИО!`, 5000)
            if (!userData.email)
                return showToast(toast, 'error', 'Ошибка', `Пожалуйста, введите почту!`, 5000)
            if (!userData.phone)
                return showToast(toast, 'error', 'Ошибка', `Пожалуйста, введите телефон!`, 5000)
            if (!userData.experience)
                return showToast(toast, 'error', 'Ошибка', `Пожалуйста, введите опыт работы!`, 5000)
            if (!selectedSpecialization)
                return showToast(toast, 'error', 'Ошибка', `Пожалуйста, выберите направление!`, 5000)
            if (!userData.bio)
                return showToast(toast, 'error', 'Ошибка', `Пожалуйста, введите описание!`, 5000)

            const trainer = new FormData()
            trainer.append('id', currentTrainer.id)
            trainer.append('fullName', userData.fullName)
            trainer.append('email', userData.email)
            trainer.append('password', userData.password)
            trainer.append('experience', userData.experience)
            trainer.append('bio', userData.bio)
            trainer.append('phone', userData.phone)
            trainer.append('specializationId', selectedSpecialization.id)

            editPersonalData(trainer).then(() => {
                showToast(toast, 'success', 'Внимание', `Данные успешно изменены!`, 5000)
                setIsEditing(!isEditing)
            }).catch((error) => {
                return showToast(toast, 'error', 'Ошибка', `${error.response.data.message}`, 5000)
            })
        }
    }

    const handleInputChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    const getGenitiveName = (fullName) => {
        if (!fullName)
            return ''
        const parts = fullName.split(' ')
        if (parts.length < 2)
            return fullName

        const inclined = incline({
            first: parts[1],
            middle: parts[2] || '',
            last: parts[0]
        }, 'genitive')

        return [inclined.last, inclined.first, inclined.middle].filter(Boolean).join(' ')
    }

    if (!currentTrainer) return <div>Загрузка...</div>

    return (
        <div className="p-4">
            <Toast ref={toast} position="top-right"/>
            <div className="p-shadow-10 p-p-5"
                 style={{
                     borderRadius: '1.5rem',
                     background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
                     padding: '3rem',
                 }}>
                <div className="p-grid p-ai-start">
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <div className="p-col-12 p-md-4 p-text-center p-pb-4 p-mb-4"
                             style={{
                                 marginRight: '10rem'
                             }}>

                            <div className="p-d-inline-block p-pointer"
                                 onClick={handleAvatarClick}>
                                <Avatar image={avatarUrl}
                                        size="xlarge"
                                        shape="circle"
                                        className="p-mb-3 p-shadow-6"
                                        style={{
                                            width: '240px',
                                            height: '240px',
                                            border: '4px solid var(--primary-color)'
                                        }}/>
                                <input type="file"
                                       ref={fileInputRef}
                                       style={{display: 'none'}}
                                       accept="image/*"
                                       onChange={handleAvatarChange}/>
                                <div className="p-text-secondary p-mt-2">
                                    <i className="pi pi-camera mr-2"></i>
                                    Нажмите для смены фото
                                </div>
                            </div>
                        </div>

                        <div className="p-col-12 p-md-8 p-pl-6"
                             style={{
                                 minWidth: '500px'
                             }}>
                            <h1 className="p-text-left p-mb-4"
                                style={{
                                    color: 'var(--primary-color)',
                                    fontWeight: 600,
                                    fontSize: '2rem',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                                }}>
                                {`Профиль тренера ${getGenitiveName(userData?.fullName)}`}
                            </h1>

                            <div className="p-fluid">
                                {
                                    [
                                        {
                                            field: 'fullName',
                                            label: 'ФИО'
                                        },
                                        {
                                            field: 'email',
                                            label: 'Почта'
                                        },
                                        {
                                            field: 'phone',
                                            label: 'Телефон'
                                        },
                                        {
                                            field: 'password',
                                            label: 'Пароль'
                                        },
                                        {
                                            field: 'experience',
                                            label: 'Опыт работы (лет)'
                                        }
                                    ].map(({field, label}) => (
                                        <div className="p-field p-mb-4"
                                             style={{
                                                 minHeight: '65px'
                                             }}
                                             key={field}>
                                            <label htmlFor={field}
                                                   className="p-text-bold p-text-sm"
                                                   style={{
                                                       color: 'var(--text-color-secondary)',
                                                       fontWeight: 'bold'
                                                   }}>
                                                {label}
                                            </label>
                                            <div className="p-inputgroup">
                                                {
                                                    field === 'phone' && isEditing ? (
                                                        <InputMask id={field}
                                                                   name={field}
                                                                   value={userData[field]}
                                                                   onChange={handleInputChange}
                                                                   mask="+7 (999) 999-99-99"
                                                                   placeholder="+7 (___)-___-____"
                                                                   className="p-inputtext-sm"/>
                                                    ) : isEditing ? (
                                                        field === 'password' ? (
                                                                <Password value={userData[field]}
                                                                          style={{
                                                                              marginTop: '5px',
                                                                              marginBottom: '10px',
                                                                              width: '100%'
                                                                          }}
                                                                          id={field}
                                                                          name={field}
                                                                          className="p-password p-fluid"
                                                                          onChange={handleInputChange}
                                                                          toggleMask
                                                                          footer={footer}/>
                                                        ) : (
                                                            <InputText id={field}
                                                                       name={field}
                                                                       value={userData[field]}
                                                                       onChange={handleInputChange}
                                                                       className="p-inputtext-sm"
                                                            />
                                                        )
                                                    ) : (
                                                        <div className="p-py-2 p-px-3" style={{minHeight: '2.5rem'}}>
                                                            {field === 'password'
                                                                ? '•'.repeat(8)
                                                                : field === 'experience'
                                                                    ? `${userData[field]} лет`
                                                                    : userData[field]}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    ))}

                                <div className="p-field p-mb-4"
                                     style={{
                                         minHeight: '65px'
                                     }}>
                                    <label className="p-text-bold p-text-sm"
                                           style={{
                                               color: 'var(--text-color-secondary)',
                                               fontWeight: 'bold'
                                           }}>
                                        Направление
                                    </label>
                                    <div className="p-inputgroup">
                                        {isEditing ? (
                                            <Dropdown value={selectedSpecialization}
                                                      options={specializations}
                                                      optionLabel="name"
                                                      onChange={(e) => setSelectedSpecialization(e.value)}
                                                      placeholder="Выберите направление"
                                                      style={{
                                                          width: '100%'
                                                      }}/>
                                        ) : (
                                            <div className="p-py-2 p-px-3"
                                                 style={{minHeight: '2.5rem'}}>
                                                {selectedSpecialization?.name || 'Направление не указано'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-field p-mb-4"
                                     style={{
                                         minHeight: '65px'
                                     }}>
                                    <label htmlFor="bio"
                                           className="p-text-bold p-text-sm"
                                           style={{
                                               color: 'var(--text-color-secondary)',
                                               fontWeight: 'bold'
                                           }}>
                                        Описание
                                    </label>
                                    <div className="p-inputgroup">
                                        {isEditing ? (
                                            <InputTextarea id="bio"
                                                           name="bio"
                                                           value={userData.bio}
                                                           onChange={handleInputChange}
                                                           rows={4}
                                                           className="p-inputtext-sm"
                                                           autoResize/>
                                        ) : (
                                            <div className="p-py-2 p-px-3"
                                                 style={{
                                                     minHeight: '2.5rem'
                                                 }}>
                                                {userData.bio}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-d-flex p-jc-end p-mt-6" style={{marginTop: '1rem'}}>
                                    <Button label={isEditing ? 'Сохранить изменения' : 'Редактировать профиль'}
                                            icon={`pi ${isEditing ? 'pi-save' : 'pi-pencil'}`}
                                            className={`p-button-rounded ${isEditing ? 'p-button-success' : 'p-button-info'}`}
                                            onClick={handleEditSave}
                                            style={{
                                                minWidth: '250px'
                                            }}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Personal