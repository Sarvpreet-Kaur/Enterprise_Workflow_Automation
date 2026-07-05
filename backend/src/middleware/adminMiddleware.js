const jwt = require("jsonwebtoken");
const User = require('../models/userSchema');

const adminMiddleware = async(req, res, next)=>{
    try{
        const {token} = req.cookies;

        const existingAdmin = await User.findOne({ role: 'admin' });
        //allow first admin creation
        if (!existingAdmin) {
            return next();
        }
        if(!token) throw new Error("Invalid Token")

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const {_id} = payload;

        if(!_id || payload.role!='admin') throw new Error("Invalid token")
        
        const result = await User.findById(_id);
        if(!result) throw new Error("User doesn't exist")

        req.result = result;
        next();
    }
    catch(err) {res.status(401).send("Error: "+err.message)};
}

module.exports = adminMiddleware