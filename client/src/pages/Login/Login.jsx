import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import styles from "./Login.module.scss";
import Header from "../../components/Header/Header";

const Login = ({ setAuth }) => {
    const [formData, setFormData] = useState({ login: "", password: "", phone: "" });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const navigate = useNavigate();

    const validate = () => {
        let newErrors = {};
        if (!formData.login.trim()) newErrors.login = "Логин обязателен";
        if (!formData.password.trim()) newErrors.password = "Пароль обязателен";
        if (!formData.phone.trim()) newErrors.phone = "Телефон обязателен";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
        setServerError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validate()) return;

        try {
            const response = await axios.post("/api/users/login", formData, {
                headers: { "Content-Type": "application/json" }
            });

            localStorage.setItem("user", JSON.stringify({ login: response.data.login }));
            localStorage.setItem("token", response.data.token);

            setAuth(true);
            navigate("/home");
        } catch (error) {
            setServerError(error.response?.data?.error || "Ошибка сервера, попробуйте позже.");
        }
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <h1>Рады видеть вас снова!</h1>
                {serverError && <p className={styles.error}>{serverError}</p>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <input type="text" name="login" placeholder="Логин" value={formData.login} onChange={handleChange} />
                    {errors.login && <p className={styles.error}>{errors.login}</p>}

                    <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} />
                    {errors.password && <p className={styles.error}>{errors.password}</p>}

                    <input type="text" name="phone" placeholder="Номер телефона" value={formData.phone} onChange={handleChange} />
                    {errors.phone && <p className={styles.error}>{errors.phone}</p>}

                    <button type="submit" disabled={!formData.login || !formData.password || !formData.phone}>Войти</button>
                </form>

                <p>
                    Вас нет в системе? <Link to="/register">Зарегистрироваться</Link>
                </p>
            </div>
        </>
    );
};

Login.propTypes = {
    setAuth: PropTypes.func.isRequired,
};

export default Login;
