import BranchDAO from "../dao/branchDAO.js";

export default class BranchController{
    static async apiAddBranchData(req,res,next){
        try{
            const response = await BranchDAO.addBranchData(req.body);
            res.json(response.insertedId)
        }catch(e){
            res.status(500).json({error:e.message});
        }
    }

    static async apiGetBranchData(req,res,next){
        try{
            const {branchData} = await BranchDAO.getBranchData();
            res.json(branchData);
        }catch(e){
            res.status(500).json({error:e.message})
        }
    }

    static async apiDeleteBranchData(req,res,next){
        try{
            const BranchId = req.query.id;
            const response = await BranchDAO.deleteBranchData(BranchId);
            res.json(response.acknowledged);
        }catch(e){
            res.status(500).json({error:e.message});
        }
    }

    static async apiUpdateBranchData(req,res,next){
        try{
            const response = await BranchDAO.updateBranchData(req.body);
            res.json(response.acknowledged);
        }catch(e){
            res.status(500).json({error:e.message});
        }
    }

    static async apiBranchName(req,res,next){
        try {
            const branchName = await BranchDAO.getBranchName()
            res.json(branchName);
        } catch (e) {
            res.status(500).json({error:e.message});
        }
    }

    static async apiSemester(req,res,next){
        try {
            let branchName = req.params.branchName;
            const semester = await BranchDAO.getSemester(branchName);
            res.json(semester);
        }catch(e){
            res.status(500).json({error:e.message});
        }
    }

    static async apiSubject(req,res,next){
        try {
            let branchName = req.params.branchName;
            let semester = req.params.semester;
            const subjects= await BranchDAO.getSubjects(branchName,semester);
            res.json(subjects);
        } catch (e) {
            res.status(500).json({error:e.message});
        }
    }

    static async apiFacultyId(req,res,next){
        try {
            let facultyName = req.params.facultyName
            const id = await BranchDAO.getFacultyId(facultyName);
            res.send(id)
        } catch (e) {
            res.status(500).json({error:e.message});
        }
    }

    static async apiGetNonAllocatedSubjects(req,res,next){
        try {
            const branchName = req.params.branchName
            const semester = req.params.semester
            const facultyId = req.params.facultyId
            const subject = req.params.subject
            const subjects = await BranchDAO.getNonAllocatedSubjects(facultyId,branchName,semester,subject)
            res.json(subjects)
        } catch (e) {
            res.status(500).json({error:e.message});
        }
    }
}