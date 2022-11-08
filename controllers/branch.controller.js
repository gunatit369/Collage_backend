import BranchDAO from "../dao/branchDAO.js";

export default class BranchController{
    static async apiAddBranchData(req,res,next){
        try{
            console.log(req.body);
            await BranchDAO.addBranchData(req.body);
        }catch(e){
            console.error(e);
        }
    }
}