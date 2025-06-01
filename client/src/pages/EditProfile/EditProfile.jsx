import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";
import HeaderButtons from "../../components/HeaderButtons/HeaderButtons";
import "./EditProfile.scss";

const EditProfile = () => {
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        birthdate: "",
        password: "",
        confirmPassword: ""
    });

    const [currentData, setCurrentData] = useState({
        email: "",
        phone: "",
        birthdate: ""
    });

    const [isFormValid, setIsFormValid] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.login) return;

            try {
                const response = await axios.get(`/api/users/${user.login}`);
                const { email, phone, birthdate } = response.data;
                setCurrentData({ email, phone, birthdate });
            } catch (error) {
                console.error("Ошибка получения данных пользователя:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedForm = { ...formData, [name]: value };

        setFormData(updatedForm);

        // Проверка: есть ли хоть одно непустое поле
        const anyFieldFilled = Object.entries(updatedForm).some(([key, val]) => 
            key !== "confirmPassword" && val.trim() !== ""
        );
        setIsFormValid(anyFieldFilled);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        // Проверка совпадения паролей, если они вводятся
        if (formData.password || formData.confirmPassword) {
            if (formData.password !== formData.confirmPassword) {
                setErrorMessage("Пароли не совпадают.");
                return;
            }
            if (formData.password.length < 6) {
                setErrorMessage("Пароль должен быть не короче 6 символов.");
                return;
            }
        }

        try {
            const updatedData = {
                login: JSON.parse(localStorage.getItem("user"))?.login,
                email: formData.email,
                phone: formData.phone,
                birthdate: formData.birthdate,
                password: formData.password || undefined  // не передаём пустую строку
            };

            await axios.put("/api/users/update", updatedData, {
                headers: { "Content-Type": "application/json" }
            });

            setSuccessMessage("Профиль успешно обновлён!");
            setFormData(prev => ({
                ...prev,
                password: "",
                confirmPassword: ""
            }));
        } catch (error) {
            console.error("Ошибка обновления данных:", error);
            setErrorMessage("Не удалось обновить данные. Попробуйте позже.");
        }
    };

    const handleDeleteProfile = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.login) return;

            await axios.delete(`/api/users/delete`, {
                data: { login: user.login },
                headers: { "Content-Type": "application/json" }
            });

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        } catch (error) {
            console.error("Ошибка удаления профиля:", error.response?.data || error.message);
        }
    };

    return (
        <>
            <Header />
            <HeaderButtons />
            <div className="registerContainer">
                <h2>Редактирование профиля</h2>

                {successMessage && <p className="success-msg">{successMessage}</p>}
                {errorMessage && <p className="error-msg">{errorMessage}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            placeholder={currentData.email || "Введите email"}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Телефон</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            placeholder={currentData.phone || "Введите телефон"}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Дата рождения</label>
                        <input
                            type="date"
                            name="birthdate"
                            value={formData.birthdate}
                            placeholder={currentData.birthdate || "Дата рождения"}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Новый пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            placeholder="Введите новый пароль"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Повторите новый пароль</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            placeholder="Повторите новый пароль"
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" disabled={!isFormValid} className="save-btn">
                        Сохранить изменения
                    </button>
                    <button type="button" className="delete-btn" onClick={handleDeleteProfile}>
                        Удалить профиль
                    </button>
                </form>
            </div>
        </>
    );
};

export default EditProfile;