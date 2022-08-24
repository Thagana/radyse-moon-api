import UserModel from "../data/infrastructure/db/entities/Mongodb/Users";

const updateUserDetails = async (firstName: string, lastName: string, id: string) => {
    try {
        await UserModel.findOne({ _id: id  }).update({
            first_name: firstName,
            last_name: lastName
        })
        return true
    } catch (error) {
        console.log(error);
        return false;
    }
}

export default updateUserDetails