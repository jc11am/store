const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
      },
      email: {
        type: String,
        required: [true, "Please add a email"],
        unique: true,
        trim: true,
      },
      password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password must be up to 6 characters or above"],
      },
      photo: {
        type: String,
        required: [true, "Please add a photo"],
        default: "https://i.ibb.co/4pDNDk1/avatar.png",
      },
      phone: {
        type: String,
        default: "+234",
      },
      bio: {
        type: String,
        maxLength: [250, "Bio must not be more than 250 characters"],
        default: "bio",
      },
    },
    {
      timestamps: true,
    }
  );

  userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
      return next();
    }
        //hash password
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(this.password, salt)
    this.password = hashed;
    next()
  })


  userSchema.statics.signup = async function( name, email, password ){
    //check if filled is empty
    if(!name || !email || !password){
      throw Error ("Fill required filled")
    }
    //check password length
    if(password.length < 6 ){
      throw Error ("Password must be up to 6 characters or above")
    }
    //check if email already exist
    const userMail = await this.findOne({email})
    if(userMail){
      throw Error ("Email already in use")
    }
    //create new user
    const newUser = await this.create({name, email, password})
    return newUser
  }

  const Usersign = mongoose.model("Usersign", userSchema);

  module.exports = Usersign;