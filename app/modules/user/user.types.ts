export interface IUser {
    _id: string,
    employeeId: string,
    name: string,
    email: string,
    role: string,
    password: string,
    deleted: boolean,
}