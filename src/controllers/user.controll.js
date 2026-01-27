import asyncHandler from "../utils/asyncHandler.js" 
import {ApiError} from  "../utils/apiError.js"
import {User} from "../models/user.model.js" 
 import {uploadOnClouninary} from "../utils/cloundinary.js"


 const registerUser= asyncHandler (async (req, res)=>{
   // get user details from  frontend 
   //  Validation  not empty
   // check i user already exist:usernam ,email
   //check for  images,check or avatar 
   // upload  the ile cloundinary 
    // create user object- create entry in db 
    // remove password and refresh token field from response 
    //check for user creation 
    // return  res
    
    const {fullName,email,username,password}= req.body
      console.log("email:",email)
    //  if (fullName===""){
    //     throw new ApiError(400,"fullname is required")
    //  }
     if(
        [fullName,email,username,password].some((field)=>
        field?.trim() === "")
       )  
       {
    throw new ApiError(400,"all fields are required")
       }
       const existedUser=  User.findOne({
        $or:[{email},{username}]
       })
       if(existedUser){
         throw  new ApiError (409,"User with email or username already exists")
       }
        const avatarLocalPath=req.files?.avatar[0]?.path;
         const coverImageLocalPath= req.files?.coverImage[0]?.path;
    
        if(!avatarLocalPath ){
            throw  new ApiError (400,"avatar file is required ")
        }
        
        const avatar= await  uploadOnClouninary(avatarLocalPath)
        const coverImage= await uploadOnClouninary (coverImageLocalPath )

         if(!avatar){
             throw new ApiError(400, "avatar  file is required")
         }
        
         User.create({
            fullName,
            avatar: avatar.url,
            coverImage:coverImage.url?.url|| "",
            email,
            password,
            username:username.toLowerCase()
         })

         User.findById(User._id)

 }) 

  export  {registerUser}