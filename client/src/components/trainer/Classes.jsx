import React from 'react'
import {
    create,
    edit,
    getAll,
    getCurrentTrainer,
    deleteOne,
    deleteAll
} from "../../http/classes.js"
import {
    create as createSchedule,
    edit as editSchedule,
    getAll as getSchedules,
    deleteOne as deleteSchedule,
    deleteAll as deleteSchedules
} from "../../http/schedule.js"
import {useUser} from "../../store/User.js"
import {Toast} from "primereact/toast"
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog"
import {DataTable} from "primereact/datatable"
import {Button} from "primereact/button"
import {InputText} from "primereact/inputtext"
import {Column} from "primereact/column"
import {Image} from "primereact/image"
import {Dialog} from "primereact/dialog"
import {FileUpload} from "primereact/fileupload"
import {
    itemTemplate,
    showToast
} from "../../utils/utils.jsx"
import {InputTextarea} from "primereact/inputtextarea"
import {InputNumber} from "primereact/inputnumber"
import {Dropdown} from "primereact/dropdown"
import {Calendar} from "primereact/calendar"

const Classes = () => {
    const {user} = useUser()

    const [classes, setClasses] = React.useState([])
    const [currentTrainer, setCurrentTrainer] = React.useState([])
    React.useEffect(() => {
        getCurrentTrainer(user.id).then(({currentTrainer}) => {
            setCurrentTrainer(currentTrainer)
        })

        getAll().then(({classes}) => {
            setClasses(classes)
        })
    }, [])

    const [selectedClasses, setSelectedClasses] = React.useState([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [modalVisible, setModalVisible] = React.useState(false)
    const [editData, setEditData] = React.useState(null)

    const [scheduleModalVisible, setScheduleModalVisible] = React.useState(false)
    const [currentSchedule, setCurrentSchedule] = React.useState(null)
    const [_, setSelectedClassId] = React.useState(null)
    const [expandedRows, setExpandedRows] = React.useState([])

    const toast = React.useRef(null)
    const fileUploadRef = React.useRef(null)

    const [selectedFile, setSelectedFile] = React.useState(null)
    const [, setImagePreview] = React.useState(null)

    const openModal = (data = null) => {
        setEditData(data || {
            name: "",
            description: "",
            maxParticipant: 0,
            level: "Intermediate",
            trainerId: 0,
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
            if (!editData.name)
                return showToast(toast, 'error', 'Ошибка при добавлении данных', `Пожалуйста, введите название занятия!`, 5000)
            if (!editData.description)
                return showToast(toast, 'error', 'Ошибка при добавлении данных', `Пожалуйста, введите описание занятия!`, 5000)
            if (!editData.maxParticipant || editData.maxParticipant < 1)
                return showToast(toast,
                    'error',
                    'Ошибка при добавлении данных',
                    `Пожалуйста, введите корректное количество участников занятия (больше 1-го)!`,
                    5000)
            if (!editData.level)
                return showToast(toast, 'error', 'Ошибка при добавлении данных', `Пожалуйста, выберите уровень занятия!`, 5000)
            if (!selectedFile)
                return showToast(toast, 'error', 'Ошибка при добавлении изображения', 'Пожалуйста, выберите изображение', 5000)

            if (editData.id) {
                const editClass = new FormData()
                editClass.append('id', editData.id)
                editClass.append('name', editData.name)
                editClass.append('description', editData.description)
                editClass.append('maxParticipant', editData.maxParticipant)
                editClass.append('level', editData.level)
                editClass.append('trainerId', currentTrainer.id)
                if (selectedFile instanceof File)
                    editClass.append('image', selectedFile)

                edit(editClass).then(() => {
                    showToast(toast, "success", "Поздравляем", "Запись успешно изменена!", 3000)
                    getAll().then(({classes}) => {
                        setClasses(classes)
                    })
                    closeModal()
                }).catch((error) => {
                    return showToast(toast, 'error', 'Ошибка при изменении данных', `${error.response.data.message}`, 5000)
                })
            } else {
                const addClass = new FormData()
                addClass.append('name', editData.name)
                addClass.append('description', editData.description)
                addClass.append('maxParticipant', editData.maxParticipant)
                addClass.append('level', editData.level)
                addClass.append('trainerId', currentTrainer.id)
                if (selectedFile instanceof File)
                    addClass.append('image', selectedFile)

                create(addClass).then(() => {
                    showToast(toast, "success", "Поздравляем", "Запись успешно изменена!", 3000)
                    getAll().then(({classes}) => {
                        setClasses(classes)
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

    const deleteClass = (id) => {
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
                        getAll().then(({classes}) => {
                            setClasses(classes)
                        })
                    })
                } catch (error) {
                    return showToast(toast, 'error', 'Ошибка', `${error.response.data.message}`, 5000)
                }
            }
        })
    }

    const deleteClasses = () => {
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
                        getAll(null, null, null).then(({classes}) => {
                            setClasses(classes)
                        })
                    })
                } catch (error) {
                    return showToast(toast, 'error', 'Ошибка', `${error.response.data.message}`, 5000)
                }
            }
        })
    }

    const openScheduleModal = (schedule = null, classId) => {
        const initialTime = schedule?.time
            ? new Date(`1970-01-01T${schedule.time}`)
            : new Date().setHours(9, 0, 0, 0)

        setCurrentSchedule({
            ...(schedule || {}),
            date: schedule?.date ? new Date(schedule.date) : new Date(),
            time: new Date(initialTime),
            duration: schedule?.duration || 60,
            classId: classId
        })
        setScheduleModalVisible(true);
    }

    const closeScheduleModal = () => {
        setScheduleModalVisible(false)
        setCurrentSchedule(null)
        setSelectedClassId(null)
    }

    const saveSchedule = () => {
        try {
            if (!currentSchedule.date)
                return showToast(toast, 'error', 'Ошибка', `Пожалуйста, выберите дату!`, 5000)
            if (!currentSchedule.time)
                return currentSchedule(toast, 'error', 'Ошибка', `Пожалуйста, выберите время!`, 5000)
            if (!currentSchedule.duration)
                return showToast(toast, 'error', 'Ошибка', `Пожалуйста, выберите длительность занятия (в минутах)!`, 5000)
            if (currentSchedule.duration && currentSchedule.duration < 60)
                return showToast(toast, 'error', 'Ошибка', `Минимальная длительность занятия в «BD Dance Studio» 60 минут!`, 5000)

            const localDate = new Date(currentSchedule.date)
            const localTime = new Date(currentSchedule.time)
            const combinedDate = new Date(
                localDate.getFullYear(),
                localDate.getMonth(),
                localDate.getDate(),
                localTime.getHours(),
                localTime.getMinutes()
            )

            const formatDate = (date) => {
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                return `${year}-${month}-${day}`
            }

            const formatTime = (date) => {
                const hours = String(date.getHours()).padStart(2, '0')
                const minutes = String(date.getMinutes()).padStart(2, '0')
                return `${hours}:${minutes}:00`
            }

            if (currentSchedule.id) {
                const editCurrentSchedule = new FormData()
                editCurrentSchedule.append('id', currentSchedule.id)
                editCurrentSchedule.append('date', formatDate(combinedDate))
                editCurrentSchedule.append('time', formatTime(combinedDate))
                editCurrentSchedule.append('duration', currentSchedule.duration)

                editSchedule(editCurrentSchedule).then(() => {
                    showToast(toast, "success", "Внимание", "Расписание успешно сохранено!", 5000)
                    getAll().then(({classes}) => {
                        setClasses(classes)
                    })
                    closeScheduleModal()
                }).catch((error) => {
                    return showToast(toast, 'error', 'Ошибка', `${error.response.data.message}`, 5000)
                })
            } else {
                const createCurrentSchedule = new FormData()
                createCurrentSchedule.append('date', formatDate(combinedDate))
                createCurrentSchedule.append('time', formatTime(combinedDate))
                createCurrentSchedule.append('duration', currentSchedule.duration)
                createCurrentSchedule.append('classId', currentSchedule.classId)

                createSchedule(createCurrentSchedule).then(() => {
                    showToast(toast, "success", "Внимание", "Расписание успешно сохранено!", 5000)
                    getAll().then(({classes}) => {
                        setClasses(classes)
                    })
                    closeScheduleModal()
                }).catch((error) => {
                    return showToast(toast, 'error', 'Ошибка', `${error.response.data.message}`, 5000)
                })
            }
        } catch (error) {
            return showToast(toast, 'error', 'Ошибка', `${error.response.data.message}`, 5000)
        }
    }

    const deleteOneSchedule = (scheduleId) => {
        confirmDialog({
            message: "Вы уверены, что хотите удалить это расписание?",
            header: "Подтверждение",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Да, удалить",
            rejectLabel: "Отмена",
            rejectClassName: "p-button-danger",
            acceptClassName: "p-button-success",
            accept: async () => {
                try {
                    deleteSchedule(scheduleId).then(() => {
                        showToast(toast, "success", "Внимание", "Запись успешно удалена", 3000)
                        getAll().then(({classes}) => {
                            setClasses(classes)
                        })
                    })
                } catch (error) {
                    showToast(toast, 'error', 'Ошибка', error.response?.data?.message || 'Ошибка удаления', 5000)
                }
            }
        })
    }

    const deleteAllSchedule = () => {
        confirmDialog({
            message: "Вы уверены, что хотите удалить все расписания?",
            header: "Подтверждение",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Да, удалить",
            rejectLabel: "Отмена",
            rejectClassName: "p-button-danger",
            acceptClassName: "p-button-success",
            accept: async () => {
                try {
                    deleteSchedules().then(() => {
                        showToast(toast, "success", "Внимание", "Запись успешно удалена", 3000)
                        getAll().then(({classes}) => {
                            setClasses(classes)
                        })
                    })
                } catch (error) {
                    showToast(toast, 'error', 'Ошибка', error.response?.data?.message || 'Ошибка удаления', 5000)
                }
            }
        })
    }

    return (
        <div className="card">
            <Toast ref={toast}/>
            <ConfirmDialog/>

            <DataTable value={classes}
                       expandedRows={expandedRows}
                       onRowToggle={(e) => setExpandedRows(e.data)}
                       rowExpansionTemplate={(rowData) => (
                           <div className="p-3">
                               <div className="flex align-items-center mb-3">
                                   <h3 style={{
                                       marginRight: '2rem'
                                   }}>
                                       Расписание для {rowData.name}
                                   </h3>
                                   <Button label="Добавить расписание"
                                           icon="pi pi-plus"
                                           className="p-button-success"
                                           style={{
                                               marginRight: '2rem'
                                           }}
                                           onClick={() => openScheduleModal(null, rowData.id)}/>
                                   <Button label="Удалить расписания"
                                           icon="pi pi-trash"
                                           className="p-button-danger"
                                           onClick={() => deleteAllSchedule()}/>
                               </div>

                               <DataTable value={rowData.schedules}
                                          emptyMessage="Нет доступных данных">
                                   <Column field="date"
                                           header="Дата"
                                           style={{
                                               maxWidth: '100px',
                                               whiteSpace: 'nowrap',
                                               overflow: 'hidden',
                                               textOverflow: 'ellipsis'
                                           }}
                                           body={(row) => {
                                               const date = new Date(row.date + 'T00:00:00')
                                               return date.toLocaleDateString('ru-RU')
                                           }}
                                   />
                                   <Column field="time"
                                           header="Время"
                                           style={{
                                               maxWidth: '100px',
                                               whiteSpace: 'nowrap',
                                               overflow: 'hidden',
                                               textOverflow: 'ellipsis'
                                           }}
                                           body={row => {
                                               if (!row.time)
                                                   return 'Нет данных'
                                               const [hours, minutes] = row.time.split(':')
                                               return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
                                           }}/>
                                   <Column field="duration"
                                           style={{
                                               maxWidth: '100px',
                                               whiteSpace: 'nowrap',
                                               overflow: 'hidden',
                                               textOverflow: 'ellipsis'
                                           }}
                                           header="Длительность (мин)"/>
                                   <Column header="Действия"
                                           style={{
                                               maxWidth: '100px',
                                               whiteSpace: 'nowrap',
                                               overflow: 'hidden',
                                               textOverflow: 'ellipsis'
                                           }}
                                           body={(schedule) => (
                                               <div className="flex">
                                                   <Button icon="pi pi-pencil"
                                                           className="p-button-rounded p-button-warning mr-2"
                                                           onClick={() => openScheduleModal(schedule, rowData.id)}/>
                                                   <Button icon="pi pi-trash"
                                                           className="p-button-rounded p-button-danger"
                                                           onClick={() => deleteOneSchedule(schedule.id)}/>
                                               </div>
                                           )}/>
                               </DataTable>
                           </div>
                       )}
                       tableStyle={{minWidth: '100vw'}}
                       paginator
                       rows={5}
                       selection={selectedClasses}
                       onSelectionChange={(e) => setSelectedClasses(e.value)}
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
                                       onClick={deleteClasses}/>
                               <InputText placeholder="Поиск по имени"
                                          onInput={(e) => setGlobalFilter(e.target.value)}/>
                           </div>
                       }
                       sortField="id"
                       sortOrder={1}
                       emptyMessage="Нет доступных данных">
                <Column expander style={{width: '5%'}}/>
                <Column field="id"
                        header="ID"
                        style={{
                            maxWidth: '50px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        sortable/>
                <Column field="name"
                        header="Название"
                        style={{
                            maxWidth: '50px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}/>
                <Column field="maxParticipant"
                        header="Количество участников"
                        style={{
                            maxWidth: '50px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}/>
                <Column field="level"
                        header="Уровень"
                        body={(rowData) => {
                            const levels = {
                                Elementary: 'Начальный',
                                Intermediate: 'Средний',
                                UpperIntermediate: 'Продвинутый'
                            };
                            return levels[rowData.level] || rowData.level;
                        }}
                        style={{
                            maxWidth: '50px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}/>
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
                            <div className="p-d-flex">
                                <Button icon="pi pi-pencil"
                                        className="p-button-rounded p-button-warning p-mr-2"
                                        onClick={() => openModal(rowData)}/>
                                <Button icon="pi pi-trash"
                                        className="p-button-rounded p-button-danger"
                                        onClick={() => deleteClass(rowData.id)}/>
                            </div>
                        )}
                />
            </DataTable>

            <Dialog header={currentSchedule?.id ? "Редактирование расписания" : "Новое расписание"}
                    visible={scheduleModalVisible}
                    style={{width: '500px'}}
                    onHide={closeScheduleModal}>
                <div className="p-fluid grid">
                    <div className="field col-12">
                        <label>Дата</label>
                        <Calendar value={currentSchedule?.date}
                                  onChange={(e) => {
                                      const offset = e.value.getTimezoneOffset() * 60000
                                      const localDate = new Date(e.value.getTime() - offset)
                                      setCurrentSchedule(prev => ({...prev, date: localDate}))
                                  }}
                                  dateFormat="dd.mm.yy"
                                  showIcon/>
                    </div>

                    <div className="field col-12">
                        <label>Время начала</label>
                        <Calendar value={currentSchedule?.time}
                                  onChange={(e) => setCurrentSchedule(prev => ({...prev, time: e.value}))}
                                  timeOnly
                                  hourFormat="24"
                                  showTime
                                  hideOnDateTimeSelect/>
                    </div>

                    <div className="field col-12">
                        <label>Длительность (минут)</label>
                        <InputNumber value={currentSchedule?.duration}
                                     onValueChange={(e) => setCurrentSchedule({...currentSchedule, duration: e.value})}
                                     min={1}/>
                    </div>

                    <div className="field col-12 flex justify-content-end gap-2 mt-3">
                        <Button label="Отмена"
                                className="p-button-secondary"
                                onClick={closeScheduleModal}/>
                        <Button label="Сохранить"
                                className="p-button-success"
                                onClick={saveSchedule}/>
                    </div>
                </div>
            </Dialog>

            <Dialog header={editData?.id ? "Редактирование занятия" : "Добавление занятия"}
                    visible={modalVisible}
                    onHide={closeModal}
                    modal>
                <div className="p-fluid">
                    <InputText value={editData?.name || ""}
                               onChange={(e) => setEditData({
                                   ...editData,
                                   name: e.target.value
                               })}
                               placeholder="Название занятия"/>

                    <InputTextarea value={editData?.description || ""}
                                   rows={5}
                                   cols={30}
                                   autoResize
                                   onChange={(e) => setEditData({
                                       ...editData,
                                       description: e.target.value
                                   })}
                                   placeholder="Описание"/>

                    <InputNumber value={editData?.maxParticipant || null}
                                 onValueChange={(e) => setEditData({
                                     ...editData,
                                     maxParticipant: e.value
                                 })}
                                 mode="decimal"
                                 min={0}
                                 placeholder="Количество участников"/>

                    <Dropdown value={editData?.level || ""}
                              options={[
                                  {label: 'Начальный', value: 'Elementary'},
                                  {label: 'Средний', value: 'Intermediate'},
                                  {label: 'Продвинутый', value: 'UpperIntermediate'}
                              ]}
                              onChange={(e) => setEditData({
                                  ...editData,
                                  level: e.value
                              })}
                              placeholder="Выберите уровень"/>

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

export default Classes;