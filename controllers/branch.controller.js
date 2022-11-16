import BranchDAO from "../dao/branchDAO.js";

export default class BranchController{
    static async apiAddBranchData(req,res,next){
        try{
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

    static async apiDeleteBranchData(req,res,next){
        try{
            const BranchId = req.query.id;
            // console.log(studentId);
            await BranchDAO.deleteBranchData(BranchId);
            res.json({status:"success"});
        }catch(e){
            res.status(500).json({error:e.message});
        }
    }

    static async apiUpdateBranchData(req,res,next){
        try{
            await BranchDAO.updateBranchData(req.body);
            res.json({status:"success"});
        }catch(e){
            res.status(500).json({error:e.message});
        }
    }
}