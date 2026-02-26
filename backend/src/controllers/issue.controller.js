import { createIssueService, updateIssueService, addCommentService } from "../services/issue.service.js";

export const createIssue = async (req, res, next) => {
  try {
    const issue = await createIssueService({ 
      ...req.body, 
      organization: req.user.organization 
    });
    res.status(201).json({ success: true, issue });
  } catch (err) {
    next(err);
  }
};

export const updateIssue = async (req, res, next) => {
  try {
    const issue = await updateIssueService({ 
      issueId: req.params.issueId, 
      updates: req.body, 
      user: req.user 
    });
    res.status(200).json({ success: true, issue });
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const comment = await addCommentService({
      issueId: req.params.issueId,
      text: req.body.text,
      user: req.user
    });

    res.status(201).json({
      success: true,
      comment
    });

  } catch (err) {
    next(err);
  }
};