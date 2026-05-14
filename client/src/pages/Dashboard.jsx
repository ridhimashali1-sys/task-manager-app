import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // ✅ EDIT STATE
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  // GET TASKS
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks", {
        headers: {
          Authorization: token,
        },
      });

      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // START EDIT
  const startEdit = (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description);
  };

  // SAVE (ADD + UPDATE)
  const saveTask = async () => {
    try {
      if (editId) {
        // UPDATE TASK
        const res = await API.put(
          `/tasks/${editId}`,
          { title, description },
          {
            headers: { Authorization: token },
          }
        );

        setTasks(
          tasks.map((t) => (t._id === editId ? res.data : t))
        );

        setEditId(null);
      } else {
        // CREATE TASK
        const res = await API.post(
          "/tasks",
          { title, description },
          {
            headers: { Authorization: token },
          }
        );

        setTasks([...tasks, res.data]);
      }

      setTitle("");
      setDescription("");
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`, {
        headers: { Authorization: token },
      });

      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Tasks</h2>

      {/* INPUT SECTION */}
      <div>
        <input
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={saveTask}>
          {editId ? "Update Task" : "Add Task"}
        </button>
      </div>

      <hr />

      {/* TASK LIST */}
      {tasks.map((task) => (
        <div
          key={task._id}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px",
          }}
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>

          <button onClick={() => startEdit(task)}>
            Edit
          </button>

          <button onClick={() => deleteTask(task._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;