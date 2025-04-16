import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";
import HeaderButtons from "../../components/HeaderButtons/HeaderButtons";
import "./EditProfile.scss"

const EditProfile = () => {
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        birthdate: "",
        password: ""
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setIsFormValid(Object.values({ ...formData, [name]: value }).some(val => val));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const updatedData = {
                login: JSON.parse(localStorage.getItem("user"))?.login,
                birthdate: formData.birthdate
            };
    
            console.log("Отправляемые данные:", updatedData);
    
            const response = await axios.put("/api/users/update", updatedData, {
                headers: { "Content-Type": "application/json" }
            });
    
            console.log("Данные успешно обновлены:", response.data);
        } catch (error) {
            console.error("Ошибка обновления данных:", error);
        }
    };

    const handleDeleteProfile = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.login) {
                console.error("Логин отсутствует");
                return;
            }
    
            const response = await axios.delete(`/api/users/delete`, {
                data: { login: user.login },
                headers: { "Content-Type": "application/json" }
            });
    
            console.log("Профиль успешно удалён:", response.data);
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
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Телефон</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Дата рождения</label>
                    <input
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Новый пароль</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
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
