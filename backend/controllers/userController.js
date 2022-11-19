const Usersign = require("../model/user")


const signUp = async function(req, res){
    const { name, email, password } = req.body
    try {
        //save user to DB
        const user = await Usersign.signup( name, email, password )
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    signUp
}