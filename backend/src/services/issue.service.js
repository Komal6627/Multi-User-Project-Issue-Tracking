import Issue from "../models/issue.model.js";
import Project from "../models/project.model.js";
import Comment from "../models/comment.model.js";

// Create a new issue
// export const createIssueService = async ({ title, description, projectId, assignedTo, dueDate, organization }) => {
//   const project = await Project.findOne({ _id: projectId, organization });
//   if (!project) throw new Error("Project not found");
//   console.log("Project ID from body:", project);
// console.log("Organization from token:", organization);

//   if (assignedTo && !project.members.includes(assignedTo)) {
//     throw new Error("Assigned user is not a member of this project");
//   }

//   const issue = await Issue.create({
//     title,
//     description,
//     project: projectId,
//     assignedTo,
//     dueDate,
//     organization,
//     activityLog: [
//       {
//         action: "CREATED",
//         previousValue: null,
//         newValue: "Issue created",
//         changedBy: assignedTo || null,
//       },
//     ],
//   });

//   return issue;
// };

export const createIssueService = async ({
  title,
  description,
  project,
  assignedTo,
  dueDate,
  organization
}) => {

  const projectDoc = await Project.findOne({
    _id: project,
    organization
  });

  if (!projectDoc) throw new Error("Project not found");

  if (assignedTo && !projectDoc.members.includes(assignedTo)) {
    throw new Error("Assigned user is not a member of this project");
  }

  const issue = await Issue.create({
    title,
    description,
    project,
    assignedTo,
    dueDate,
    organization
  });

  return issue;
};

// Update issue (status, priority, assignedTo)
export const updateIssueService = async ({ issueId, updates, user }) => {
  const issue = await Issue.findOne({ _id: issueId, organization: user.organization });
  if (!issue) throw new Error("Issue not found");

  // Only project members can update
  const project = await Project.findById(issue.project);
  if (!project.members.includes(user._id)) throw new Error("Not authorized");

  const log = [];

  if (updates.status && updates.status !== issue.status) {
    log.push({ action: "STATUS_CHANGED", previousValue: issue.status, newValue: updates.status, changedBy: user._id });
    issue.status = updates.status;
  }

  if (updates.priority && updates.priority !== issue.priority) {
    log.push({ action: "PRIORITY_CHANGED", previousValue: issue.priority, newValue: updates.priority, changedBy: user._id });
    issue.priority = updates.priority;
  }

  if (updates.assignedTo && updates.assignedTo.toString() !== issue.assignedTo?.toString()) {
    log.push({ action: "ASSIGNEE_CHANGED", previousValue: issue.assignedTo, newValue: updates.assignedTo, changedBy: user._id });
    issue.assignedTo = updates.assignedTo;
  }

  issue.activityLog.push(...log);
  await issue.save();
  return issue;
};

// Add comment


export const addCommentService = async ({ issueId, text, user }) => {

  const issue = await Issue.findOne({
    _id: issueId,
    organization: user.organization
  });

  if (!issue) throw new Error("Issue not found");

  const project = await Project.findById(issue.project);

  if (!project.members.some(member =>
    member.toString() === user._id.toString()
  )) {
    throw new Error("Not authorized");
  }

  const comment = await Comment.create({
    content: text,
    issue: issueId,
    organization: user.organization,
    user: user._id
  });

  return comment;
};