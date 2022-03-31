import { Schema, model, Types } from "mongoose";

class trackSchema extends Schema {
  constructor() {
    super(
      {
        name: { type: String, required: true },
      },
      {
        timestamps: true,
      }
    );
  }
}

const trackModel = model("track", new trackSchema());

export default trackModel;
