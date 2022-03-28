import trackModel from "../modules/track/track.schema"
import roleModel from "../modules/role/role.schema"
import { ObjectId } from 'mongodb'

export const populate = async () => {
    try {
        const allRoles = () => { return roleModel.find({}, { name: 1, _id: { "$toString": "$_id" } }).exec() }
        const allTracks = () => { return trackModel.find({}, { name: 1, _id: { "$toString": "$_id" } }).exec() }
        
        const assignVariable = async () => {
            try {
                const allRolesArr = await allRoles();
                const allTrackArr = await allTracks();
                return [allRolesArr, allTrackArr]
            }
            catch (error) {
                throw error;
            }
        }
        const variables = await assignVariable()
        //console.log(variables)
    }
    catch (error) {
        throw error;
    }
}

// console.log(populatedVariableArray)
//get return value of populate function i.e. Array in populatedVariableArray.

let populatedVariableArray:any = [
    [
      { name: 'Admin', _id: new ObjectId("623feb17b1e0d6a05ef33c9e") },
      { name: 'Trainer', _id: new ObjectId("623feb2bb1e0d6a05ef33c9f") },
      { name: 'Student', _id: new ObjectId("623febcbb1e0d6a05ef33caa") }
    ],
    [
      { name: 'Node', _id: new ObjectId("623feb4ab1e0d6a05ef33ca2") },
      { name: 'Angular', _id: new ObjectId("623feb5db1e0d6a05ef33ca3") },
      { name: 'DotNet', _id: new ObjectId("623feb74b1e0d6a05ef33ca4") },
      { name: 'React', _id: new ObjectId("623feb96b1e0d6a05ef33ca5") },
      { name: 'Java', _id: new ObjectId("623febabb1e0d6a05ef33ca6") },
      { name: 'DevOps', _id: new ObjectId("623febb6b1e0d6a05ef33ca7") }
    ]
  ]

const convertArrayToObject = (array: any, key: any) => {
    const initialValue = {};
    return array.reduce((obj: any, item: any) => {
        return {
            ...obj,
            [item[key]]: item._id.toHexString(),
        };
    }, initialValue);
};

const allRollsObject = convertArrayToObject(populatedVariableArray[0], "name")
const allTracksObject = convertArrayToObject(populatedVariableArray[1], "name")
export const ROLES = allRollsObject
export const TRACKS = allTracksObject
