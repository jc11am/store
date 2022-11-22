const Usersign = require("../model/user")
const jwt = require("jsonwebtoken")

const createToken = function(_id) {
    return jwt.sign({_id}, process.env.Secret, {expiresIn : "2d"})
}


const getUser = async function(req, res) {
    const { _id } = req.user
    const user = await Usersign.findById({_id})

    if (!user){
        res.status(400).json({message: "User not found"})
    }
    res.status(200).json({user})
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

const logOut = async function(req, res) {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true       
    })
    return res.status(200).json({message: "Logout Successfully"})
}

module.exports = {
    signUp,
    logIn,
    logOut,
    getUser
}