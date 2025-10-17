import {asyncHandler} from "../Utilities/AsyncHandler.js"
import {ApiError} from "../Utilities/ApiError.js"
import {User} from "../Models/User.model.js";
import {ApiResponse} from "../Utilities/ApiResponse.js"
import {uploadOnCloudinary} from "../Utilities/Cloudinary.js"
import jwt from 'jsonwebtoken'
import mongoose from "mongoose"

const createAccessAndRefreshToken = async(userId)=>{
  try{
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave:false})

    return {accessToken, refreshToken}

  }catch(error){
    throw new ApiError(501, "Something went wrong at time of creation of access token and refresh token",error.message)
  }
}

const options = {
  httpOnly:true,
  secure:false
}

const registerUser = asyncHandler(async(req, res)=>{
  const {fullName, email, password, bio} = req.body
  
  console.log(req.body, req.file)
  
  if(fullName === "" || email === "" || password ==="" || bio === "" ){
    throw new ApiError(401, "All fields required");
  }
  
 const user = await User.findOne({email})
 
 if(user){
   throw new ApiError(402, "User already existed")
 }
 
 const localProfilePath = req.file?.path  
 
 if(!localProfilePath){
   throw new ApiError(400, "Profile Photo is required")
 }
 
 const profilePhoto = await uploadOnCloudinary(localProfilePath)
 
 if(!profilePhoto){
   throw new ApiError(500, "Something went wrong at the time of photo upload")
 }
 
 const createdUser = await User.create({
   fullName,
   email,
   profilePhoto : profilePhoto.url,
   bio,
   password
 })
 
 const existenceUser = await User.findById(createdUser._id).select("-password -refreshToken")
 
 if(!existenceUser){
   throw new ApiError(500, "Difficulty in creating user")
 }
 
 return res.
 status(200)
 .json(new ApiResponse(200, existenceUser, "User created successfully"))
})

const loginUser = asyncHandler(async(req,res)=>{
  
  const {email, password} = req.body
  
  if(!email || !password){
    throw new ApiError(401, "All fields are required")
  }
  
  const user = await User.findOne({email})
  console.log(user)
  
  if(!user){
    throw new ApiError(404, "User not found")
  }
  
  const isPasswordCorrect = await user.isPasswordCorrect(password)
  
  if(!isPasswordCorrect){
    throw new ApiError(401, "Password is incorrect")
  }
  
 const {accessToken, refreshToken} = await createAccessAndRefreshToken(user._id)
 
   const loggedUser = await User.findById(user._id).select("-password -refreshToken");
 
 return res
 .status(200)
 .cookie("accessToken",accessToken, options)
 .cookie("refreshToken",refreshToken,options)
 .json(new ApiResponse(200, {
   loggedUser, refreshToken, accessToken
 }, "user logged in successfully"))
})

const getAllUsers = asyncHandler(async(req,res)=>{
  
  const allUsers = await User.find({_id:{$ne:req.user._id}}).select("-password -email -refreshToken")
  
  return res
  .status(200)
  .json(new ApiResponse(200, allUsers, "All users fetched successfully"))
  
})

const getUser = asyncHandler(async(req,res)=>{
  
  const user = await User.findById(req.user._id).select("-password -email -refreshToken")
  
  return res
  .status(200)
  .json(new ApiResponse(200, user, " user fetched successfully"))
})

export {
  registerUser,
  loginUser,
  getAllUsers,
  getUser
}
