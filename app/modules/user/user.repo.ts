import userModel from "./user.schema";
import { IUser } from "./user.types";
import {ObjectId} from "mongodb"

const create = (user: IUser) => userModel.create(user);

const getAll = () => userModel.find()

const getOne = (employeeId: string) => userModel.findOne({ employeeId: employeeId })

const getbyRole = (role: string) => userModel.find({
    $and: [
        { role: new ObjectId(role) }
        // { deleted: false }
    ]
});

const update = (updated_data: IUser) => userModel.updateOne({
    employeeId: updated_data.employeeId
}, updated_data);

const deleteOne = (employeeId: string) => userModel.updateOne(
    { employeeId: employeeId },
    { deleted: 'true' }
);

const displayById = (employeeId: string) => userModel.find({ employeeId: employeeId });

export default {
    create,
    getAll,
    getOne,
    update,
    getbyRole,
    deleteOne,
    displayById
}