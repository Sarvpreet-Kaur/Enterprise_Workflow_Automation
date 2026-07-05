const validate = require('../utils/validate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema')

const register = async(req, res)=>{
    try{
        validate(req.body);

        const {name, emailId, password} = req.body;

        req.body.password = await bcrypt.hash(password, 10);

        const user = await User.create(req.body)
        const token = await jwt.sign({_id:user._id, emailId: emailId, role: 'employee'},process.env.JWT_SECRET_KEY, {expiresIn: 60*60});
        const reply = {
            name: name,
            emailId: emailId,
            _id: user._id,
            role: user.role
        }

        res.cookie('token', token, {maxAge: 60*60*60});
        res.status(201).json({
            user: reply,
            message: "Successfully registered and login"
        })
    }
    catch(err){res.status(400).send("Error: "+err.message)}
}

const login = async(req, res)=>{
    try{
        const {emailId, password} = req.body;

        if(!emailId) throw new Error("Invalid Credentials");
        if(!password) throw new Error("Invalid Credentials");

        const user = await User.findOne({emailId});

        const matched = await bcrypt.compare(password, user.password);
        if(!matched) throw new Error("Invalid Credentials");

        const token = await jwt.sign({_id:user._id, emailId: emailId, role: user.role},process.env.JWT_SECRET_KEY, {expiresIn: 60*60});

        const reply = {
            name: user.name,
            emailId: user.emailId,
            _id: user._id,
            role: user.role
        }

        res.cookie('token', token, {maxAge: 60*60*60});
        res.status(201).json({
            user: reply,
            message: "Successful login"
        })
    }
    catch(err) {res.status(401).send("Error: "+err.message)}
}

const logout = async(req, res)=>{
    try{
        const {token} = req.cookies;
        const payload = jwt.decode(token)

        res.cookie("token", null, {expires: new Date(Date.now())});
        res.status(200).send("Successful log out")
    }
    catch(err) {res.status(503).send("Error: "+err.message)};
}

const adminRegister = async(req, res)=>{
    try{
        validate(req.body);

        const {name, emailId, password} = req.body;
        const existingAdmin = await User.findOne({role: 'admin'});
        console.log(existingAdmin)

        if(existingAdmin){
            const {token} = req.cookies;

            if(!token) return res.status(401).send("Unauthorized: No token provided");

            let decoded;
            try{
                decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            }catch(err) {return res.status(401).send("Unauthorized: Invalid token");}

            if(decoded.role != 'admin') return res.status(403).send("Forbidden: Only admins are allowed");
        }

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'admin';

        const user = await User.create(req.body)
        // const token = await jwt.sign({_id:user._id, emailId: emailId, role: user.role},process.env.JWT_SECRET_KEY, {expiresIn: 60*60});
        const reply = {
            name: name,
            emailId: emailId,
            _id: user._id,
            role: user.role
        }

        // res.cookie('token', token, {maxAge: 60*60*60});
        res.status(201).json({
            user: reply,
            message: "Successfully registered admin"
        })
    }
    catch(err){res.status(400).send("Error: "+err.message)}
}

const setupAdmin = async (req, res) => {
    try {
        const { name, emailId, password } = req.body;

        //for the first time secret key should be present in header
        if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
            return res.status(403).send("Unauthorized: Invalid secret");
        }
        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            return res.status(403).send("Admin already exists");
        }

        // Validate input
        if (!name || !emailId || !password) {
            return res.status(400).send("All fields are required");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const admin = await User.create({
            name,
            emailId,
            password: hashedPassword,
            role: 'admin'
        });

        res.status(201).json({
            message: "Admin created successfully",
            adminId: admin._id
        });

    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
}

const deleteProfile = async(req, res)=>{
    try{
        const userId = req.result._id;

        await User.findByIdAndDelete(userId);
        res.status(200).send("Deleted successfully")
    }
    catch(err) {res.status(500).send("Internal Server Error")}
}

const check = async(req, res)=>{
    try{
        const reply = {
            name: req.result.name,
            emailId: req.result.emailId,
            _id: req.result._id,
            role: req.result.role
        }

        res.status(200).json({
            user: reply,
            message: "Valid User"
        });
    }
    catch(err) {res.send(err.message + " Invalid User")}
}

const getProfile = async (req, res) => {
    const user = req.result;

    res.status(200).json({
        user: {
            name: user.name,
            emailId: user.emailId,
            age: user.age,
            role: user.role,
            photo: user.photo,
        }
    });
};

module.exports = {register, login, logout, adminRegister, setupAdmin, deleteProfile, check, getProfile};