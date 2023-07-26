import e from "express";
import SignDAO from "../dao/signupDAO.js";
export default class SignController{
    static async apiAddSignup(req,res,next){
        try {
            console.log(req.body);
            const response = await SignDAO.addSignup(req.body);
            if (response.insertedId){
                res.json(response.insertedId);    
            }else{
                res.json(response);
            }
        } catch (error) {
            res.status(500).json({error:e.message});   
        }
    }

    static async apiGetSignup(req,res,next){
        try{
            const {signUpData} = await SignDAO.getSignup();
            let response = {
                sign : signUpData
            }
            res.json(response);
        }catch(error){
            res.status(500).json({error:e.message});
        }
    }

    static async apiCheckEmailExitance(req,res,next){
        try {
            const response = await SignDAO.emailExistance(req.body);
            res.json(response);
        } catch (error) {
            res.status(500).json({error:e.message});
        }
    }
}
