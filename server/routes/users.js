import express from "express"
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

/*READ*/
router.get("/:id",verifyToken,getUser)
router.get("/:id/friends",verifyToken,getUserFriends)

/*PATCH*/
router.patch("/:id/:friendsId",verifyToken,addRemoveFriend)

export default router;