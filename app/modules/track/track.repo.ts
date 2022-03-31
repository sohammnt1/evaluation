import trackModel from "./track.schema";

const getAll = () => trackModel.find();

export default {
  getAll,
};
