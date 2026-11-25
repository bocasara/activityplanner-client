import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        const res =  await fetch("http://localhost:5159/api/auth/login", 
            {
                method: "POST",
                headers : {"Content-Type": "application/json"},
                body: JSON.stringify({username, password}),
            });
            if(!res.ok) {
                setError("Invalid username or password"); return;
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);
            navigate("/activities")
    }

    return(
        <form onSubmit={handleSubmit}>  
            <h2>Login</h2>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Log in</button> 
            {error && <p style={{color:"red"}}>{error}</p>}
        </form>
    );
}


