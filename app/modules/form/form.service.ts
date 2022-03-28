import formRepo from "./form.repo";
import { IForm } from "./form.types";
import { ObjectId } from "mongodb"
import { ROLES } from "../../utility/db_constants";

const createForm = async (form: IForm) => {
    try {
        const result = await formRepo.create(form);
        return result
    } catch (error) {
        throw error;
    }
}

const displayForms = async () => {
    const result = formRepo.getAll();
    return result;
}

const addRating = async (ratingData: any) => {
    const formData = await formRepo.getOne(ratingData.formId)
    const DateDifference = getNumberOfDays(formData[0].lastEvaluated, ratingData.currentEvaluation)
    let result
    if (DateDifference >= 7) {
        let dateAddition = await formRepo.addDate(ratingData);
        result = await formRepo.pushRating(ratingData)
    }
    return result;
}

const getAverage = async (filter: any, role: string, id: string) => {

    let { track, overallAverage, page, itemsPerPage } = filter;
    const filters = [];

    if (page && itemsPerPage) {
        filters.push({ $skip: (+page - 1) * +itemsPerPage });
        filters.push({ $limit: +itemsPerPage });
    }
    let updatedResult = []
    let result = await formRepo.getAverage(track, +overallAverage, filters);
    if (role === ROLES.Admin) {
        // console.log("Admin")
        return result;
    }
    else {
        for (let r of result) {
            const ids = r.trainersAssigned.map((id: any) => id.toString());
            if (ids.includes(id.toString())) {
                updatedResult.push(r);
            }
        }
        return updatedResult;
    }
}

const getHistoryRatings = async (studentId: any) => {
    const result = formRepo.getHistoryRatings(studentId);
    return result;
}

// const filterAverage = async (filter: any) => {
//     const { fromDate, toDate, overallAverage, serviceBy } = filter;
//     let { servicesAvailed, page, itemsPerPage } = filter;
//     const filters = [];
//     const filterQuery = [];

//     if (fromDate) {
//         filterQuery.push({ 'createdAt': { $gte: new Date(fromDate) } });
//     }
//     if (toDate) {

//         filterQuery.push({ 'createdAt': { $lt: new Date(toDate) } });
//     }
//     if (servicesAvailed) {
//         servicesAvailed = servicesAvailed.map((service: string) => new ObjectId(service));
//         filterQuery.push({ 'servicesAvailed': { $in: servicesAvailed } });
//     }
//     if (serviceBy) {
//         filterQuery.push({ 'serviceBy': new ObjectId(serviceBy) });
//     }
//     if (overallAverage) {
//         filterQuery.push({ 'overallAverage': { $gte: +overallAverage }})
//     }
//     const match = {
//         $match: {
//             $and: filterQuery
//         }
//     };
//     if (filterQuery.length && match && match.$match.$and) {
//         filters.push(match);
//     }
//     if (page && itemsPerPage) {
//         page = Math.floor(page)
//         itemsPerPage = Math.floor(itemsPerPage)
//         filters.push({ $skip: (page - 1) * itemsPerPage });
//         filters.push({ $limit: itemsPerPage });
//     }
//     return formRepo.filterAverage(filters);
// }

function getNumberOfDays(start: Date, end: Date) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
}

export default {
    createForm,
    displayForms,
    addRating,
    getAverage,
    getHistoryRatings
    // getAveragePerForm,
    // filterAverage
}