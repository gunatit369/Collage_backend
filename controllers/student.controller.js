import StudentDAO from "../dao/studentDAO.js";

export default class StudentController{
    static async apiAddStudentData(req,res,next){
        try{
            // console.log(req.body);
            // var data = Object.entries(req.body)
            const response = await StudentDAO.addStudentData(req.body);
            res.json(response.insertedId) 
        }catch(e){
            res.status(500).json({error:e.message})
        }
    }

    static async apiGetStudentData(req,res,next){
        const {studentData} = await StudentDAO.getStudentData();
        res.json(studentData);
    }

    static async apiDeleteStudentData(req,res,next){
        try{
            const studentId = req.query.id;
            const response = await StudentDAO.deleteStudentData(studentId);
            res.json(response.acknowledged);
        }catch(e){
            res.status(500).json({error:e.message});
        }
    }

    static async apiUpdateStudentData(req,res,next){
        try{
            const response = await StudentDAO.updateStudentData(req.body);
            res.json(response.acknowledged);
        }catch(e){
            res.status(500).json({error:e.message});
        }
    } 
}
