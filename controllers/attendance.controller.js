import attendanceDAO from "../dao/attendanceDAO.js";

export default class AttendanceController {
    static async apigetAllocatedFacultyBranch(req,res,next){
        const facultyId = req.params.id
        const branchData = await attendanceDAO.getAllocatedFacultyBranch(facultyId);
        res.json(branchData);
    }

    static async apiGetFacultySem(req,res,next){
        const branch = req.params.branch;
        const semesters = await attendanceDAO.getFacultySem(branch);
        res.json(semesters);
    }

    static async apiGetFacultySubject(req,res,next){
        const sem = req.params.semester;
        const subjects = await attendanceDAO.getFacultySubject(sem);
        res.json(subjects);
    }

    static async apiGetAttendanceData(req,res,next){
        const branch = req.params.branch;
        const sem = req.params.sem;
        const subject = req.params.subject;
        const date = req.params.date;
        const lectureNo = req.params.lectureNo
        const response = await attendanceDAO.searchInAttendance(branch,sem,subject,date,lectureNo)
        res.json(response)
    }

    static async apiAddAttendanceData(req,res,next){
        try {
            const response = await attendanceDAO.addAttendanceData(req.body)
            res.json(response.acknowledged)
        } catch (error) {
            console.log(`Unable to add attendance data: ${error}`);
        }
        // console.log(req.body);
    }

    static async apiUpdateAttendaceData(req,res,next){
        try {
            const response = await attendanceDAO.updateAttendanceData(req.body)  
            res.json(response.acknowledged) 
        } catch (error) {
            res.status(500).json({error:error.message});
        }
    }

    static async apiReport(req,res,next){
        try {
            // console.log(req.body);
            const branch = req.body.branch;
            const semester = req.body.semester;
            const dateFrom = new Date(req.body.dateFrom);
            const dateTo = new Date(req.body.dateTo)
            const response = await attendanceDAO.report(branch,semester,dateFrom,dateTo);
            res.json(response)
            // const response = await 
        } catch (error) {
            res.status(500).json({error:error.message});
        }
    }

    // static async apiBranch(req,res,next){
    //     const branch = await attendanceDAO.getBranch();
    //     let response = {
    //         branch : branch
    //     }
    //     res.json(response);
    // }
}