import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

import { getAccessToken, getUser, getRefreshToken } from "../hooks/user.actions";

const axiosService = axios.create(
    // Создание экземпляра Axios
    {
        baseURL: "http://localhost:8000/api/v1/", // Базовый URL для всех запросов
        headers: { 
            "Content-Type": "application/json", // Тип данных по умолчанию
        }, 
    }
);


axiosService.interceptors.request.use(
    //  Перехватчик запросов (Interceptor)
    async (config) => {
        config.headers.Authorization = `Bearer ${getAccessToken()}`; // Добавляем токен в заголовок
        return config; // Возвращаем изменённую конфигурацию
    }
);

// Нужен только как заготовка, если в будущем потребуется обрабатывать все ответы сервера (например, для логирования).
axiosService.interceptors.response.use(
    // Пустой интерцептор ответов
    (res) => Promise.resolve(res), // Если ответ успешный — просто передаём его дальше
    (err) => Promise.reject(err) // Если ошибка — пробрасываем её без изменений
);

const refreshAuthLogic = async (failedRequest) => {
    // реализует механизм автоматического обновления JWT-токена, 
    // когда accessToken (основной токен доступа) становится 
    // недействительным (например, истекает его срок).

    return axios

        // Отправляет refreshToken на сервер для получения нового accessToken
        .post(
            "/auth/refresh/", // Эндпоинт для обновления токена
            { refresh: getRefreshToken(), }, // Отправляем refresh-токен
            { baseURL: "http://localhost:8000/api/v1", }  // Базовый URL для этого запроса
        )

        // Обновляет accessToken  в Заголовке исходного запроса (который провалился из-за просроченного токена) и Локальном хранилище (localStorage)
        .then((resp) => {
                // 1. Получаем новый access-токен из ответа
                const { access } = resp.data; 

                // 2. Обновляем заголовок Authorization в проваленном запросе
                failedRequest.response.config.headers["Authorization"] = "Bearer " + access;

                // 3. Сохраняем новый токен в localStorage
                localStorage.setItem(
                    "auth", 
                    JSON.stringify(
                        { 
                            access, // Новый access-токен
                            refresh: getRefreshToken(), // Старый refresh-токен (он не меняется)
                            user: getUser() // Данные пользователя
                        }
                    )
                );
            }
        )

        // Удаляет данные авторизации при неудаче (например, если refreshToken тоже недействителен).
        .catch(() => {
            localStorage.removeItem("auth");// Если обновление токена не удалось — удаляем данные авторизации
        });
};

// Подключение интерцептора
createAuthRefreshInterceptor(axiosService, refreshAuthLogic); //настраивает автоматический вызов refreshAuthLogic при ошибке 401

export default axiosService;
