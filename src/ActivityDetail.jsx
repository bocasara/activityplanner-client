import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "./api";

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch(`/activities/${id}`);
        if (res.status === 404) {
          setError("Activity not found");
          return;
        }
        if (!res.ok) {
          setError("Failed to load activity");
          return;
        }
        const data = await res.json();
        setActivity(data);
      } catch {
        setError("Could not reach server");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <button onClick={() => navigate("/activities")}>← Back</button>
      <h2>{activity.name}</h2>
      <p>{activity.description}</p>
      <p>
        <strong>Price:</strong> ${activity.price}
      </p>
      <p>
        <strong>Location:</strong> {activity.location}
      </p>
      <p>
        <strong>Interests:</strong> {activity.interests.join(", ")}
      </p>
    </div>
  );
}
