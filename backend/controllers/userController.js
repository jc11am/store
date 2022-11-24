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

const logedIn = async function(req, res) {
    const token = req.cookies.token

    if(!token) {
        return res.status(400).json({message: "Not Authenticated"})
    }
    const verified = await jwt.verify(token, process.env.Secret)
    if(verified) {
       return res.status(200).json(true)
    }
    return res.status(400).json(false)
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
};

const updateUser = async function(req, res) {
    const id = req.user._id

    try {
        const user = await Usersign.findById(id)
        if(user) {
            const { name, email,photo, phone, bio } = user;
            user.email = email;
            user.name = req.body.name || name;
            user.phone = req.body.phone || phone;
            user.photo = req.body.photo || photo;
            user.bio = req.body.body || bio;

            const updated = await user.save()
            return res.status(200).json({
               name: updated.name, 
               email: updated.email,
               phone: updated.phone,
               photo: updated.photo,
               bio: updated.bio     
            })
        }
    } catch (error) {   
        res.status(400).json({message: "Not Authunticated"})
    }
}

const changepassword = async function(req, res) {
    const id = req.user._id
    const { oldPassword, password } = req.body

    try {
        const user = await Usersign.findById(id)
        //validation
        if(!oldPassword || !password){
            return res.status(400).json({message: "All filleds are required"})
        }
        const compare = await jwt.compare(oldPassword, user.password)
        if(!compare){
            return res.status(400).json({message: "Password does not match"})
        }
        if(user && compare){
            user.password = password
            await user.save()
            return res.status(200).json({message: "Password changed"})
        }

    } catch (error) {
        res.status(400).json({message: "Password incorrect"})
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
};

module.exports = {
    signUp,
    logIn,
    logOut,
    getUser,
    logedIn,
    updateUser,
    changepassword
}