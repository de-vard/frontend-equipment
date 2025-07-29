import axios from "axios";
import { useNavigate } from "react-router-dom";

/*
 * Кастомный хук для управления действиями пользователя
 * (аутентификация, регистрация, выход, редактирование профиля)
*/
function useUserActions() {

  const navigate = useNavigate();  // Хук для навигации между страницами
  const baseURL = "http://localhost:8000/api/v1"; // Базовый URL API (в реальном проекте лучше выносить в конфигурацию)

  //  Функция входа пользователя
  function login(data) {
    // Отправляем POST-запрос на сервер для аутентификации
    return axios.post(`${baseURL}/auth/login/`, data)
      .then((res) => {
        // При успешном ответе:
        setUserData(res.data); // 1. Сохраняем данные пользователя в localStorage
        navigate("/");        // 2. Перенаправляем на главную страницу
      });
    // Примечание: здесь можно добавить .catch() для обработки ошибок
  }


  //  Функция выхода пользователя
  function logout() {
    // 1. Удаляем данные аутентификации из localStorage
    localStorage.removeItem("auth");
    // 2. Перенаправляем пользователя на страницу входа
    navigate("/login");
  }


  return {login,logout,}
  };



  function getAccessToken()
  // * Возвращает access-токен из localStorage.
  //  * Используется для авторизованных запросов к API.
  //  * @returns {string | undefined} Access-токен или undefined, если данных нет.
  {
    const auth = JSON.parse(localStorage.getItem("auth")); // Получаем и парсим данные из localStorage
    return auth.access; // Возвращаем access-токен (если auth существует)
  }

  function getRefreshToken()
  //  * Возвращает refresh-токен из localStorage.
  //  * Используется для обновления access-токена, когда он истёк.
  //  * @returns {string | undefined} Refresh-токен или undefined, если данных нет.
  {
    const auth = JSON.parse(localStorage.getItem("auth")); // Получаем и парсим данные из localStorage
    return auth.refresh; // Возвращаем refresh-токен (если auth существует)
  }

  function getUser()
  //  * Возвращает данные пользователя из localStorage.
  //  * @returns {object | null} Объект пользователя или null, если данных нет.
  {
    const auth = JSON.parse(localStorage.getItem("auth")) || null; // Получаем auth или null, если его нет
    if (auth) {
      return auth.user;
    } else {
      return null;
    }
  }


//Эта функция сохраняет данные аутентификации пользователя в localStorage браузера
function setUserData(data) {
   // Сохраняем данные в localStorage под ключом "auth"
  localStorage.setItem(
    "auth",
    JSON.stringify({access: data.access,refresh: data.refresh,user: data.user,}) // Преобразуем объект в JSON-строку, так как localStorage может хранить только строковые значения
  );
}

  
export {
  useUserActions,
  getUser,
  getAccessToken,
  getRefreshToken,
  setUserData,
};