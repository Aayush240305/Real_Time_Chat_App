import {Router} from 'express'
import {registerUser, loginUser,getAllUsers} from '../Controllers/User.controller.js'
import {verifyUser} from '../Middlewares/Verify.middleware.js'
import {upload} from '../Middlewares/Multer.middleware.js'

const userRouter = Router()

userRouter.route("/register").post(upload.single("profilePhoto"), registerUser)

userRouter.route("/login").post(loginUser)

userRouter.route("/getUser").get(verifyUser,getAllUsers)

export default userRouter;