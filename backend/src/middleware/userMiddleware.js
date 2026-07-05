const jwt = require("jsonwebtoken");
const User = require('../models/userSchema');
const userMiddleware = async(req, res, next)=>{
    try{
        const {token} = req.cookies;
        if(!token) throw new Error("Invalid Token")

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const {_id} = payload;

        if(!_id) throw new Error("Invalid token")
        
        const result = await User.findById(_id);
        if(!result) throw new Error("User doesn't exist")

        req.result = result;
        next();
    }
    catch(err) {res.status(401).send("Error: "+err.message)};
}

module.exports = userMiddleware