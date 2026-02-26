import User from "../models/user.model.js";
import Organization from "../models/organization.model.js";
import bcrypt from "bcrypt";

export const inviteMemberService = async ({ adminId, memberData }) => {
  const { name, email, password } = memberData;

  // 1️⃣ Get Admin user
  const admin = await User.findById(adminId);
  if (!admin || admin.role !== "Admin") {
    throw new Error("Only Admin can invite members");
  }

  // 2️⃣ Check if user already exists in organization
  const existingUser = await User.findOne({ email, organization: admin.organization });
  if (existingUser) throw new Error("User already exists in organization");

  // 3️⃣ Create Member user
  const hashedPassword = await bcrypt.hash(password, 10);

  const member = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Member",
    organization: admin.organization
  });

  // 4️⃣ Add to organization's members array
  await Organization.findByIdAndUpdate(admin.organization, { $push: { members: member._id } });

  return member;
};

