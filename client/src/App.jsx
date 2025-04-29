import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome/Welcome";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import CollectionDetails from "./pages/CollectionDetails/CollectionDetails";
import Question from "./pages/Question/Question";
import CollectionDraft from "./pages/CollectionDraft/CollectionDraft";
import EditProfile from "./pages/EditProfile/EditProfile";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

import { useEffect, useState } from "react";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    if (isAuthenticated === null) {
        return <div>Загрузка...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
                <Route path="/register" element={<Register setAuth={setIsAuthenticated} />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                <Route path="/collection/:id" element={isAuthenticated ? <CollectionDetails /> : <Navigate to="/login" />} />
                <Route path="/question" element={isAuthenticated ? <Question /> : <Navigate to="/login" />} />
                <Route path="/confirmation" element={isAuthenticated ? <CollectionDraft /> : <Navigate to="/login" />} />
                <Route path="/editProfile" element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />} />

                <Route path="*" element={<Welcome />} />
            </Routes>
        </Router>
    );
}

export default App;