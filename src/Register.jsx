import { useState } from "react";
import { useNavigate } from "react-router-dom";

const INTERESTS = ["Sports", "Movies", "Food", "Games", "Outdoors", "Music",
  "Art", "Shopping", "Entertainment", "Gossip", "Relaxing", "Mindbending",
  "Collaborative", "Puzzle"];

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function toggleInterest(interest) {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("http://localhost:5159/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, interests }),
    });

    if (res.status === 409) {
      const msg = await res.text();
      setError(msg);                 // "Email already exists." etc.
      return;
    }
    if (!res.ok) {
      setError("Registration failed. Check your inputs.");
      return;
    }

    navigate("/login");                 // tell App: account created, go to login
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />

      <div>
        <p>Interests (optional):</p>
        {INTERESTS.map(interest => (
          <label key={interest} style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              checked={interests.includes(interest)}
              onChange={() => toggleInterest(interest)}
            />
            {interest}
          </label>
        ))}
      </div>

      <button type="submit">Register</button>
      <button type="button" onClick={() => navigate("/login")}>Back to login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}