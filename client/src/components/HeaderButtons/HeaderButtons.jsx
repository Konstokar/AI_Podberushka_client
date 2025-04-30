import styles from "../HeaderButtons/HeaderButtons.module.scss";
import { Link, useNavigate } from "react-router-dom";
import profileIcon from "../../assets/profile.png";
import homeIcon from "../../assets/home.png";
import logoutIcon from "../../assets/exit.png";
import helpIcon from "../../assets/help.png"

const HeaderButtons = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            localStorage.removeItem("token");
            navigate("/");
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        }
    };

    return (
        <div className={styles.headerButtons}>
            <Link to="/editProfile">
                <img src={profileIcon} alt="Профиль" className={styles.icon} />
            </Link>
            <Link to="/home">
                <img src={homeIcon} alt="Главная" className={styles.icon} />
            </Link>
            <Link to="/help">
                <img src={helpIcon} alt="Справочная информация" className={styles.icon} />
            </Link>
            <button onClick={handleLogout} className={styles.logoutButton}>
                <img src={logoutIcon} alt="Выход" className={styles.icon} />
            </button>
        </div>
    );
};

export default HeaderButtons;
