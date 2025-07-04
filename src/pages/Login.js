import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/contexts";
import PageNav from "../components/PageNav";
import Button from "../components/Button";

import styles from "./Login.module.css";

const Login = () => {
    const navigate = useNavigate();
    const {isAuthenticated, login} = useAuth();
    // PRE-FILL FOR DEV PURPOSES
    const [email, setEmail] = useState("jack@example.com");
    const [password, setPassword] = useState("qwerty");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email && password) login(email, password);
    }

    useEffect(() => {
        if (isAuthenticated) navigate('/app', {replace: true}); // replace property in the navigate option object replaces login page for app in history so that it is possible to use the back button in the browser
    }, [isAuthenticated, navigate]);

    return (
        <main className={styles.login}>
            <PageNav />

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>

                <div className={styles.row}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>

                <div>
                    <Button type="primary">Login</Button>
                </div>
            </form>
        </main>
    );
};

export default Login;
