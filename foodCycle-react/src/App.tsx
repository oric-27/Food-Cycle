import {BrowserRouter, Routes, Route, useNavigate, Navigate} from "react-router-dom";
import Header from "./component/Header";
import HeroSection from "./component/HeroSection";
import AuthComponent from "./component/AuthComponent.tsx";

function LandingPage() {
    const navigate = useNavigate();

    return(
        <>
            <Header />
            <HeroSection onRegister={() => navigate("/register")} />
        </>
    )
}

function AuthPage({mode} : {mode: "login" | "register"}) {
    const navigate = useNavigate();

    return(
        <>
            <Header />
            <HeroSection onRegister={() => navigate("/register")} />
            <AuthComponent initialMode={mode} onClose={() => navigate("/")} />
        </>
    )
}

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<AuthPage mode="login" />} />
                    <Route path="/register" element={<AuthPage mode="register" />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;