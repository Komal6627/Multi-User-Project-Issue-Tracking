import { useEffect, useState, useContext } from "react";
import api from "../api/axois.js";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import CreateProject from "../components/CreateProject.js";

const Dashboard = ({token}) => {
  const { user } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
   const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

const handleProjectCreated = (newProject) => {
    setProjects((prev) => [...prev, newProject]);
  };

const fetchProjects = async () => {
  try {
    const response = await api.get("/project/");
    console.log("Backend dashboard response:", response);

    // Make sure we set an array
    setProjects(response.data.projects || []);
  } catch (err) {
    setError(
      err.response?.data?.message || "Failed to fetch projects"
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Projects</h2>

          {/* Role-based UI */}
          {user?.role === "Admin" && (
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"  onClick={() => setShowModal(true)}>
              + Create Project
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-500">
            Loading projects...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <div className="text-gray-500">
            No projects found.
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
            />
          ))}
        </div>

         {showModal && (
        <CreateProject
          token={token}
          onClose={() => setShowModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
      </div>
    </div>
  );
};

export default Dashboard;