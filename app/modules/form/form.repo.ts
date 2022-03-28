import formModel from "./form.schema";
import { IForm } from "./form.types";
import { ObjectId } from "mongodb"


const create = (form: IForm) => formModel.create(form);

const getAll = () => formModel.find()

const getOne = (formId: string) => formModel.find({ _id: formId })

const addDate = (ratingData: any) => formModel.updateOne({ _id: new ObjectId(ratingData.formId) }, { $set: { lastEvaluated: ratingData.currentEvaluation } })

const pushRating = (ratingData: any) => formModel.updateOne({ _id: new ObjectId(ratingData.formId) }, { $push: { rating: ratingData.rating } })

const getAverage = async (track: string, overallAverage: number, otherFilters: any) => {
    const result = await formModel.aggregate([
        { $unwind: "$rating" },
        {
            $group: {
                _id: "$_id",
                averageLogicRating: { $avg: '$rating.LogicRating' },
                averageCommunicationRating: { $avg: '$rating.CommunicationRating' },
                averageAssignmentRating: { $avg: '$rating.AssignmentRating' },
                averageProActivenessRating: { $avg: '$rating.ProActivenessRating' }
            }
        },
        {
            $project: {
                _id: 1,
                averageLogicRating: 1,
                averageCommunicationRating: 1,
                averageAssignmentRating: 1,
                averageProActivenessRating: 1,
                overallAverage: {
                    $avg: [
                        '$averageLogicRating',
                        '$averageCommunicationRating',
                        '$averageAssignmentRating',
                        '$averageProActivenessRating'
                    ]
                }
            }
        },
        { $match: { 'overallAverage': { $gte: overallAverage } } },
        { $project: { _id: 1, overallAverage: 1 } }
    ]);
    const ids = result.reduce((accumulator, currValue) => {
        accumulator.push(currValue._id);
        return accumulator;
    }, []);
    let students = await formModel.aggregate([
        {
            $match: {
                $or: [
                    { '_id': { $in: ids } },
                    { 'track': track }
                ]
            },
        },
        ...otherFilters
    ]);
    students = students.map((student: any) => {
        return {
            ...student,
            overallAverage: result.find((re: any) => re._id.toString() === student._id.toString()).overallAverage
        }
    });
    console.log(students);
    return students;
}

const getHistoryRatings = (studentId: any) => formModel.aggregate([
    { $unwind: "$rating" },
    { $match: { studentId: new ObjectId(studentId) } }
])
// 
// const filterAverage = (filters: any) => formModel.aggregate([
//     {
//         $project: {
//             name: 1,
//             email: 1,
//             age: 1,
//             ambienceRating: 1,
//             cleanlinessRating: 1,
//             serviceRating: 1,
//             overallRating: 1,
//             comments: 1,
//             createdAt: 1,
//             servicesAvailed : 1,
//             serviceBy : 1,
//             overallAverage: {
//                 $avg: [
//                     '$ambienceRating',
//                     '$cleanlinessRating',
//                     '$serviceRating',
//                     '$overallRating'
//                 ]
//             }
//         }
//     },
//     ...filters,
//     {
//         $lookup: {
//             from: 'users',
//             localField: 'serviceBy',
//             foreignField: '_id',
//             as: 'serviceBy'
//           }
//     },
//     {
//         $lookup: {
//             from: 'services',
//             localField: 'servicesAvailed',
//             foreignField: '_id',
//             as: 'servicesAvailed'
//           }
//     },
// ]);


export default {
    create,
    getAll,
    addDate,
    pushRating,
    getOne,
    getAverage,
    getHistoryRatings
    // getAveragePerForm,
    // filterAverage
}