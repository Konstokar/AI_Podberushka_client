import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";
import HeaderButtons from "../../components/HeaderButtons/HeaderButtons";
import "./Home.scss";

const Home = () => {
  const [collections, setCollections] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("user"));
  const login = userData?.login;

  useEffect(() => {
    if (!login) {
      setError("Нет данных о пользователе, авторизуйтесь снова.");
      return;
    }

    const fetchCollections = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/collections/user/${login}`);
        setCollections(response.data.collections);
      } catch (error) {
        console.error("Ошибка загрузки подборок:", error);
        setError("Не удалось загрузить подборки");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [login]);

  const handleNewCollection = () => {
    navigate("/question");
  };

  const itemsPerPage = 20;
  const totalPages = Math.ceil(collections.length / itemsPerPage);
  const paginatedCollections = collections.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <>
    <Header></Header>
    <HeaderButtons></HeaderButtons>
        <div className="container">
      <h2>Все подборки</h2>

      {loading && <p>Загрузка...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        collections.length === 0 ? (
          <>
            <p>У вас пока нет подборок.</p>
            <button className="newCollection" onClick={handleNewCollection}>Создать новую подборку</button>
          </>
          
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Риск</th>
                    <th>Название</th>
                    <th>Дата создания</th>
                    <th>Доходность</th>
                    <th>Срок достижения</th>
                    <th>Финансовая цель</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCollections.map((collection) => (
                    <tr key={collection._id}>
                      <td>{collection.risk_category}</td>
                      <td>
                        <Link to={`/collection/${collection._id}`}>{collection.name}</Link>
                      </td>
                      <td>{new Date(collection.creation_date).toLocaleDateString()}</td>
                      <td>{collection.expected_return}%</td>
                      <td>{collection.deadline}</td>
                      <td>{collection.goal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button onClick={() => setPage(page - 1)} disabled={page === 1}>Назад</button>
              <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>Вперёд</button>
            </div>

            <button className="newCollection" onClick={handleNewCollection}>Создать новую подборку</button>
          </>
        )
      )}
    </div>
    </>
  );
};

export default Home;