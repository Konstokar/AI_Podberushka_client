import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import HeaderButtons from "../../components/HeaderButtons/HeaderButtons";
import axios from "axios";

const CollectionDraft = () => {
    const [data, setData] = useState({ Stocks: [], Bonds: [] });
    const [collectionName, setCollectionName] = useState("");
    const [financialGoal, setFinancialGoal] = useState("");
    const [deadline, setDeadline] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const login = JSON.parse(localStorage.getItem("user"))?.login;
                if (!login) {
                    console.error("Логин пользователя не найден в localStorage");
                    return;
                }
        
                const response = await axios.get(`/api/collections/draft/${login}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Данные с сервера:", response.data);
                setData({
                    expected_return: response.data.expected_return,
                    risk_category: response.data.risk_category,
                    Stocks: response.data.Stocks || [],
                    Bonds: response.data.Bonds || []
                });
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [token, navigate]);

    const handleRestart = async () => {
        try {
            const login = JSON.parse(localStorage.getItem("user"))?.login;
            if (!login) {
                console.error("Логин пользователя не найден в localStorage");
                return;
            }
    
            await axios.post("/api/ml/reset", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            await axios.delete(`/api/collections/draft/${login}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            localStorage.removeItem("user_answers");
            navigate("/question");
        } catch (error) {
            console.error("Ошибка при сбросе данных:", error);
        }
    };

    const handleSave = async () => {
        if (!collectionName || !financialGoal || !deadline) {
            alert("Введите название, цель и срок её достижения для подборки");
            return;
        }
    
        const requestData = {
            user_login: JSON.parse(localStorage.getItem("user"))?.login,
            name: collectionName,
            goal: financialGoal,
            deadline: deadline,
            expected_return: data.expected_return,
            risk_category: data.risk_category,
            stocks: data.Stocks,
            bonds: data.Bonds
        };
    
        try {
            await axios.post("/api/collections/save", requestData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate("/home");
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
        }
    };

    if (isLoading) {
        return <p>Загрузка данных...</p>;
    }

    return (
        <div className="collection-container">
            <Header />
            <HeaderButtons />
            <h2>Подтверждение новой подборки</h2>
            <label>Имя подборки:</label>
            <input
                type="text"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder="Введите имя"
            />
            <label>Финансовая цель: </label>
            <select value={financialGoal} onChange={(e) => setFinancialGoal(e.target.value)}>
                <option value="">Не выбрано</option>
                <option value="Независимость">Независимость</option>
                <option value="Путешествие">Путешествие</option>
                <option value="Долги">Долги</option>
                <option value="Пенсия">Пенсия</option>
                <option value="Бизнес">Бизнес</option>
                <option value="Материальное">Материальное</option>
                <option value="Недвижимость">Недвижимость</option>
                <option value="Транспорт">Транспорт</option>
                <option value="Здоровье">Здоровье</option>
                <option value="Событие">Событие</option>
            </select>
            <br /><br /><br />
            <label>Срок достижения: </label>
            <select value={deadline} onChange={(e) => setDeadline(e.target.value)}>
                <option value="">Не выбрано</option>
                <option value="1 месяц">1 месяц</option>
                <option value="3 месяца">3 месяца</option>
                <option value="6 месяцев">6 месяцев</option>
                <option value="1 год">1 год</option>
                <option value="1.5 года">1.5 года</option>
                <option value="2 года">2 года</option>
                <option value="Более 2-х лет">Более 2-х лет</option>
            </select>
            <h3>Акции</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Тикер</th>
                        <th>Стоимость</th>
                        <th>Наличие дивидендов</th>
                        <th>Размер дивиденда</th>
                        <th>Частота выплат (в год)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.Stocks.map((stock) => (
                        <tr key={stock.ticker}>
                            <td>{stock.name}</td>
                            <td>{stock.ticker}</td>
                            <td>{stock.price} ₽</td>
                            <td>{stock.dividends ? "Да" : "Нет"}</td>
                            <td>{stock.dividends ? stock.dividend_size : "-"}</td>
                            <td>{stock.dividends ? stock.dividend_frequency : "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Облигации</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Тикер</th>
                        <th>Стоимость</th>
                        <th>Размер купона</th>
                        <th>Частота выплат (в год)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.Bonds.map((bond) => (
                        <tr key={bond.ticker}>
                            <td>{bond.name}</td>
                            <td>{bond.ticker}</td>
                            <td>{bond.price} ₽</td>
                            <td>{bond.coupon.size + " ₽" || "-"}</td>
                            <td>{bond.coupon.frequency_per_year || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="buttons">
                <button className="restart-button" onClick={handleRestart}>
                    Начать заново
                </button>
                <button className="save-button" onClick={handleSave} disabled={!collectionName || !financialGoal}>
                    Завершить
                </button>
            </div>
        </div>
    );
};

export default CollectionDraft;
