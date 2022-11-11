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

    static async apiGetBranchData(req,res,next){
        try{
            const {branchData} = await BranchDAO.getBranchData();
            let response = {
                branches : branchData
            }
            res.json(response);
        }catch(e){
            res.status(500).json({error:e.message})
        }
    }
}