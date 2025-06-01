import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import HeaderButtons from "../../components/HeaderButtons/HeaderButtons";
import axios from "axios";
import "./CollectionDetails.scss"

const CollectionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
  
    useEffect(() => {
      if (!token) {
        console.error("Нет токена, пользователь не авторизован");
        return;
      }
  
      const fetchCollectionDetails = async () => {
        try {
          const response = await axios.get(`/api/collections/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          const data = response.data;
  
          setCollection({
            title: data.name,
            profitability: data.expected_return,
            created_at: data.creation_date,
            goal: data.goal,
            risk_level: data.risk_level,
            stocks: data.stocks || [],
            bonds: data.bonds || [],
          });
        } catch (error) {
          console.error("Ошибка загрузки данных подборки:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCollectionDetails();
    }, [id]);
  
    const handleDelete = async () => {
      const confirmDelete = window.confirm("Вы уверены, что хотите удалить подборку?");
      if (!confirmDelete) return;
  
      try {
        await axios.delete(`/api/collections/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        alert("Подборка успешно удалена!");
        navigate("/home");
      } catch (error) {
        console.error("Ошибка при удалении подборки:", error);
        alert("Не удалось удалить подборку. Попробуйте снова.");
      }
    };
  
    if (loading) {
      return <p>Загрузка...</p>;
    }
  
    if (!collection) {
      return <p>Ошибка загрузки подборки.</p>;
    }
  
    return (
      <div className="collection-container">
        <Header />
        <HeaderButtons />
        <div className="collection-details">
          <h2>{collection.title}</h2>
          <p className="date">Дата создания - {new Date(collection.created_at).toLocaleDateString()}</p>
          
          <h3>Ценные бумаги на бирже</h3>
  
          <h4>Акции</h4>
          <div className="table">
            {collection.stocks.length > 0 ? (
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
                {collection.stocks.map((stock, index) => (
                  <tr key={index}>
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
          ) : (
            <p>Нет акций в этой подборке.</p>
          )}
          </div>
          
  
          <h4>Облигации</h4>
          <div>
          {collection.bonds.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>ISIN</th>
                  <th>Стоимость</th>
                  <th>Размер купона</th>
                  <th>Частота выплат (в год)</th>
                </tr>
              </thead>
              <tbody>
                {collection.bonds.map((bond, index) => (
                  <tr key={index}>
                    <td>{bond.name}</td>
                    <td>{bond.ticker}</td>
                    <td>{bond.price} ₽</td>
                    <td>{bond.coupon.size + " ₽" || "-"}</td>
                    <td>{bond.coupon.frequency_per_year || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Нет облигаций в этой подборке.</p>
          )}
          </div>
  
          <div className="buttons">
            <button className="backButton" onClick={() => navigate("/home")}>Назад</button>
            <button className="deleteButton" onClick={handleDelete}>Удалить подборку</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default CollectionDetails;