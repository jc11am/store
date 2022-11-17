const User = require("../model/user")


const signUp =async function(req, res){
    const { name, email, password } = req.body
    try {
        const user = await User.signup( name, email, password )
        res.status(200).json(name, email, password )
    } catch (error) {
        
    }
}

module.exports = {
    signUp
}