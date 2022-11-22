const express = require("express");
const router = express.Router()
const { getUser,signUp, logIn, logOut } = require("../controllers/userController")
const auth  = require("../middleware/authMiddle")

router.get("/getuser",auth, getUser)
router.post("/signup", signUp)
router.post("/login", logIn)
router.get("/logout", logOut)


module.exports = router;