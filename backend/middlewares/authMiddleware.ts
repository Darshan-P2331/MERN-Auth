import { NextFunction, Request, Response } from "express"
import asyncHandler from 'express-async-handler'
import DataStoredInToken from "interfaces/dataStoredInToken"
import RequestWithUser from "interfaces/requestWithUser"
import jwt from "jsonwebtoken"
import User from "../models/userModel"

export const protect = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let token;

    token = req.cookies.jwt
    if (token) {
        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET as string) as DataStoredInToken
            req.user = await User.findById(decode.userId)

            next()
        } catch (err) {
            res.status(401)
            throw new Error('Not authorized, invalid token')
        }
    } else {
        res.status(401)
        throw new Error('Not authorize, no token')
    }
})