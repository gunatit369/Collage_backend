import e from "express";
import SignDAO from "../dao/signupDAO.js";

export default class SignController{
    static async apiAddSignup(req,res,next){
        try {
            await SignDAO.addSignup(req.body);
            res.json({status:"success"});
        } catch (error) {
            res.status(500).json({error:e.message});   
        }
    }

    static async apiGetSignup(req,res,next){
        try{
            const {signUpData} = await SignDAO.getSignup()
            let response = {
                sign : signUpData
            }
            res.json(response)
        }catch(error){
            res.status(500).json({error:e.message});
        }
    }
}
