import User from "../models/user.model.js";
import Organization from "../models/organization.model.js";
import bcrypt from "bcrypt";

export const inviteMember = async (req, res) => {
  const { name, email, password } = req.body;
  const admin = req.user;

  // Check if email already exists
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ success: false, message: "Email already exists" });

  // Create member user
  const hashedPassword = await bcrypt.hash(password, 10);
  const member = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Member",
    organization: admin.organization
  });

  // Add to organization members
  await Organization.findByIdAndUpdate(admin.organization, { $push: { members: member._id } });

  res.status(201).json({ success: true, member });
};