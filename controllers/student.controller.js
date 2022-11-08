import StudentDAO from "../dao/studentDAO.js";

export default class StudentController{
    static async apiAddStudentData(req,res,next){
        try{
            // console.log(req.body);
            // var data = Object.entries(req.body)
            await StudentDAO.addStudentData(req.body);
            res.json({status:"success"}) 
        }catch(e){
            res.status(500).json({error:e.message})
        }
    }

    static async apiGetStudentData(req,res,next){
        const {studentData} = await StudentDAO.getStudentData();
        let response = {
            students : studentData
        }
        res.json(response);
    }

    static async apiDeleteStudentData(req,res,next){
        try{
            const studentId = req.query.id;
            // console.log(studentId);
            await StudentDAO.deleteStudentData(studentId);
            res.json({status:"success"});
        }catch(e){
            res.status(500).json({error:e.message});
        }
    }

    static async apiUpdateStudentData(req,res,next){
        try{
            await StudentDAO.updateStudentData(req.body);
            res.json({status:"success"});
        }catch(e){
            res.status(500).json({error:e.message});
        }
    } 
}
