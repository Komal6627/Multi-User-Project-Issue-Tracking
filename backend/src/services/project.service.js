import Project from "../models/project.model.js";
import User from "../models/user.model.js";

// Create a new project
export const createProjectService = async ({ name, description, createdBy, organization }) => {
  const project = await Project.create({
    name,
    description,
    createdBy,
    members: [createdBy], // Admin is automatically a member
    organization,
  });
  return project;
};

// Assign a member to project
export const assignMemberService = async (projectId, memberId, organization) => {
  // Check if member exists and belongs to same org
  const member = await User.findOne({ _id: memberId, organization });
  if (!member) {
    throw new Error("Member not found or not in your organization");
  }

  const project = await Project.findOne({ _id: projectId, organization });
  if (!project) throw new Error("Project not found");

  if (!project.members.includes(memberId)) {
    project.members.push(memberId);
    await project.save();
  }

  return project;
};

// Get projects (Admin: all in org, Member: only assigned)
export const getProjectsService = async (user) => {
  if (user.role === "Admin") {
    return await Project.find({ organization: user.organization }).populate("members", "name email role");
  } else {
    return await Project.find({ organization: user.organization, members: user._id }).populate("members", "name email role");
  }
};