import { hash, compare } from "bcryptjs";
import userRepo from "./user.repo";
import { generateToken } from "../../utility/jwt";
import { IUser } from "./user.types";
import { generate } from 'generate-password'
import * as shortid from 'shortid';
import { transporter } from "../../utility/nodemailer";

const createUser = async (user: IUser) => {
    try {
        
        let password = generate({ length: 10, numbers: true });
        let employeeId = shortid.generate()
        const hashedPassword = await hash(password, 12);
        const userData = { ...user, ['password']: hashedPassword, employeeId: employeeId, deleted: false };
        const result = await userRepo.create(userData);

        var mailOptions = {
            from: "soham@coditas.com",
            to: userData.email,
            subject: 'Account Sucessfully Created',
            text: `Dear,${userData.name}. Your Account has been created here are the login credentials. UserId: ${userData.employeeId} Password:${password}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return result

    } catch (error) {
        throw error;
    }
}

const authenticateUser = async (employeeId: string, password: string) => {
    try {
        const user = await userRepo.getOne(employeeId);
        if (!user) throw new Error('User doesn\'t exists');
        const doMatch = await compare(password, user.password);
        if (!doMatch) throw new Error('Invalid Password');
        const result = generateToken(user);
        return result;
    } catch (error) {
        throw error;
    }
}

const displayUsers = async (roles: any) => {
    try {
        if(roles){
        const result = await userRepo.getbyRole(roles);
        return result;
        }
        else{
            const result = await userRepo.getAll();
            return result;
        }
    } catch (error) {
        throw error;
    }
}

const displayall = async () => {
    try {
            const result = await userRepo.getAll();
            return result;
    } 
    catch (error) {
        throw error;
    }
}

const editUser = async (updated_data: IUser) => {
    try {
        const result = await userRepo.update(updated_data);
        return result;
    } catch (error) {
        throw error;
    }
}

const deleteUser = async (employeeId: string) => {
    try {
        const result = await userRepo.deleteOne(employeeId);
        return result;
    } catch (error) {
        throw error;
    }
}

export default {
    createUser,
    authenticateUser,
    displayUsers,
    editUser,
    deleteUser,
    displayall
}