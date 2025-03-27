import React from 'react'

import {
    getAll,
    create,
    edit,
    deleteAll,
    deleteOne
} from "../../http/specialization.js"

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
import {itemTemplate, showToast} from "../../utils/utils.jsx"
import {Image} from "primereact/image";
import {FileUpload} from "primereact/fileupload";

const Specialization = () => {
    const [specializations, setSpecializations] = React.useState([])
    const [selectedSpecializations, setSelectedSpecializations] = React.useState([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [modalVisible, setModalVisible] = React.useState(false)
    const [editData, setEditData] = React.useState(null)

    const toast = React.useRef(null)
    const fileUploadRef = React.useRef(null)

    React.useEffect(() => {
        getAll().then(({specializations}) => {
            setSpecializations(specializations)
        })
    }, [])

    const [selectedFile, setSelectedFile] = React.useState(null)
    const [, setImagePreview] = React.useState(null)

    const openModal = (data = null) => {
        setEditData(data || {
            name: "",
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
        if (!editData?.name)
            return showToast(toast, "error", "Ошибка", "Пожалуйста, введите название направления!", 5000)
        if (!selectedFile)
            return showToast(toast, 'error', 'Ошибка при добавлении изображения', 'Пожалуйста, выберите изображение', 5000)

        try {
            if (editData.id) {
                const editSpecialization = new FormData()
                editSpecialization.append('id', editData.id)
                editSpecialization.append("name", editData.name)
                if (selectedFile instanceof File)
                    editSpecialization.append('image', selectedFile)

                edit(editSpecialization).then(() => {
                    showToast(toast, "success", "Поздравляем", "Запись успешно изменена!", 3000)
                    getAll().then(({specializations}) => {
                        setSpecializations(specializations)
                        closeModal()
                    })
                }).catch((error) => {
                    return showToast(toast, 'error', 'Ошибка при изменении данных', `${error.response.data.message}`, 5000)
                })
            } else {
                const addSpecialization = new FormData()
                addSpecialization.append('name', editData.name)
                if (selectedFile instanceof File)
                    addSpecialization.append('image', selectedFile)

                create(addSpecialization).then(() => {
                    showToast(toast, "success", "Поздравляем", "Запись успешно добавлена!", 3000)
                    getAll().then(({specializations}) => {
                        setSpecializations(specializations)
                        closeModal()
                    })
                }).catch((error) => {
                    return showToast(toast, 'error', 'Ошибка при добавлении данных', `${error.response.data.message}`, 5000)
                })
            }
        } catch (error) {
            return showToast(toast, 'error', 'Ошибка', `${error.response.data.message}`, 5000)
        }
    }

    const deleteSpecialization = (id) => {
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
                        showToast(toast, "success", "Удалено", "Запись успешно удалена", 3000)
                        getAll().then(({specializations}) => {
                            setSpecializations(specializations)
                        })
                    })
                } catch (error) {
                    return showToast(toast, 'error', 'Ошибка', `${error.response.data.message}`, 5000)
                }
            }
        })
    }

    const deleteAllSpecializations = () => {
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
                        getAll().then(({specializations}) => {
                            setSpecializations(specializations)
                        })
                    })
                } catch (error) {
                    return showToast(toast, 'error', 'Ошибка', `${error.response.data.message}`, 5000)
                }
            }
        })
    }

    return (
        <div className="card">
            <Toast ref={toast}/>
            <ConfirmDialog/>

            <DataTable value={specializations}
                       tableStyle={{minWidth: '100vw'}}
                       paginator
                       rows={5}
                       selection={selectedSpecializations}
                       onSelectionChange={(e) => setSelectedSpecializations(e.value)}
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
                                       onClick={deleteAllSpecializations}/>
                               <InputText placeholder="Поиск по имени"
                                          onInput={(e) => setGlobalFilter(e.target.value)}/>
                           </div>
                       }
                       sortField="id"
                       sortOrder={1}
                       emptyMessage="Нет доступных данных">
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
                                        onClick={() => deleteSpecialization(rowData.id)}/>
                            </div>
                        )}
                />
            </DataTable>

            <Dialog header={editData?.id ? "Редактирование направления" : "Добавление направления"}
                    visible={modalVisible}
                    onHide={closeModal}
                    modal
                    style={{
                        width: "400px",
                        borderRadius: "12px"
                    }}
                    className="custom-modal">
                <div className="p-fluid">
                    <div className="p-field">
                        <label className="p-text-bold">Название</label>
                        <InputText value={editData?.name || ""}
                                   onChange={(e) => setEditData({...editData, name: e.target.value})}
                                   className="p-inputtext-lg"/>
                    </div>

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

                    <div className="p-d-flex p-jc-end p-mt-4">
                        <Button label="Отмена"
                                icon="pi pi-times"
                                className="p-button-text p-mr-2"
                                onClick={closeModal}
                        />
                        <Button label="Сохранить"
                                icon="pi pi-check"
                                className="p-button-success p-button-rounded"
                                onClick={saveData}
                        />
                    </div>
                </div>
            </Dialog>

        </div>
    );
};

export default Specialization;