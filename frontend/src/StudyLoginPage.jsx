import { useState } from 'react';
import axios from 'axios';

function StudyLoginPage(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    
    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/login', { username, password });
            if (response.status === 200) props.setIsLoggedIn(true);
        } catch (error) {
            alert("Invalid username or password");
        }
    };
    
    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:3000/register', { username, password });
            if (response.status === 201) {
                alert("Account created! log in now.");
                setIsRegistering(false);
            }
        } catch (error) {
            alert("Registration failed");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-light min-vh-100">           
           <div className="bg-white p-5 shadow rounded border-primary border" style={{ width: '400px' }}>
            <h2 className="text_center mh-4 text-primary fw-bold">
                {isRegistering ? "Create Account" : "planner Login"}
            </h2>
            <input type="text" placeholder="username" className="form-control mb-3" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="password" className="form-control mb-4" onChange={(e) => setPassword(e.target.value)} />

            {isRegistering ? (
                <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>Sign Up</button>
            ) : (
                <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Log In</button>
            )}
            <div className="text-center mt-3">
                <span className="text-primary text-decoration-underline" style={{ cursor: "pointer" }} onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? "Already have an account? Log in" : "Don't have an account? Register"}
                </span>
           </div>
              </div>
        </div>
    );
}
const handleLogin = async () => {
    try {
        const response = await axios.post('https://taskplaner-nhst.onrender.com/login   ', { username, password });
        if (response.status === 200) {
            // Paste this line inside your successful login block:
            localStorage.setItem('token', response.data.token); 
            
            props.setIsLoggedIn(true);
        }
    } catch (error) {
        alert("Invalid username or password");
    }
};

export default StudyLoginPage;
