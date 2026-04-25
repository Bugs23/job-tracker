import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://job-tracker-api-r9pa.onrender.com/api/jobs";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({ company: "", role: "" });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios.get(API_URL).then((res) => setJobs(res.data));
  }, []);

  // Handle form input changes
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

  // Filter jobs based on status
  const filteredJobs =
    filter === "all" ? jobs : jobs.filter((job) => job.status === filter);

  // Job status colors
  const statusColors = {
    applied: "bg-blue-100 text-blue-800",
    interviewing: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
    offer: "bg-green-100 text-green-800",
  };

  // Status filter buttons
  const statusButtonElements = [
    "all",
    "applied",
    "interviewing",
    "rejected",
    "offer",
  ].map((status) => (
    <button
      key={status}
      onClick={() => setFilter(status)}
      className={`px-4 py-1.5 rounded-full text-sm capitalize ${
        filter === status
          ? "bg-blue-600 text-white"
          : "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700"
      }`}
    >
      {status}
    </button>
  ));

  // Map filtered jobs to JSX elements
  const jobElements = filteredJobs.map((job) => (
    <div
      key={job._id}
      className="flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700"
    >
      <div>
        <p className="font-semibold text-white">{job.company}</p>
        <p className="text-sm text-gray-400">{job.role}</p>
      </div>
      <div className="flex items-center gap-3">
        <select
          value={job.status}
          onChange={(e) => handleStatusUpdate(job._id, e.target.value)}
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[job.status]}`}
        >
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="rejected">Rejected</option>
          <option value="offer">Offer</option>
        </select>
        <button
          onClick={() => handleDelete(job._id)}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  ));

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Tracker</h1>
        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <input
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          />
          <input
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Job
          </button>
        </form>
        <div className="flex gap-2 mb-6">{statusButtonElements}</div>
        {filteredJobs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No jobs found</p>
        ) : (
          <div className="flex flex-col gap-2">{jobElements}</div>
        )}
      </div>
    </div>
  );
}
