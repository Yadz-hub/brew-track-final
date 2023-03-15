import mongoose from "mongoose";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

const userSchema = new mongoose.Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
});

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
