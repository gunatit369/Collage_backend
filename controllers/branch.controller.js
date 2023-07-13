import BranchDAO from "../dao/branchDAO.js";

export default class BranchController{
    static async apiAddBranchData(req,res,next){
        try{
            const response = await BranchDAO.addBranchData(req.body);
            res.json(response.insertedId)
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

    static async apiBranchName(req,res,next){
        const branchName = await BranchDAO.getBranchName()
        // let response = {
        //     branchName : branchName 
        // }
        res.json(branchName);
    }

    static async apiSemester(req,res,next){
        try {
            let branchName = req.params.branchName
            const semester = await BranchDAO.getSemester(branchName)
            // let response = {
            //     sem :semester
            // }
            res.json(semester)
        }catch(e){
            res.status(500).json({error:e.message});
        }
    }

    static async apiSubject(req,res,next){
        let branchName = req.params.branchName
        let semester = req.params.semester
        const subjects= await BranchDAO.getSubjects(branchName,semester)
        // let response = {
        //     subject :subjects
        // }
        res.json(subjects)
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
        } catch (error) {
            console.log({error});
        }
    }
}