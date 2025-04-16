import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import styles from "./Register.module.scss";
import Header from "../../components/Header/Header";


const Register = ({ setAuth }) => {
    const [formData, setFormData] = useState({
        login: "",
        email: "",
        birthdate: "",
        password: "",
        confirmPassword: "",
        phone: "",
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const validate = () => {
        let newErrors = {};
        if (!formData.login.trim()) newErrors.login = "Логин обязателен";
        if (!formData.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) newErrors.email = "Некорректный email";
        if (!formData.phone.trim() || !/^\+7\d{10}$/.test(formData.phone)) newErrors.phone = "Телефон должен быть в формате +7XXXXXXXXXX";
        if (!formData.password.trim() || formData.password.length < 6) newErrors.password = "Пароль должен быть минимум 6 символов";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Пароли не совпадают";
        if (!formData.birthdate.trim()) newErrors.birthdate = "Дата рождения обязательна";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        setSuccessMessage("");

        if (!validate()) return;

        try {
            const response = await axios.post("/api/users/register", formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            localStorage.setItem("user", JSON.stringify({ login: formData.login }));
            localStorage.setItem("token", response.data.token);

            setAuth(true);
            setSuccessMessage("Регистрация прошла успешно!");
            setTimeout(() => navigate("/home"), 2000);
        } catch (error) {
            setServerError(error.response?.data?.error || "Ошибка сервера, попробуйте позже.");
        }
    };

    return (
        <>
            <Header></Header>
            <div className={styles.registerContainer}>
                
                <h2>Добро пожаловать!</h2>
                {successMessage && <p className={styles.success}>{successMessage}</p>}
                {serverError && <p className={styles.error}>{serverError}</p>}

                <form onSubmit={handleSubmit}>
                    <input type="text" name="login" placeholder="Логин" value={formData.login} onChange={handleChange} />
                    {errors.login && <p className={styles.error}>{errors.login}</p>}

                    <input type="email" name="email" placeholder="Почта" value={formData.email} onChange={handleChange} />
                    {errors.email && <p className={styles.error}>{errors.email}</p>}

                    <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
                    {errors.birthdate && <p className={styles.error}>{errors.birthdate}</p>}

                    <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} />
                    {errors.password && <p className={styles.error}>{errors.password}</p>}

                    <input type="password" name="confirmPassword" placeholder="Повторите пароль" value={formData.confirmPassword} onChange={handleChange} />
                    {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}

                    <input type="text" name="phone" placeholder="Номер телефона" value={formData.phone} onChange={handleChange} />
                    {errors.phone && <p className={styles.error}>{errors.phone}</p>}

                    <button type="submit">Зарегистрироваться</button>
                </form>

                <p className={styles.loginText}>Уже есть в системе? <span className={styles.loginLink} onClick={() => navigate("/login")}>Войти</span></p>
            </div>
        </>
    );
};

Register.propTypes = {
    setAuth: PropTypes.func.isRequired,
};

export default Register;