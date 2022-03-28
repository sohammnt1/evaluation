import tracksRepo from "./track.repo";

const displayTracks = async () => {
        const result = tracksRepo.getAll();
        return result;
    }

export default {
    displayTracks,
}