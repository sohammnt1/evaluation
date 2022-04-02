import { Schema, model, Types } from "mongoose";

class formSchema extends Schema {
  constructor() {
    super(
      {
        studentId: {
          type: Types.ObjectId,
          required: true,
          ref: "user",
          unique: true,
        },
        track: { type: Types.ObjectId, required: true, ref: "track" },
        lastEvaluated: { type: Date, required: true },
        trainersAssigned: [
          { type: Types.ObjectId, required: true, ref: "user" },
        ],
        rating: [
          {
            LogicRating: { type: Number, required: true },
            CommunicationRating: { type: Number, required: true },
            AssignmentRating: { type: Number, required: true },
            ProActivenessRating: { type: Number, required: true },
          },
        ],
      },
      {
        timestamps: true,
      }
    );
  }
}

const formModel = model("evaluationform", new formSchema());

export default formModel;
