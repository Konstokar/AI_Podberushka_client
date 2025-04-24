import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Question.module.scss";
import Header from "../../components/Header/Header";
import HeaderButtons from "../../components/HeaderButtons/HeaderButtons";
import questionsData from "../../sources/answer_list.json";

const Question = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});

    useEffect(() => {
        setQuestions(Object.values(questionsData));
    }, []);

    const handleAnswerSelect = (answerKey) => {
        setSelectedAnswer(answerKey);
    };

    const saveAnswersToServer = async (answers) => {
        try {
            const login = JSON.parse(localStorage.getItem("user"))?.login;
            if (!login) {
                console.error("Логин пользователя не найден в localStorage");
                return;
            }
    
            const response = await fetch("/api/ml/save_answers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login, answers }),
            });
    
            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.status}`);
            }
        } catch (error) {
            console.error("Ошибка сохранения ответов:", error);
        }
    };

    const handleNextQuestion = async () => {
        if (selectedAnswer === null) return;

        const updatedAnswers = {
            ...userAnswers,
            [`question_${currentQuestionIndex + 1}`]: {
                answer_grade: questions[currentQuestionIndex].answer_list[selectedAnswer].answer_grade
            }
        };

        setUserAnswers(updatedAnswers);
        await saveAnswersToServer(updatedAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setSelectedAnswer(null);
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            await processNeuralNetworks(updatedAnswers);
        }
    };

    
    const processNeuralNetworks = async () => {
        try {
            const login = JSON.parse(localStorage.getItem("user"))?.login;
            if (!login) {
                console.error("Логин пользователя не найден в localStorage");
                return;
            }
    
            const marketResponse = await fetch("/api/ml/analyze_market");
            if (!marketResponse.ok) {
                throw new Error(`Ошибка сети: ${marketResponse.status}`);
            }
    
            const marketData = await marketResponse.json();
    
            const response = await fetch("/api/ml/generate_portfolio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ market_data: marketData, login }),
            });
    
            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.status}`);
            }
    
            const portfolioData = await response.json();
            localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
            navigate("/confirmation");
        } catch (error) {
            console.error("Ошибка при обработке нейросетей:", error);
        }
    };

    if (questions.length === 0) return <p>Загрузка...</p>;

    return (
        <div className={styles.container}>
            <Header />
            <HeaderButtons />
            <main className={styles.content}>
                <h1 className={styles.title}>{`Вопрос ${currentQuestionIndex + 1}: ${questions[currentQuestionIndex].question_title}`}</h1>
                <p className={styles.subtitle}>Варианты ответа:</p>
                <ol className={styles.answersList}>
                    {Object.entries(questions[currentQuestionIndex].answer_list).map(([key, answer]) => (
                        <li
                            key={key}
                            className={`${styles.answer} ${selectedAnswer === key ? styles.selected : ""}`}
                            onClick={() => handleAnswerSelect(key)}
                        >
                            {answer.answer_title}
                        </li>
                    ))}
                </ol>
                <button className={styles.nextButton} disabled={selectedAnswer === null} onClick={handleNextQuestion}>
                    Далее
                </button>
            </main>
        </div>
    );
};

export default Question;