import React from 'react'

import {
    getAll,
    create,
    edit,
    deleteAll,
    deleteOne
} from "../../http/subscription.js"

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
import {InputTextarea} from "primereact/inputtextarea"
import {InputNumber} from "primereact/inputnumber"

const Subscription = () => {
    const [subscriptions, setSubscription] = React.useState([])
    const [selectedSubscriptions, setSelectedSubscriptions] = React.useState([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [modalVisible, setModalVisible] = React.useState(false)
    const [editData, setEditData] = React.useState(null)
    const toast = React.useRef(null)

    React.useEffect(() => {
        getAll().then(({subscription}) => {
            setSubscription(subscription)
        })
    }, [])

    const openModal = (data = null) => {
        setEditData(data || {
            name: "",
            description: "",
            price: "",
            classCount: 0
        })
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
        setEditData(null)
    }

    const saveData = () => {
        if (!editData?.name)
            return showToast(toast, "error", "Ошибка", "Пожалуйста, введите название абонемента!", 5000)

        if (!editData?.description)
            return showToast(toast, "error", "Ошибка", "Пожалуйста, введите описание абонемента!", 5000)

        if (!editData?.price)
            return showToast(toast, "error", "Ошибка", "Пожалуйста, введите цену абонемента!", 5000)

        if (!editData?.classCount)
            return showToast(toast, "error", "Ошибка", "Пожалуйста, введите количество занятий абонемента!", 5000)

        try {
            const subscription = new FormData()
            subscription.append("name", editData.name)
            subscription.append("description", editData.description)
            subscription.append("price", editData.price)
            subscription.append("classCount", editData.classCount)

            if (editData?.id) {
                subscription.append("id", editData.id)
                edit(subscription).then(() => {
                    showToast(toast, "success", "Поздравляем", "Запись успешно изменена!", 3000)
                    getAll().then(({subscription}) => {
                        setSubscription(subscription)
                        closeModal()
                    })
                }).catch((error) => {
                    return showToast(toast, 'error', 'Ошибка при изменении данных', `${error.response.data.message}`, 5000)
                })
            } else {
                create(subscription).then(() => {
                    showToast(toast, "success", "Поздравляем", "Запись успешно добавлена!", 3000)
                    getAll().then(({subscription}) => {
                        setSubscription(subscription)
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

    const deleteSubscription = (id) => {
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
                        getAll().then(({subscription}) => {
                            setSubscription(subscription)
                        })
                    })
                } catch (error) {
                    return showToast(toast, 'error', 'Ошибка', `${error.response.data.message}`, 5000)
                }
            }
        })
    }

    const deleteAllSubscription = () => {
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
                        getAll().then(({subscription}) => {
                            setSubscription(subscription)
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

            <DataTable value={subscriptions}
                       tableStyle={{minWidth: '100vw'}}
                       paginator
                       rows={5}
                       selection={selectedSubscriptions}
                       onSelectionChange={(e) => setSelectedSubscriptions(e.value)}
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
                                       onClick={deleteAllSubscription}/>
                               <InputText placeholder="Поиск данных"
                                          onInput={(e) => setGlobalFilter(e.target.value)}/>
                           </div>
                       }
                       sortField="id"
                       sortOrder={1}
                       emptyMessage="Нет доступных данных">
                <Column field="id"
                        style={{
                            maxWidth: '50px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        header="ID"
                        sortable/>
                <Column field="name"
                        style={{
                            maxWidth: '50px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        header="Название"/>
                <Column field="description"
                        style={{
                            maxWidth: '50px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        header="Описание"/>
                <Column field="price"
                        body={(rowData) => new Intl.NumberFormat('ru-RU', {
                            style: 'currency', currency: 'RUB'
                        }).format(rowData.price)}
                        style={{
                            maxWidth: '50px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        header="Цена"/>
                <Column field="classCount"
                        style={{
                            maxWidth: '50px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        header="Количество занятий"/>
                <Column header="Действия"
                        body={(rowData) => (
                            <div className="p-d-flex">
                                <Button icon="pi pi-pencil"
                                        className="p-button-rounded p-button-warning p-mr-2"
                                        onClick={() => openModal(rowData)}/>
                                <Button icon="pi pi-trash"
                                        className="p-button-rounded p-button-danger"
                                        onClick={() => deleteSubscription(rowData.id)}/>
                            </div>
                        )}
                />
            </DataTable>

            <Dialog header={editData?.id ? "Редактирование абонемента" : "Добавление абонемента"}
                    visible={modalVisible}
                    onHide={closeModal}
                    modal>
                <div className="p-fluid">
                    <InputText value={editData?.name || ""}
                               onChange={(e) => setEditData({
                                   ...editData,
                                   name: e.target.value
                               })}
                               placeholder="Название абонемента"/>

                    <InputTextarea value={editData?.description || ""}
                                   rows={5}
                                   cols={30}
                                   autoResize
                                   onChange={(e) => setEditData({
                                       ...editData,
                                       description: e.target.value
                                   })}
                                   placeholder="Описание абонемента"/>

                    <InputNumber value={editData?.price || ""}
                                 mode="currency"
                                 currency="RUB"
                                 locale="ru-RU"
                                 onChange={(e) => setEditData({
                                     ...editData,
                                     price: e.value
                                 })}
                                 placeholder="Цена"/>

                    <InputText value={editData?.classCount || ""}
                               onChange={(e) => setEditData({
                                   ...editData,
                                   classCount: e.target.value
                               })}
                               placeholder="Количество занятий"/>

                    <Button label="Сохранить"
                            className="p-button-success"
                            onClick={saveData}/>
                </div>
            </Dialog>

        </div>
    );
};

export default Subscription;