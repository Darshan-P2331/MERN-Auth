import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel";
import generateToken from "../utils/generateToken";
import RequestWithUser from "interfaces/requestWithUser";
import { ObjectId } from "mongoose";

// @desc Auth user/set token
// route POST /api/users/auth
// @access Public
const authUser = expressAsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc Register new user
// route POST /api/users
// @access Public
const registerUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      res.status(400);
      throw new Error("User alreaady exists");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      generateToken(res, user.__id as ObjectId);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
);

// @desc Logout user
// route POST /api/users/logout
// @access Public
const logoutUser = expressAsyncHandler(async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out" });
});

// @desc Get user profile
// route POST /api/users/profile
// @access Private
const getUserProfile = expressAsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const { _id, name, email } = req.user;
    res.status(200).json({ _id, name, email });
  }
);

// @desc Update user profile
// route PUT /api/users/profile
// @access Private
const updateUserProfile = expressAsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const user = await User.findById(req.user._id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      
      if (req.body.password) {
        user.password = req.body.password
      }
      const updateUser = await user.save()
      res.status(200).json({
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
      })
    } else {
      res.status(404)
      throw new Error("User not found")
    }
    res.status(200).json({ message: "update Profile" });
  }
);

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
