import facultyDAO from "../dao/facultyDAO.js";
export default class FacultyController {
    static async apiGetSubject(req,res,next){
        let semester = req.params.semester
        let branchName = req.params.branchName
        const subjects = await facultyDAO.getSubjects(semester,branchName);
        res.json(subjects);
    }

    static async apiAddFaculty(req,res,next){
        try {
            const response = await facultyDAO.addFaculty(req.body);
            res.json(response.insertedId); 
        } catch (error) {
            res.status(500).json({error:e.message});
        }
    }

    static async apiGetFaculty(req,res,next){
        try {
            const facultyData = await facultyDAO.getFaculty();
            res.json(facultyData);
        } catch (error) {
            res.status(500).json({error:error.message});
        }
    }

    static async apiUpdateFaculty(req,res,next){
        try{
            const response = await facultyDAO.updateFacultyData(req.body);
            res.json(response.acknowledged);
        }catch(e){
            res.status(500).json({error:e.message});
        }
    }

    static async apiDeleteFaculty(req,res,next){
        try{
            const facultyId = req.query.id;
            const response = await facultyDAO.deleteFacultyData(facultyId);
            res.json(response.acknowledged);
        }catch(e){
            res.status(500).json({error:e.message});
        }
    }
}