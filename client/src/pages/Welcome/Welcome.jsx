import styles from "./Welcome.module.scss";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate("/login");
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <h1>Хотите достигнуть финансовой цели, но не знаете, как?</h1>
                <p>
                    Вы пришли по правильному адресу. Наш финансовый помощник
                    "Подберушка" поможет вам составить подходящую для вас
                    подборку ценных бумаг на бирже.
                </p>
                <button className={styles.button} onClick={handleStart}>Начать</button>
            </div>
        </>
    );
};

export default Welcome;