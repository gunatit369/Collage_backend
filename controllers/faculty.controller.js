import facultyDAO from "../dao/facultyDAO.js";

export default class FacultyController {
    static async apiGetBranchData(req,res,next){
        // let filters = {};
        // if (req.query.branch){
        //     filters.branch = req.query.branch
        // }
        console.log(req.body);
        const branchData = await facultyDAO.getBranchData();

        let response = {
            branch : branchData
        }
        res.json(response);
    }

    static async apiGetBranch(req,res,next){
        const branchName = await facultyDAO.getBranchName()
        let response = {
            branchName : branchName 
        }
        res.json(response);
    }

    static async apiGetSemester(req,res,next){
        let branchName = req.params.branchName
        const semester = await facultyDAO.getSemester(branchName)
        let response = {
            sem :semester
        }
        res.json(response)
    }

    static async apiGetSubject(req,res,next){
        let semester = req.params.semester
        let branchName = req.params.branchName
        const subjects = await facultyDAO.getSubjects(semester,branchName);
        let response = {
            subjects: subjects
        }
        res.json(response);
    }

    static async apiAddFaculty(req,res,next){
        try {
            await facultyDAO.addFaculty(req.body);
            res.json({status:"success"}) 
        } catch (error) {
            res.status(500).json({error:e.message})
        }
    }

    static async apiGetFaculty(req,res,next){
        const {facultyData} = await facultyDAO.getFaculty();
        let response = {
            faculty : facultyData
        }
        res.json(response);
    }

    static async apiUpdateFaculty(req,res,next){
        try{
            await facultyDAO.updateFacultyData(req.body);
            res.json({status:"success"});
        }catch(e){
            res.status(500).json({error:e.message});
        }
    }

    static async apiDeleteFaculty(req,res,next){
        try{
            const facultyId = req.query.id;
            // console.log(studentId);
            await facultyDAO.deleteFacultyData(facultyId);
            res.json({status:"success"});
        }catch(e){
            res.status(500).json({error:e.message});
        }
    }
}