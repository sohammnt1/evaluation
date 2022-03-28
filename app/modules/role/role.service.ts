import roleRepo from "./role.repo";

const displayRoles = async () => {
        const result = roleRepo.getAll();
        return result;
    }

export default {
    displayRoles,
}