import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './TaskManager.css'

const TaskManager = () => {
    const [taskList, setTaskList] = useState([]);
    const [editableId, setEditableId] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [editedCategory, setEditedCategory] = useState("");
    const [editedDeadline, setEditedDeadline] = useState("");
    const [editedPriority, setEditedPriority] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');

        if (!token) {
            navigate('/');
        } else {
            fetchTasks(token, userId);
        }
    }, [navigate]);

    const fetchTasks = (token, userId) => {
        setLoading(true);
        fetch(`http://127.0.0.1:5000/tasks`, {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            return response.json();
        })
        .then((data) => {
            const filteredData = data.filter(item => item.userId === userId);
            setTaskList(filteredData);
        })
        .catch((error) => console.log(error.message))
        .finally(() => setLoading(false));
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        navigate('/');
    };

    const toggleEditable = (id) => {
        const rowData = taskList.find((data) => data._id === id);
        if (rowData) {
            setEditableId(id);
            setEditedTask(rowData.task);
            setEditedStatus(rowData.status);
            setEditedCategory(rowData.category);
            setEditedDeadline(rowData.deadline || "");
            setEditedPriority(rowData.priority || "");
        } else {
            setEditableId(null);
            setEditedTask("");
            setEditedStatus("");
            setEditedCategory("");
            setEditedDeadline("");
            setEditedPriority("");
        }
    };

    const saveEditedTask = (id) => {
        const editedData = {
          task: editedTask,
          status: editedStatus,
          category: editedCategory,
          deadline: editedDeadline,
          priority: editedPriority,
        };

        const token = localStorage.getItem('token');
        fetch(`http://127.0.0.1:5000/tasks/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify(editedData),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error('Failed to save task');
            }
            return res.json();
          })
          .then(() => {
            setEditableId(null);
            setEditedTask("");
            setEditedStatus("");
            setEditedCategory("");
            setEditedDeadline("");
            setEditedPriority("");
            fetchTasks(token);
          })
          .catch((error) => console.log(error));
      };

      const deleteTask = (id) => {
        const token = localStorage.getItem('token');
        fetch(`http://127.0.0.1:5000/tasks/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": token
          }
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error('Failed to delete task');
            }
            return res.json();
          })
          .then(() => {
            fetchTasks(token);
          })
          .catch((error) => console.log(error));
      };

    return(
        <div className="task-container">
            <h2 className="task-heading">Tasks</h2>
            {loading ? (
                <p>Loading tasks...</p>
            ) : (
                <>
                    <table className="table-container">
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Status</th>
                                <th>Category</th>
                                <th>Deadline</th>
                                <th>Priority</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {taskList.map((data) => (
                                <tr key={data._id}>
                                    <td>
                                        {editableId === data._id ? (
                                            <input
                                                autoComplete="true"
                                                type="text"
                                                className="table-content"
                                                value={editedTask}
                                                onChange={(e) => setEditedTask(e.target.value)}
                                            />
                                        ) : (
                                            data.task
                                        )} 
                                    </td>
                                    <td>
                                        {editableId === data._id ? (
                                            <input
                                                autoComplete="true"
                                                type="text"
                                                className="table-content"
                                                value={editedStatus}
                                                onChange={(e) => setEditedStatus(e.target.value)}
                                            />
                                        ) : (
                                            data.status
                                        )}
                                    </td>
                                    <td>
                                        {editableId === data._id ? (
                                            <input
                                                autoComplete="true"
                                                type="text"
                                                className="table-content"
                                                value={editedCategory}
                                                onChange={(e) => setEditedCategory(e.target.value)}
                                            />
                                        ) : (
                                            data.category
                                        )}
                                    </td>
                                    <td>
                                        {editableId === data._id ? (
                                            <input
                                                autoComplete="true"
                                                type="text"
                                                className="table-content"
                                                value={editedDeadline}
                                                onChange={(e) => setEditedDeadline(e.target.value)}
                                            />
                                        ) : (
                                            data.deadline 
                                                ? new Date(data.deadline).toLocaleString() 
                                                : ""
                                        )}
                                    </td>
                                    <td>
                                        {editableId === data._id ? (
                                            <input
                                                autoComplete="true"
                                                type="text"
                                                className="table-content"
                                                value={editedPriority}
                                                onChange={(e) => setEditedPriority(e.target.value)}
                                                />
                                                ) : (
                                                data.priority
                                                )}
                                                </td>
                                                <td>
                                                {editableId === data._id ? (
                                                <button
                                                className="button"
                                                onClick={() => saveEditedTask(data._id)}
                                                >
                                                Save
                                                </button>
                                                ) : (
                                                <button
                                                className="button"
                                                onClick={() => toggleEditable(data._id)}
                                                >
                                                Edit
                                                </button>
                                                )}
                                                <button
                                                className="button button-delete"
                                                onClick={() => deleteTask(data._id)}
                                                >
                                                Delete
                                                </button>
                                                </td>
                                                </tr>
                                                ))}
                                                </tbody>
                                                </table>
                                                {taskList.length === 0 && (
                                                <p>No tasks found.</p>
                                                )}
                                                </>
                                                )}
                                                <Link to="/addtask" className="button button-primary add">Add Task</Link>
                                                <button onClick={logout} className="button button-delete">Logout</button>
                                                </div>
                                                );
                                                };
                                                
                                                export default TaskManager;
