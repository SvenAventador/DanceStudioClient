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
import {showToast} from "../../utils/utils.jsx"

const Specialization = () => {
    const [specializations, setSpecializations] = React.useState([])
    const [selectedSpecializations, setSelectedSpecializations] = React.useState([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [modalVisible, setModalVisible] = React.useState(false)
    const [editData, setEditData] = React.useState(null)
    const toast = React.useRef(null)

    React.useEffect(() => {
        getAll().then(({specializations}) => {
            setSpecializations(specializations)
        })
    }, [])

    const openModal = (data = null) => {
        setEditData(data || {name: ""})
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
        setEditData(null)
    }

    const saveData = () => {
        if (!editData?.name)
            return showToast(toast, "error", "Ошибка", "Пожалуйста, введите название направления!", 5000)

        try {
            if (editData.id) {
                edit(editData.id, editData.name).then(() => {
                    showToast(toast, "success", "Поздравляем", "Запись успешно изменена!", 3000)
                    getAll().then(({specializations}) => {
                        setSpecializations(specializations)
                        closeModal()
                    })
                }).catch((error) => {
                    return showToast(toast, 'error', 'Ошибка при изменении данных', `${error.response.data.message}`, 5000)
                })
            } else {
                create(editData.name).then(() => {
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
                        sortable/>
                <Column field="name"
                        header="Название"/>
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