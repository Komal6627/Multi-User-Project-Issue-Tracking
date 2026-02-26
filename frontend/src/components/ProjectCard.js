import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <Link to={`/project/${project._id}`}>
      <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 border">
        <h3 className="text-xl font-semibold mb-2">
          {project.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3">
          {project.description}
        </p>

        <div className="text-xs text-gray-400">
          Members: {project.members?.length || 0}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;