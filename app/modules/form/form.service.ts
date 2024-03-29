import formRepo from "./form.repo";
import { IForm, Ifilter } from "./form.types";
import { ROLES } from "../../utility/db_constants";

const createForm = (form: IForm) => {
  form.lastEvaluated = new Date();
  const result = formRepo.create(form);
  return result;
};

const displayForms = (page: number, itemsPerPage: number) =>
  formRepo.getAll(page, itemsPerPage);

const addRating = async (ratingData: {
  formId: string;
  currentEvaluation: Date;
  rating: object;
}) => {
  // ratingData.currentEvaluation = new Date();
  ratingData.currentEvaluation = new Date("2022-05-20T04:35:11.194+00:00");
  const formData = await formRepo.getOne(ratingData.formId);
  const DateDifference = getNumberOfDays(
    formData[0].lastEvaluated,
    ratingData.currentEvaluation
  );
  let result;
  if (DateDifference >= 7) {
    await formRepo.addDate(ratingData);
    result = await formRepo.pushRating(ratingData);
    console.log(result);

    return result;
  }
  throw "Rating Cannot be added as date not exceeded by 7 days";
};

const getAverage = async (filter: Ifilter, role: string, id: string) => {
  let updatedResult = [];
  let result = await formRepo.getAverage(filter);
  for (let i in result) {
    console.log(i);

    result[i].averages.averageLogicRating = parseFloat(
      result[i].averages.averageLogicRating
    ).toFixed(2);
    result[i].averages.averageCommunicationRating = parseFloat(
      result[i].averages.averageCommunicationRating
    ).toFixed(2);
    result[i].averages.averageAssignmentsRating = parseFloat(
      result[i].averages.averageAssignmentsRating
    ).toFixed(2);
    result[i].averages.averageProactivenessRating = parseFloat(
      result[i].averages.averageProactivenessRating
    ).toFixed(2);
    result[i].averages.averageRating = parseFloat(
      result[i].averages.averageRating
    ).toFixed(2);
  }
  console.log(result);

  if (role === ROLES.Admin) {
    return result;
  } else {
    for (let r of result) {
      const ids = r.trainersAssigned.map((id: string) => id.toString());
      if (ids.includes(id.toString())) {
        updatedResult.push(r);
      }
    }
    return updatedResult;
  }
};

const getHistoryRatings = async (studentId: string) => {
  const result = formRepo.getHistoryRatings(studentId);
  return result;
};

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
  getHistoryRatings,
};
