import React from 'react'
import {getAll} from "../http/classes.js"
import {getAll as getAllTrainer} from "../http/trainer.js"
import {getAll as getAllSpecialization} from "../http/specialization.js"
import useSpecialization from "../store/Specialization.js"
import useTrainer from "../store/Trainer.js"
import {useNavigate} from "react-router-dom"
import {CURRENT_CLASS} from "../utils/utils.jsx";

const Classes = () => {
    const [classes, setClasses] = React.useState([])
    const [trainer, setTrainer] = React.useState([])
    const [specialization, setSpecialization] = React.useState([])

    const history = useNavigate()

    const {selectedSpecialization, clearSelectedSpecialization} = useSpecialization()
    const {selectedTrainer, clearSelectedTrainer} = useTrainer()

    const levels = [
        {value: 'Elementary', label: 'Начальный'},
        {value: 'Intermediate', label: 'Средний'},
        {value: 'UpperIntermediate', label: 'Продвинутый'},
    ]

    const [level, setLevel] = React.useState('')
    const [trainerId, setTrainerId] = React.useState(selectedTrainer?.id || '')
    const [specializationId, setSpecializationId] = React.useState(selectedSpecialization?.id || '')

    React.useEffect(() => {
        setTrainerId(selectedTrainer?.id || '')
    }, [selectedTrainer])

    React.useEffect(() => {
        setSpecializationId(selectedSpecialization?.id || '')
    }, [selectedSpecialization])

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const params = {
                    level: level || undefined,
                    trainerId: trainerId || undefined,
                    specializationId: specializationId || undefined
                }

                const {classes} = await getAll(params)
                setClasses(classes)
            } catch (error) {
                console.error('Ошибка загрузки:', error)
            }
        }

        fetchData()
    }, [level, trainerId, specializationId])

    React.useEffect(() => {
        getAllTrainer().then(({trainers}) => setTrainer(trainers))
        getAllSpecialization().then(({specializations}) => setSpecialization(specializations))
    }, [])

    return (
        <section className="classes">
            <div className="classes__container">
                <h2 className="classes__title">Доступные занятия</h2>

                <div className="filters">
                    <div className="filters__group">
                        <select className="filters__select"
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}>
                            <option value="">Все уровни</option>
                            {levels.map((lvl) => (
                                <option key={lvl.value} value={lvl.value}>
                                    {lvl.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filters__group">
                        <select className="filters__select"
                                value={trainerId}
                                onChange={(e) => setTrainerId(e.target.value)}>
                            <option value="">Все тренеры</option>
                            {trainer.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.user.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filters__group">
                        <select className="filters__select"
                                value={specializationId}
                                onChange={(e) => setSpecializationId(e.target.value)}>
                            <option value="">Все направления</option>
                            {specialization.map((spec) => (
                                <option key={spec.id} value={spec.id}>
                                    {spec.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className="filters__button"
                            onClick={() => {
                                clearSelectedTrainer()
                                clearSelectedSpecialization()
                                setLevel('')
                                setTrainerId('')
                                setSpecializationId('')
                            }}>
                        Очистить фильтры
                    </button>
                </div>

                {classes.length > 0 ? (
                    <div className="classes__grid">
                        {classes.map((cls, index) => (
                            <div key={cls.id}
                                 className="class-card"
                                 style={{'--delay': index * 0.1 + 's'}}>
                                <div className="class-card__hover-layer"></div>
                                <div className="class-card__image-container">
                                    <img src={import.meta.env.VITE_API_IMAGE_URL + "/" + cls.image}
                                         alt={cls.name}
                                         className="class-card__image"/>
                                    <div className="class-card__level">
                                        {
                                            levels.find(l => l.value === cls.level)?.label || cls.level
                                        }
                                    </div>
                                </div>

                                <div className="class-card__content">
                                    <h3 className="class-card__name">
                                        {cls.name}
                                        <span className="class-card__participants">
                                            🧑🏽🤝🧑🏻 До {cls.maxParticipant} чел.
                                        </span>
                                    </h3>

                                    <p className="class-card__description">
                                        {cls.description}
                                    </p>

                                    <button className="class-card__button"
                                            onClick={() => history(CURRENT_CLASS + '/' + cls.id)}>
                                        Подробнее
                                        <div className="button-arrow"></div>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="subscriptions__empty">
                        <div className="empty__icon">
                            <div className="empty__pulse"></div>
                            <svg className="empty__symbol" viewBox="0 0 24 24">
                                <path
                                    d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2m0 18a8 8 0 01-8-8 8 8 0 018-8 8 8 0 018 8 8 8 0 01-8 8"/>
                            </svg>
                        </div>
                        <h3 className="empty__title">Нет доступных занятий</h3>
                        <p className="empty__text">Следите за обновлениями</p>
                    </div>
                )}
            </div>
        </section>
    )
}

export default Classes