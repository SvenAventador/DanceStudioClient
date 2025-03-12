import {Divider} from "primereact/divider";
import React from "react";

export const MAIN_PATH = '/'
export const LOGIN_PATH = '/login'
export const REGISTRATION_PATH = '/registration'
export const ADMIN_PATH = '/admin'

export const showToast = (toast, severity, summary, detail, life) => {
    toast.current.show({
        severity: severity,
        summary: summary,
        detail: detail,
        life: life
    })
}

export const footer = (
    <>
        <Divider/>
        <p className="mt-2">Подсказка</p>
        <ul className="pl-2 ml-2 mt-0 line-height-3">
            <li>Необходима минимум одна строчная буква.</li>
            <li>Требуется минимум одна заглавная буква.</li>
            <li>Требуется хотя бы одна цифра.</li>
            <li>Требуется минимум один специальный символ из набора @$!%*?&.</li>
            <li>Минимальная длина пароля 9 символов.</li>
        </ul>
    </>
)