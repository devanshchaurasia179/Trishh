import {upsertStreamUser} from "../lib/stream.js"
import User from "../models/user.js";
import jwt from "jsonwebtoken"
export async function signup(req,res){
    const {email,password,fullName}=req.body
    try {
        if(!email || !password || !fullName){
            return res.status(400).json({message:"All Fields are required"})
        }
        if(password.length<6){
         return res.status(400).json({message:"Password Must be Greater than 6 charachters"})

        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({ message: "Invalid email format" });
}

const existingUser=await User.findOne({email});
if(existingUser){
    return res.status(400).json({ message: "Email Already Exists,Please Use Another Email" });
}

const idx=Math.floor(Math.random()*100)+1;
const randomAvatar=`https://avatar.iran.liara.run/public/${idx}.png`

const newUser=await User.create({
    email,
    fullName,
    password,
    profilePic:randomAvatar,
})
try {
    await upsertStreamUser({
    id:newUser._id.toString(),
    name:newUser.fullName,
    image:newUser.profilePic || "",
})
console.log(`Stream user Created for ${newUser.fullName}`);
} catch (error) {
    console.log("Error in creating Stream User: ",error);
    
}

const token =jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
    expiresIn:"7d"
})

res.cookie("jwt",token,{
    maxAge:7*24*3600*1000,
    httpOnly:true,//Prevents XSS attacks,
    sameSite:"Strict",//prevents CSRF attack
    secure:process.env.NODE_ENV==="Production"
})
res.status(201).json({sucess:true,user:newUser})
    } catch (error) {
       console.log("Error in signup Controller",error) ;
       res.status(500).json({message:"Something Went Wrong "});
    }
   
}
export  async function login(req,res){
    try {
        const{email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All Fields Are Required"})
            
        }
        const user =await User.findOne({email});
        if(!user) return res.status(401).json({message:"Invalid Email or Password Recheck your credentials"});

        const isPasswordCorrect= await user.matchPassword(password)
        if(!isPasswordCorrect) return res.status(401).json({message:"Invalid Email or Password Recheck your credentials"});
      
    const token =jwt.sign({userId: user._id},process.env.JWT_SECRET_KEY,{
    expiresIn:"7d",
    })
        
res.cookie("jwt",token,{
    maxAge:7*24*3600*1000,
    httpOnly:true,//Prevents XSS attacks,
    sameSite:"Strict",//prevents CSRF attack
    secure:process.env.NODE_ENV==="Production"
})

res.status(200).json({sucess:true,user});

    } catch (error) {
       console.log("Error in signup Controller",error) ;
       res.status(500).json({message:"Something Went Wrong "}); 
    }

  
}
export function logout(req,res){
    res.clearCookie("jwt")
    res.status(200).json({sucess:true,message:"Logout Succesful"});
}
export async function onboard(req,res){
        try {
            const userId=req.user._id;
            const {fullName,bio,expertise,learningGoals}=req.body;

            if(!fullName || !bio || !expertise ||!learningGoals){
                return res.status(400).json({
                    message:"All fields are required",
                    missingFields: [
                        !fullName && "fullName",
                        !bio && "bio",
                        !expertise && "Expertise",
                        !learningGoals && "learning Goals",
                    ].filter(Boolean)
                });

            }

            const updatedUser=await User.findByIdAndUpdate(userId,{
                ...req.body,
                isOnboarded:true,
            },{new:true}
        )

        if(!updatedUser){
            return req.status(404).json({message:"User not found"})
        }


        try {
            await upsertStreamUser({
                id:updatedUser._id.toString(),
                name:updatedUser.fullName,
                image: updatedUser.profilePic || "",
            })
            console.log(`Stream User Updated after onboarding for ${updatedUser.fullName}`);
            
        } catch (streammerror) {
            console.log("Error updating Stream user during onboarding: ",streammerror.message)
        }


        res.status(200).json({sucess:true,user:updatedUser})
        } catch (error) {
            console.error("Onboarding Error: ",error);
            res.status(500).json({message:"Internal Server Error"});
            
        }
} 
//Logout is not necessory to be async