import { Schema, model, Types } from "mongoose";

class userSchema extends Schema {
  constructor() {
    super(
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        employeeId: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: Types.ObjectId, required: true, ref: "role" },
        deleted: { type: Boolean, required: false },
      },
      {
        timestamps: true,
      }
    );
  }
}

const userModel = model("user", new userSchema());

export default userModel;
