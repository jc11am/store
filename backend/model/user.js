const mongoose = require("mongoose")

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
        minLength: [6, "Password must be up to 6 characters"],
        maxLength: [23, "Password must not be more than 23 characters"],
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

  userSchema.statics.signup = async function( name, email, password ){
    //check if filled is empty
    if(!name || !email || !password){
      throw Error ("Fill required filled")
    }
    
    const userMail = await this.findOne({email})
    if(userMail){
      throw Error ("Email already in use")
    }

  }

  const User = mongoose.model("User", userSchema);

  module.exports = User;