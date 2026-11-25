import { useEffect, useState } from "react";
import { apiFetch } from "./api";
import { useParams, useNavigate } from "react-router-dom";

const LOCATIONS = ["Anywhere", "Cluj_Napoca", "Targu_Mures", "Oradea"];
const INTERESTS = [
  "Sports",
  "Movies",
  "Food",
  "Games",
  "Outdoors",
  "Music",
  "Art",
  "Shopping",
  "Entertainment",
  "Gossip",
  "Relaxing",
  "Mindbending",
  "Collaborative",
  "Puzzle",
];

export default function EditActivity() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState("Anywhere");
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch(`/activities/${id}`);
        if (!res.ok) {
          setError("Failed to load activity");
          return;
        }
        const a = await res.json();
        setName(a.name);
        setDescription(a.description);
        setPrice(a.price);
        setLocation(a.location);
        setInterests(a.interests ?? []);
      } catch {
        setError("Could not reach server");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function toggleInterest(interest) {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (interests.length === 0) {
      setError("Pick at least one interest");
      return;
    }

    const res = await apiFetch(`/activities/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
        description,
        price: Number(price),
        location,
        interests,
      }),
    });

    if (!res.ok) {
      setError("Failed to update activity");
      return;
    }

    navigate("/activities");
  }

  if (loading) return <p>Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginTop: 10, border: "1px solid #ccc", padding: 10 }}
    >
      <h4>Edit Activity</h4>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
      />

      <select value={location} onChange={(e) => setLocation(e.target.value)}>
        {LOCATIONS.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>

      <div>
        {INTERESTS.map((interest) => (
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

      <button type="submit">Save</button>
      <button type="button" onClick={() => navigate("/activities")}>
        Cancel
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
