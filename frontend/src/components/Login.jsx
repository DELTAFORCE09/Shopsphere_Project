import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

export default function Login() {

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            const response = await axios.post("/login", credentials);

            localStorage.setItem("token", response.data);

            alert("Login Successful");

            navigate("/");

        } catch (err) {

            alert("Invalid Credentials");
        }
    };

    return (
        <div className="container mt-5">

            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <input
                    className="form-control mb-3"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <button className="btn btn-primary">
                    Login
                </button>

            </form>

        </div>
    );
}