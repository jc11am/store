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
        //craete token
        const token = createToken(user._id)
        //send http onlt cookie
        res.cookie("token", token, {
           path: "/",
           httpOnly: true,
           expires: new Date(Date.now() + 1000 * 86400),
           sameSite: "none",
           secure: true
        });
        res.status(200).json({user, token})
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const logIn = async function(req, res) {
    const {email, password} = req.body
    try {
        const user = await Usersign.login(email, password)
        //create token
        const token = createToken(user._id)
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),
            sameSite: "none",
            secure: true
            
        })
        res.status(200).json({user, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    signUp,
    logIn
}