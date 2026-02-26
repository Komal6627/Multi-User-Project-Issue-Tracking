import { createProjectService, assignMemberService, getProjectsService } from "../services/project.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await createProjectService({
      name,
      description,
      createdBy: req.user._id,
      organization: req.user.organization,
    });
    res.status(201).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

export const assignMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { memberId } = req.body;
    const project = await assignMemberService(projectId, memberId, req.user.organization);
    res.status(200).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await getProjectsService(req.user);
    res.status(200).json({ success: true, projects });
  } catch (err) {
    next(err);
  }
};