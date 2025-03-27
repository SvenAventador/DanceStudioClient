import React from 'react';
import {
    getAll,
    create,
    edit,
    deleteOne,
    deleteAll
} from "../../http/trainer.js"
import {getAll as getAllSpecializations} from "../../http/specialization.js"
import {
    ConfirmDialog,
    confirmDialog
} from "primereact/confirmdialog"
import {Toast} from "primereact/toast"
import {Button} from "primereact/button"
import {InputText} from "primereact/inputtext"
import {Dialog} from "primereact/dialog"
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Dropdown} from "primereact/dropdown"
import {FileUpload} from "primereact/fileupload"
import {itemTemplate, showToast} from "../../utils/utils.jsx"
import {Image} from "primereact/image"
import {InputTextarea} from "primereact/inputtextarea"
import {InputMask} from "primereact/inputmask"

const Trainer = () => {
    const [trainers, setTrainers] = React.useState([])
    const [specializations, setSpecializations] = React.useState([])
    const [selectedTrainers, _] = React.useState([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [modalVisible, setModalVisible] = React.useState(false)
    const [editData, setEditData] = React.useState(null)

    const toast = React.useRef(null)
    const fileUploadRef = React.useRef(null)

    React.useEffect(() => {
        getAll().then(({trainers}) => {
            setTrainers(trainers)
        })
        getAllSpecializations().then(({specializations}) => {
            setSpecializations(specializations)
        })
    }, [])

    const [selectedFile, setSelectedFile] = React.useState(null)
    const [, setImagePreview] = React.useState(null)

    const openModal = (data = null) => {
        setEditData(data || {
            email: "",
            fullName: "",
            phone: "",
            experience: "",
            bio: "",
            specializationId: null,
            image: null
        })

        if (data?.image) {
            const imageUrl = `${import.meta.env.VITE_API_IMAGE_URL}${data.image}`

            fetch(imageUrl)
                .then(res => {
                    if (!res.ok)
                        throw new Error("Ошибка загрузки изображения")
                    return res.blob()
                })
                .then(blob => {
                    const file = new File([blob], data.image, {type: blob.type})

                    file.objectURL = URL.createObjectURL(blob)

                    setImagePreview(imageUrl)
                    setSelectedFile(file)

                    if (fileUploadRef.current)
                        fileUploadRef.current.setFiles([file])
                })
                .catch(error => {
                    console.error("Ошибка загрузки изображения:", error)
                })
        } else {
            setImagePreview(null)
            setSelectedFile(null)
            if (fileUploadRef.current)
                fileUploadRef.current.clear()
        }
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
        setEditData(null)
        setImagePreview(null)
        setSelectedFile(null)
        if (fileUploadRef.current)
            fileUploadRef.current.clear()
    }

    const saveData = () => {
        try {
            if (!editData?.id && !editData?.email)
                return showToast(toast, 'error', 'Ошибка при изменении данных', `Пожалуйста, введите почту!`, 5000)
            if (!editData?.id && !editData?.fullName)
                return showToast(toast, 'error', 'Ошибка при изменении данных', `Пожалуйста, введите ФИО!`, 5000)
            if (!editData?.id && !editData?.phone)
                return showToast(toast, 'error', 'Ошибка при изменении данных', `Пожалуйста, введите номер телефона!`, 5000)
            if (!editData?.experience)
                return showToast(toast, 'error', 'Ошибка при изменении данных', `Пожалуйста, введите опыт тренера!`, 5000)
            if (!editData?.bio)
                return showToast(toast, 'error', 'Ошибка при изменении данных', `Пожалуйста, введите биографию тренера!`, 5000)
            if (!editData?.specializationId)
                return showToast(toast, 'error', 'Ошибка при изменении данных', `Пожалуйста, выберите направление тренера!`, 5000)
            if (!selectedFile)
                return showToast(toast, 'error', 'Ошибка при добавлении изображения', 'Пожалуйста, выберите изображение', 5000)

            if (editData.id) {
                const editTrainer = new FormData()
                editTrainer.append('trainerId', editData.id)
                editTrainer.append('experience', editData.experience)
                editTrainer.append('bio', editData.bio)
                editTrainer.append('specializationId', editData.specializationId)
                if (selectedFile instanceof File)
                    editTrainer.append('image', selectedFile)

                edit(editTrainer).then(() => {
                    showToast(toast, "success", "Поздравляем", "Запись успешно изменена!", 3000);
                    getAll().then(({trainers}) => {
                        setTrainers(trainers)
                    })
                    closeModal()
                }).catch((error) => {
                    return showToast(toast, 'error', 'Ошибка при изменении данных', `${error.response.data.message}`, 5000)
                })
            } else {
                const addTrainer = new FormData()
                addTrainer.append('email', editData.email)
                addTrainer.append('fullName', editData.fullName)
                addTrainer.append('phone', editData.phone)
                addTrainer.append('experience', editData.experience)
                addTrainer.append('bio', editData.bio)
                addTrainer.append('specializationId', editData.specializationId)
                if (selectedFile instanceof File)
                    addTrainer.append('image', selectedFile)

                create(addTrainer).then(() => {
                    showToast(toast, "success", "Поздравляем", "Запись успешно добавлена!", 3000)
                    getAll().then(({trainers}) => {
                        setTrainers(trainers)
                    })
                    closeModal()
                }).catch((error) => {
                    return showToast(toast, 'error', 'Ошибка при изменении данных', `${error.response.data.message}`, 5000)
                })
            }
        } catch (error) {
            showToast(toast, "error", "Ошибка", `${error.response?.data?.message || 'Ошибка запроса'}`, 5000);
        }
    }

    const deleteTrainer = (id) => {
        confirmDialog({
            message: "Вы уверены, что хотите удалить запись?",
            header: "Подтверждение",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Да, удалить",
            rejectLabel: "Отмена",
            rejectClassName: "p-button-danger",
            acceptClassName: "p-button-success",
            accept: async () => {
                try {
                    deleteOne(id).then(() => {
                        showToast(toast, "success", "warn", "Запись успешно удалена", 3000);
                        getAll().then(({trainers}) => {
                            setTrainers(trainers)
                        })
                    })
                } catch (error) {
                    return showToast(toast, 'error', 'Ошибка', `${error.response.data.message}`, 5000)
                }
            }
        })
    }

    const deleteAllTrainers = () => {
        confirmDialog({
            message: "Вы уверены, что хотите удалить выбранные записи?",
            header: "Подтверждение",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Да, удалить",
            rejectLabel: "Отмена",
            rejectClassName: "p-button-danger",
            acceptClassName: "p-button-success",
            accept: async () => {
                try {
                    deleteAll().then(() => {
                        showToast(toast, "warn", "Удалено", "Все записи успешно удалены", 3000)
                        getAll().then(({trainers}) => {
                            setTrainers(trainers)
                        })
                    })
                } catch (error) {
                    return showToast(toast, 'error', 'Ошибка', `${error.response.data.message}`, 5000)
                }
            }
        })
    }

    return (
        <div style={{
            width: "100%",
            position: "absolute"
        }}>
            <Toast ref={toast}/>
            <ConfirmDialog/>
            <DataTable value={trainers}
                       paginator
                       rows={5}
                       selection={selectedTrainers}
                       globalFilter={globalFilter}
                       header={
                           <div className="p-d-flex p-jc-between">
                               <Button label="Добавить"
                                       icon="pi pi-plus"
                                       className="p-button-success p-mr-2"
                                       onClick={openModal}/>
                               <Button label="Удалить все"
                                       icon="pi pi-trash"
                                       className="p-button-danger"
                                       onClick={deleteAllTrainers}/>
                               <InputText placeholder="Поиск данных"
                                          onInput={(e) => setGlobalFilter(e.target.value)}/>
                           </div>
                       }
                       emptyMessage="Нет доступных данных">
                <Column field="id"
                        style={{
                            maxWidth: '50px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        header="ID" sortable/>
                <Column field="user.fullName"
                        style={{
                            maxWidth: '50px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        header="ФИО"/>
                <Column field="user.email"
                        style={{
                            maxWidth: '50px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        header="Почта"/>
                <Column field="user.phone"
                        style={{
                            maxWidth: '50px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        header="Телефон"/>
                <Column field="experience"
                        style={{
                            maxWidth: '50px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        header="Опыт" sortable/>
                <Column field="bio"
                        style={{
                            maxWidth: '50px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        header="Биография"/>
                <Column field="specialization.name"
                        style={{
                            maxWidth: '50px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        header="Направление"/>
                <Column header="Фото"
                        style={{
                            maxWidth: '50px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        body={(rowData) => (
                            rowData.image ?
                                <Image src={import.meta.env.VITE_API_IMAGE_URL + '/' + rowData.image}
                                       preview
                                       alt="trainer"
                                       style={{
                                           width: '100px',
                                           height: '100px',
                                           objectFit: 'contain'
                                       }}/> : <div>Нет изображения</div>
                        )}/>
                <Column header="Действия"
                        body={(rowData) => (
                            <div>
                                <Button icon="pi pi-pencil"
                                        className="p-button-warning"
                                        onClick={() => openModal(rowData)}/>
                                <Button icon="pi pi-trash"
                                        className="p-button-danger"
                                        onClick={() => deleteTrainer(rowData.id)}/>
                            </div>
                        )}/>
            </DataTable>

            <Dialog header={editData?.id ? "Редактирование тренера" : "Добавление тренера"}
                    visible={modalVisible}
                    onHide={closeModal}
                    modal>
                <div className="p-fluid">
                    {
                        !editData?.id && <InputText value={editData?.email || ""}
                                                    onChange={(e) => setEditData({
                                                        ...editData,
                                                        email: e.target.value
                                                    })}
                                                    placeholder="Email"/>
                    }

                    {
                        !editData?.id && <InputText value={editData?.fullName || ""}
                                                    onChange={(e) => setEditData({
                                                        ...editData,
                                                        fullName: e.target.value
                                                    })}
                                                    placeholder="ФИО"/>
                    }

                    {
                        !editData?.id && <InputMask value={editData?.phone || ""}
                                                    onChange={(e) => setEditData({
                                                        ...editData,
                                                        phone: e.target.value
                                                    })}
                                                    mask="+7 (999) 999-99-99"
                                                    placeholder="+7 (999) 999-99-99"/>
                    }

                    <InputText value={editData?.experience || ""}
                               onChange={(e) => setEditData({
                                   ...editData,
                                   experience: e.target.value
                               })}
                               placeholder="Опыт"/>

                    <InputTextarea value={editData?.bio || ""}
                                   rows={5}
                                   cols={30}
                                   autoResize
                                   onChange={(e) => setEditData({
                                       ...editData,
                                       bio: e.target.value
                                   })}
                                   placeholder="Биография"/>

                    <Dropdown value={editData?.specializationId}
                              options={specializations}
                              optionLabel="name"
                              optionValue="id"
                              onChange={(e) => setEditData({
                                  ...editData,
                                  specializationId: e.value
                              })}
                              placeholder="Выберите направление"/>

                    <FileUpload ref={fileUploadRef}
                                name="image"
                                accept="image/*"
                                customUpload
                                auto
                                chooseLabel="Выберите изображение"
                                uploadLabel="Загрузить"
                                cancelLabel="Отмена"
                                maxFileSize={10000000}
                                multiple={false}
                                itemTemplate={itemTemplate}
                                onSelect={(e) => {
                                    setSelectedFile(e.files[0]);
                                    setImagePreview(URL.createObjectURL(e.files[0]));
                                }}
                                onClear={() => {
                                    setSelectedFile(null);
                                    setImagePreview(null);
                                }}/>

                    <Button label="Сохранить"
                            className="p-button-success"
                            onClick={saveData}/>
                </div>
            </Dialog>

        </div>
    );
};

export default Trainer;