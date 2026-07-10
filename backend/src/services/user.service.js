const User = require("../models/userSchema")
const bcrypt = require("bcrypt")

const createUser = async (data)=>{
    const existingUser = await User.findOne({email: data.email});
    if(existingUser){
        throw new Error("Email already exists")
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword

    const user = await User.create(data)
    return user;
}

const getUsers = async()=>{
    return await User.find();
}

const getUserById = async(id)=>{
    return await User.findById(id)
}

const updateUser = async(id, data)=>{
    //{new: True, to give the updated data back in return }
    return await User.findByIdAndUpdate(id, data, {new: true})
}

const changeUserStatus = async(id)=>{
    const user = await User.findById(id)
    user.isActive = !user.isActive
    await user.save();
    return user;
}

const deleteUser = async(id)=>{
    return await User.findByIdAndDelete(id)
}

module.exports = {createUser, getUsers, getUserById, updateUser, changeUserStatus, deleteUser}