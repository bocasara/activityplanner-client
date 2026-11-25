import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "./api";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch("/activities");
        if (!res.ok) {
          setError("Failed to load activities");
          return;
        }
        const data = await res.json();
        setActivities(data);
      } catch {
        setError("Could not reach server");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this activity?")) return;
    setError("");
    const res = await apiFetch(`/activities/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Failed to delete activity");
      return;
    }
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }

  if (loading) return <p>Loading activities...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Activities</h2>
      <Link to="/activities/new">+ Add activity</Link>

      {activities.length === 0 ? (
        <p>No activities</p>
      ) : (
        <ul>
          {activities.map((a) => (
            <li key={a.id}>
              <Link to={`/activities/${a.id}`}>
                <strong>{a.name}</strong>
              </Link>{" "}
              - {a.description} (${a.price}){" "}
              <Link to={`/activities/${a.id}/edit`}>Edit</Link>{" "}
              <button onClick={() => handleDelete(a.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
