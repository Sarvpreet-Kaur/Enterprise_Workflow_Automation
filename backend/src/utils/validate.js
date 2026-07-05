const validator = require('validator');

const validate = (data)=>{
    const mandatoryField = ['name', 'emailId', 'password'];
    const isAllowed = mandatoryField.every((k)=>Object.keys(data).includes(k));

    if(!isAllowed){
        throw new Error("Complete the required fields");
    }

    if(!validator.isEmail(data.emailId)){
        throw new Error("Invalid email");
    }

    if(!validator.isStrongPassword(data.password)){
        throw new Error("Passwords must be strong");
    }
}

module.exports = validate;