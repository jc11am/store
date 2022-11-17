const dotenv = require("dotenv").config();
const express = require ("express")
const mongoose = require("mongoose")
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

//routes
app.use("/api/user", userRoutes)


//connect to Database
mongoose.connect(process.env.Database)
    .then(function(){

        // listen to port
        app.listen(process.env.PORT || 4000, function(){
            console.log("success")
        })
    })
    .catch(function(error){
        console.log(error.message)
    })