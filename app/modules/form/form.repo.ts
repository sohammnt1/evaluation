import formModel from "./form.schema";
import { IForm, Ifilter } from "./form.types";
import { ObjectId } from "mongodb";
import { IUser } from "../user/user.types";

const create = (form: IForm) => formModel.create(form);

const getAll = () =>
  formModel
    .find()
    .populate("studentId", "name")
    .populate("track", "name")
    .populate("trainersAssigned", "name");

const getOne = (formId: string) =>
  formModel
    .find({ _id: formId })
    // .populate("user", { name: 1, age: 1, email: 1 })
    .populate("track", "name")
    .populate("trainersAssigned", "name");

const addDate = (ratingData: {
  formId: string;
  currentEvaluation: Date;
  rating: object;
}) =>
  formModel.updateOne(
    { _id: new ObjectId(ratingData.formId) },
    { $set: { lastEvaluated: ratingData.currentEvaluation } }
  );

const pushRating = (ratingData: {
  formId: string;
  currentEvaluation: Date;
  rating: object;
}) =>
  formModel.updateOne(
    { _id: new ObjectId(ratingData.formId) },
    { $push: { rating: ratingData.rating } }
  );

const getAverage = async (filters: Ifilter) => {
  const { page, itemsPerPage, track, overallAverage } = filters;
  const queryFilters: any[] = [];
  const matchQueries: any[] = [];
  const match = {
    $match: {
      $and: matchQueries,
    },
  };
  const averages = await formModel.aggregate([
    { $unwind: "$rating" },
    {
      $group: {
        _id: "$_id",
        averageLogicRating: { $avg: "$rating.LogicRating" },
        averageCommunicationRating: { $avg: "$rating.CommunicationRating" },
        averageAssignmentsRating: { $avg: "$rating.AssignmentRating" },
        averageProactivenessRating: { $avg: "$rating.ProActivenessRating" },
      },
    },
    {
      $project: {
        _id: 1,
        averageLogicRating: 1,
        averageCommunicationRating: 1,
        averageAssignmentsRating: 1,
        averageProactivenessRating: 1,
        averageRating: {
          $avg: [
            "$averageLogicRating",
            "$averageCommunicationRating",
            "$averageAssignmentsRating",
            "$averageProactivenessRating",
          ],
        },
      },
    },
  ]);
  if (overallAverage) {
    const ids = averages.reduce((accumulator, currValue) => {
      if (currValue.averageRating > overallAverage)
        accumulator.push(currValue._id);
      return accumulator;
    }, []);
    matchQueries.push({ _id: { $in: ids } });
  }
  if (track) {
    matchQueries.push({ track: new ObjectId(track) });
  }
  if (matchQueries.length) queryFilters.push(match);
  if (page && itemsPerPage) {
    queryFilters.push({ $skip: (+page - 1) * +itemsPerPage });
    queryFilters.push({ $limit: +itemsPerPage });
  }
  let students = await formModel.aggregate([
    ...queryFilters,
    {
      $lookup: {
        from: "tracks",
        localField: "track",
        foreignField: "_id",
        as: "track",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "trainersAssigned",
        foreignField: "_id",
        as: "trainersAssigned",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "studentId",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $project: {
        _id: 1,
        //studentId: 1,
        name: 1,
        age: 1,
        email: 1,
        track: 1,
        lastEvaluated: 1,
        "trainersAssigned._id": 1,
        "trainersAssigned.name": 1,
        "student._id": 1,
        "student.name": 1,
        "student.email": 1,
      },
    },
  ]);
  students = students.map((employee: IUser) => {
    return {
      ...employee,
      averages: averages.find(
        (re: { _id: string }) => re._id.toString() === employee._id.toString()
      ),
    };
  });
  return students;
};

const getHistoryRatings = (studentId: string) =>
  formModel.aggregate([
    { $unwind: "$rating" },
    { $match: { studentId: new ObjectId(studentId) } },
    {
      $lookup: {
        from: "tracks",
        localField: "track",
        foreignField: "_id",
        as: "track",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "trainersAssigned",
        foreignField: "_id",
        as: "trainersAssigned",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "studentId",
        foreignField: "_id",
        as: "studentId",
      },
    },
  ]);

export default {
  create,
  getAll,
  addDate,
  pushRating,
  getOne,
  getAverage,
  getHistoryRatings,
};
