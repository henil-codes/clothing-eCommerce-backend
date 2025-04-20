import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user data from the frontend
  // validate the data - not empty?
  // check if user already exist? - username, email
  // check for images, and avtar
  // upload it to cloudinary, check avtar is uploded?

  // create user object - create entry in db
  // remove password and refrest token field from response
  // check for user creation then return the response

  const { fullname, username, email, password } = req.body;
  console.log("Email:", email);

  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const exitstedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (exitstedUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  if (!coverImageLOcalPath) {
    throw new ApiError(400, "Cover image is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar did not successfully uploaded");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while register a user");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )
});

export default registerUser;
