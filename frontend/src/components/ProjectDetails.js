import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axois.js";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProject();
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [statusFilter, priorityFilter, page]);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/project/${id}`);
      setProject(data.project || data);
    } catch (err) {
      setError("Failed to load project");
    }
  };

  const fetchIssues = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/issue", {
        params: {
          project: id,
          status: statusFilter,
          priority: priorityFilter,
          page,
          limit: 5,
        },
      });

      setIssues(data.issues);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError("Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-8">

        {/* Project Info */}
        {project && (
          <div className="bg-white p-6 rounded-2xl shadow mb-6">
            <h2 className="text-3xl font-bold mb-2">
              {project.name}
            </h2>
            <p className="text-gray-600">
              {project.description}
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => {
              setPage(1);
              setPriorityFilter(e.target.value);
            }}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {/* Role-based: Only Admin can create issue */}
          {user?.role === "Admin" && (
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
              + Create Issue
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-500">
            Loading issues...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Issues List */}
        {!loading && issues.length === 0 && (
          <div className="text-gray-500">
            No issues found.
          </div>
        )}

        <div className="space-y-4">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="bg-white p-5 rounded-xl shadow border"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {issue.title}
                </h3>

                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    issue.status === "Done"
                      ? "bg-green-100 text-green-600"
                      : issue.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {issue.status}
                </span>
              </div>

              <p className="text-gray-600 mt-2 text-sm">
                {issue.description}
              </p>

              <div className="flex justify-between mt-4 text-xs text-gray-400">
                <span>Priority: {issue.priority}</span>
                <span>
                  Assigned: {issue.assignee?.name || "Unassigned"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
