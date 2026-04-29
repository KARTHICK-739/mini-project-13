import { useEffect, useState } from "react";
import "./App.css";

import { Pie, Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
);

const API = "https://electricity-board-api.onrender.com/api";

function App() {
  const [data, setData] = useState([]);
  const [pageView, setPageView] = useState("home");
  const [editing, setEditing] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // 🔄 Fetch data
  const fetchData = async () => {
    const res = await fetch(`${API}/connections/`);
    const d = await res.json();
    setData(d);
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  // 🔐 Login
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const d = await res.json();
      if (d.token) {
        localStorage.setItem("token", d.token);
        setToken(d.token);
        setLoginError("");
      } else {
        setLoginError("Invalid username or password");
      }
    } catch (err) {
      setLoginError("Something went wrong");
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // 📊 Stats
  const approved = data.filter((d) => d.status === "approved").length;
  const pending = data.filter((d) => d.status === "pending").length;
  const rejected = data.filter((d) => d.status === "rejected").length;

  const chartData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [approved, pending, rejected],
        backgroundColor: ["green", "orange", "red"],
      },
    ],
  };

  const monthlyCounts = {};
  data.forEach((item) => {
    const date = new Date(item.date_of_application);
    const month = date.toLocaleString("default", { month: "short" });
    monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
  });

  const months = Object.keys(monthlyCounts);
  const counts = Object.values(monthlyCounts);

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Applications per Month",
        data: counts,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.4,
      },
    ],
  };

  // 📄 Pagination
  const filteredData = data.filter((item) => {
    if (searchId && item.id.toString() !== searchId) return false;
    if (fromDate && new Date(item.date_of_application) < new Date(fromDate))
      return false;
    if (toDate && new Date(item.date_of_application) > new Date(toDate))
      return false;
    return true;
  });

  const indexOfLast = page * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleChange = (e) => {
    setEditing((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✏️ Update
  const handleUpdate = async () => {
    try {
      await fetch(`${API}/connections/${editing.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editing),
      });
      fetchData();
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔐 LOGIN PAGE
  if (!token) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>⚡ Electricity Board</h2>
          <p>Sign in to continue</p>
          <input
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
          {loginError && <p className="login-error">{loginError}</p>}
          <button onClick={handleLogin}>Login</button>
          // Add this inside your login-box div, below the{" "}
          <p>Sign in to continue</p>
          <div className="login-info">
            <p>
              🔧 First time?{" "}
              <a
                href="https://electricity-board-api.onrender.com/api/create-superuser/"
                target="_blank"
              >
                Click here
              </a>{" "}
              to setup admin
            </p>
            <p>
              👤 Username: <strong>admin</strong>
            </p>
            <p>
              🔑 Password: <strong>admin123</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* 🔝 NAVBAR */}
      <div className="navbar">
        <h2 style={{ color: "white" }}>⚡ Electricity Board</h2>
        <div>
          <button onClick={() => setPageView("home")}>Home</button>
          <button onClick={() => setPageView("stats")}>Statistics</button>
          <button onClick={handleLogout} style={{ background: "#ef4444" }}>
            Logout
          </button>
        </div>
      </div>

      {/* 🏠 HOME */}
      {pageView === "home" && (
        <>
          <div className="filters">
            <input
              type="number"
              placeholder="Search by ID..."
              value={searchId}
              onChange={(e) => {
                setSearchId(e.target.value);
                setPage(1);
              }}
            />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
            />
            <button
              onClick={() => {
                setSearchId("");
                setFromDate("");
                setToDate("");
                setPage(1);
              }}
            >
              Reset
            </button>
          </div>

          <div style={{ marginTop: "20px" }}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>District</th>
                  <th>State</th>
                  <th>Pincode</th>
                  <th>Ownership</th>
                  <th>ID Type</th>
                  <th>ID Number</th>
                  <th>Category</th>
                  <th>Load</th>
                  <th>Date</th>
                  <th>Reviewer</th>
                  <th>Status</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.gender}</td>
                    <td>{row.district}</td>
                    <td>{row.state}</td>
                    <td>{row.pincode}</td>
                    <td>{row.ownership}</td>
                    <td>{row.govt_id_type}</td>
                    <td>{row.id_number}</td>
                    <td>{row.category}</td>
                    <td>{row.load_applied}</td>
                    <td>{row.date_of_application}</td>
                    <td>{row.reviewer_name}</td>
                    <td>{row.status}</td>
                    <td>
                      <button onClick={() => setEditing({ ...row })}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📄 Pagination */}
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* 📊 STATISTICS */}
      {pageView === "stats" && (
        <div className="stats-page">
          <h1>Dashboard</h1>
          <div className="cards">
            <div className="card">Total: {data.length}</div>
            <div className="card green">Approved: {approved}</div>
            <div className="card orange">Pending: {pending}</div>
            <div className="card red">Rejected: {rejected}</div>
          </div>
          <div className="chart small">
            <Pie data={chartData} />
          </div>
          <div className="chart large">
            {lineData && <Line data={lineData} />}
          </div>
        </div>
      )}

      {/* ✏️ EDIT MODAL */}
      {editing && (
        <div className="modal">
          <div className="modal-content large">
            <h2>Edit #{editing.id}</h2>
            <div className="form-grid">
              {/* LEFT */}
              <div>
                <label>Name</label>
                <input value={editing.name} disabled />
                <label>Gender</label>
                <input value={editing.gender} disabled />
                <label>District</label>
                <input value={editing.district} disabled />
                <label>State</label>
                <input value={editing.state} disabled />
                <label>Pincode</label>
                <input value={editing.pincode} disabled />
                <label>Ownership</label>
                <input value={editing.ownership} disabled />
              </div>
              {/* RIGHT */}
              <div>
                <label>Category</label>
                <input value={editing.category} disabled />
                <label>Load Applied</label>
                <input value={editing.load_applied} disabled />
                <label>Date of Application</label>
                <input value={editing.date_of_application} disabled />
                <label>Status</label>
                <select
                  name="status"
                  value={editing.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <label>Reviewer Name</label>
                <input
                  name="reviewer_name"
                  value={editing.reviewer_name || ""}
                  onChange={handleChange}
                />
                <label>Comments</label>
                <textarea
                  name="reviewer_comments"
                  value={editing.reviewer_comments || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="save" onClick={handleUpdate}>
                Save
              </button>
              <button className="cancel" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
