import React from 'react'
import {
    useNavigate,
    useParams
} from 'react-router-dom'
import {
    getOneWithData
} from '../http/trainer'
import {Rating} from 'primereact/rating'
import {Button} from 'primereact/button'
import {useUser} from "../store/User.js"
import {CURRENT_CLASS, showToast} from "../utils/utils.jsx"
import {createComment, getAllComments} from "../http/comments.js"
import {Toast} from "primereact/toast";

const CurrentTrainer = () => {
    const {id} = useParams();
    const [currentTrainer, setCurrentTrainer] = React.useState(null)
    const [comments, setComments] = React.useState([])
    const [newComment, setNewComment] = React.useState('')
    const [rating, setRating] = React.useState(0)
    const history = useNavigate()
    const {user} = useUser()
    const toast = React.useRef(null)

    React.useEffect(() => {
        getOneWithData(id).then(({trainer}) => {
            setCurrentTrainer(trainer)
        })
        getAllComments(id).then(({allComment}) => {
            setComments(allComment || [])
        })
    }, [id])

    const handleSubmitComment = () => {
        const addComments = new FormData()
        addComments.append('rating', rating)
        addComments.append('comment', newComment)
        addComments.append('userId', user.id)
        addComments.append('trainerId', id)

        createComment(addComments).then(() => {
            getAllComments(id).then(({allComment}) => {
                setComments(allComment || [])
            })
            setNewComment('')
            setRating(0)
        }).catch((error) => {
            return showToast(toast, 'error', 'Ошибка', `${error.response.data.message}`, 5000)
        })
    }

    if (!currentTrainer) return <div className="loader">Загрузка...</div>

    const levels = [
        {value: 'Elementary', label: 'Начальный'},
        {value: 'Intermediate', label: 'Средний'},
        {value: 'UpperIntermediate', label: 'Продвинутый'},
    ]

    return (
        <div className="current-trainer-container">
            <Toast ref={toast}/>
            <div className="current-trainer-container">
                <section className="trainer-profile">
                    <div className="profile-header">
                        <div className="image-wrapper">
                            <img src={`${import.meta.env.VITE_API_IMAGE_URL}/${currentTrainer.image}`}
                                 alt={currentTrainer.user.fullName}
                                 className="trainer-photo"/>
                            <span className="specialization-tag">
                            Специализация: {currentTrainer.specialization.name}
                        </span>
                        </div>

                        <div className="profile-info">
                            <h1 className="trainer-name">
                                {currentTrainer.user.fullName}
                                <span className="experience">
                                Опыт: {currentTrainer.experience} лет
                            </span>
                            </h1>
                            <p className="bio">{currentTrainer.bio}</p>

                            <div className="contact-info">
                                <Button icon="pi pi-phone"
                                        label={currentTrainer.user.phone}
                                        className="p-button-text"/>
                                <Button icon="pi pi-envelope"
                                        label={currentTrainer.user.email}
                                        className="p-button-text"/>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="trainer-classes">
                    <h2 className="section-title">Мои занятия</h2>
                    <div className="classes-grid">
                        {currentTrainer.classes.map(cls => (
                            <div key={cls.id}
                                 className="class-card"
                                 onClick={() => history(CURRENT_CLASS + '/' + cls.id)}>
                                <img src={`${import.meta.env.VITE_API_IMAGE_URL}/${cls.image}`}
                                     alt={cls.name}
                                     className="class-image"/>
                                <div className="class-info">
                                    <h3>{cls.name}</h3>
                                    <div className="class-meta">
                                        <span>Уровень: {levels.find(l => l.value === cls.level)?.label || cls.level}</span>
                                        <span>Макс. участников: {cls.maxParticipant}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="trainer-comments">
                    <h2 className="section-title">Отзывы
                        ({comments?.length || 0})</h2>

                    {user && (
                        <div className="comment-form">
                            <Rating value={rating}
                                    onChange={(e) => setRating(e.value)}
                                    cancel={false}/>
                            <textarea value={newComment}
                                      onChange={(e) => setNewComment(e.target.value)}
                                      placeholder="Оставьте Ваш отзыв..."
                                      rows="4"/>
                            <Button label="Отправить"
                                    icon="pi pi-send"
                                    onClick={handleSubmitComment}
                                    disabled={!newComment.trim() || rating === 0}/>
                        </div>
                    )}

                    <div className="comments-list">
                        {comments.map(comment => (
                            <div key={comment.id}
                                 className="comment-card">
                                <div className="comment-header">
                                    <h4>{comment.user?.fullName || 'Анонимный пользователь'}</h4>
                                    <div className="comment-meta">
                                        <Rating value={comment.rating}
                                                readOnly
                                                cancel={false}/>
                                        <span>{comment.date}</span>
                                    </div>
                                </div>
                                <p className="comment-text">{comment.comment}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CurrentTrainer;