import express from 'express'
import { getMe, signup } from '../controllers/auth.controller.js'
import { login } from '../controllers/auth.controller.js'
import { logout } from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = express.Router()

router.get("/me",protectRoute, getMe)
//The reason we use protectRoute in is to secure the /me route so that
//only authenticated (logged-in) users can access it.
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

export default router;