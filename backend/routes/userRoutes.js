const express = require("express");
const router = express.Router()
const { getUser,signUp, logIn, logOut, logedIn, updateUser, changepassword } = require("../controllers/userController")
const auth  = require("../middleware/authMiddle")

router.get("/getuser",auth, getUser)
router.post("/signup", signUp)
router.post("/login", logIn)
router.get("/logout", logOut)
router.get("/logedin", logedIn)
router.patch("/update", auth, updateUser)
router.patch("/changepassword", auth, changepassword)



module.exports = router;