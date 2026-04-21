import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({ company: "", role: "" });
  const [filter, setFilter] = useState("all");

  const filteredJobs =
    filter === "all" ? jobs : jobs.filter((job) => job.status === filter);

  useEffect(() => {
    axios.get(API_URL).then((res) => setJobs(res.data));
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Add new job
  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.company || !formData.role) return;

    const res = await axios.post(API_URL, formData);

    setJobs([...jobs, res.data]);

    setFormData({ company: "", role: "" });
  }

  // Status update
  async function handleStatusUpdate(id, newStatus) {
    const res = await axios.patch(`${API_URL}/${id}`, { status: newStatus });
    setJobs(jobs.map((job) => (job._id === id ? res.data : job)));
  }

  // Delete job
  async function handleDelete(id) {
    await axios.delete(`${API_URL}/${id}`);
    setJobs(jobs.filter((job) => job._id !== id));
  }

  // Job Elements
  const jobElements = filteredJobs.map((job) => (
    <li key={jobs._id}>
      <span>{job.company}</span> — <span>{job.role}</span> (
      <select
        value={job.status}
        onChange={(e) => handleStatusUpdate(job._id, e.target.value)}
      >
        <option value="applied">Applied</option>
        <option value="interviewing">Interviewing</option>
        <option value="rejected">Rejected</option>
        <option value="offer">Offer</option>
      </select>
      )<button onClick={() => handleDelete(job._id)}>Delete</button>
    </li>
  ));

  return (
    <div>
      <h1>Job Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
        />
        <input
          name="role"
          placeholder="Role"
          value={formData.role}
          onChange={handleChange}
        />
        <button type="submit">Add Job</button>
      </form>
      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("applied")}>Applied</button>
        <button onClick={() => setFilter("interviewing")}>Interviewing</button>
        <button onClick={() => setFilter("rejected")}>Rejected</button>
        <button onClick={() => setFilter("offer")}>Offer</button>
      </div>
      <ul>{jobElements}</ul>
    </div>
  );
}
