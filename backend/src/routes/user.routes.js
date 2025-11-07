import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getRecommendedUsers,getMyFriends,sendFriendRequest,getFriendRequest,acceptFriendRequest,getOutgoingFriendRequest } from "../controllers/user.controller.js";
const router=express.Router();


router.use(protectRoute)
 
router.get("/",protectRoute,getRecommendedUsers);
router.get("/friends",protectRoute, getMyFriends);  

router.post("/friend-request/:id",sendFriendRequest)
router.put("/friend-request/:id/accept",acceptFriendRequest)

router.get("/friend-request",getFriendRequest)
router.get("/outgoing-friend-request",getOutgoingFriendRequest)


export default router; 