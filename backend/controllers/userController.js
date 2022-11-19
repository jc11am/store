const Usersign = require("../model/user")
const jwt = require("jsonwebtoken")

const createToken = function(_id) {
    return jwt.sign({_id}, process.env.Secret, {expiresIn : "2d"})
}


const signUp = async function(req, res){
    const { name, email, password } = req.body
    try {
        //save user to DB
        const user = await Usersign.signup( name, email, password )
        const token = createToken(user._id)
        res.status(200).json({user, token})
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    signUp
}