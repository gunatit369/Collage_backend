import mongodb, { ObjectId, ReturnDocument } from "mongodb"
const objectId = mongodb.ObjectId
let faculty
let branch
let Allocated 
let Attendance
let Students
let Allocation_id;
let facultyId;
let branchName;

export default class AttendanceDAO {
    static async injectDB(conn) {
      if (faculty) {
        return;
      }
      try {
        faculty = await conn.db(process.env.RESTREVIEWS_NS).collection("Faculty");
        Allocated = await conn.db(process.env.RESTREVIEWS_NS).collection("Allocate_Faculty");
        branch = await conn.db(process.env.RESTREVIEWS_NS).collection("Branch");
        Attendance = await conn.db(process.env.RESTREVIEWS_NS).collection("Attendance");
        Students = await conn.db(process.env.RESTREVIEWS_NS).collection("Students");
      } catch (e) {
        console.error(
          `Unable to establish a collection handle in studentDAO: ${e}`,
        )
      }
    }

    static async getAllocatedFacultyBranch(id) {
        facultyId = id;
        try {
            let allocatedBranch = await Allocated.distinct("branch",{facultyId: ObjectId(facultyId)});
            return allocatedBranch;
        } catch (error) {
            throw new Error(`Error in getAllocatedFacultyBranch: ${error.message}`);
            // return {error:error};
        }
    }

    static async getFacultySem(branch){
        let cursor;
        branchName = branch;
        try {
            cursor = await Allocated.distinct("semester",{facultyId: ObjectId(facultyId),branch:branch});
            return cursor;
        } catch (error) {
            return {error:error};
        }
    }

    static async getFacultySubject(semester){
        let cursor;
        try {
            cursor = await Allocated.distinct("subject",{facultyId:ObjectId(facultyId),branch:branchName,semester:semester});
            return cursor;
        } catch (error) {
            return {error:error};
        }
    }

    static async getAllocationId(branch,sem,subject){
        try {
            // Allocation_id = await Allocated.find({branch:branch,semester:parseInt(sem),subject:subject}).project({_id:1}).toArray().then((value) => console.log(value))       
            // Allocation_id = Allocated.find({branch:branch,semester:parseInt(sem),subject:subject}).project({_id:1}).stream().on("data",doc => (console.log(doc)))
            const cursor = Allocated.find({branch:branch,semester:parseInt(sem),subject:subject}).project({_id:1})
            for await (const doc of cursor){
                Allocation_id = doc._id
            }
        } catch (error) {
            return {error:error};
        }
    }

    static async searchInAttendance(branch,sem,subject,date,lectureNo){
        await this.getAllocationId(branch,sem,subject);
        
        let cursor;
        cursor = Attendance.find({Date:new Date(date),Allocation_id:objectId(Allocation_id)}).project({_id:1,Attendance:1});
        let Attendancedata = await cursor.toArray();

        let id = [];
        let status = [];
        
        if (Attendancedata.length > 0 ){
            Attendancedata.forEach(entry => {
                const lecture = entry.Attendance.find(lecture => lecture.lectureNo === lectureNo)
                if (lecture){
                    lecture.PresentAbsent.forEach(studentAttendance => {
                        id.push(new ObjectId(studentAttendance.studentId))
                        status.push(studentAttendance.AttendanceStatus)
                    })
                }              
            });
            if (id.length === 0){
                return this.getAttendanceData(branch,sem)        
            }else{
                let student = await Students.find({_id : {$in : id}}).project({fname:1,_id:1,sname:1}).toArray();
                student = student.map((stud,index) => ({...stud,id : index,"AttendanceStatus" : status[index],objectId : Attendancedata[0]._id}));
                return student;
            }
        }else{
            return this.getAttendanceData(branch,sem);
        }
    }
    
    static async getAttendanceData(branchName,sem){
        let cursor;
        try {
            cursor = await branch.aggregate([{
                $lookup:
                {
                    from : "Students",
                    pipeline : [
                    {$match :
                        {$expr : 
                            {$and : 
                            [
                                {$eq : ["$course",branchName]},
                                {$eq : ["$sem",parseInt(sem)]}
                            ]
                            }
                        }
                    },
                    {$project : {fname : 1,_id : 1,sname:1}}
                    ],
                    as: "result"
                }
            }]).next();
            return cursor.result.map((student,index) => ({...student,id : index,"AttendanceStatus":0}))
        } 
        catch(error){
            return {error:error};
        }         
    }

    static async addAttendanceData(data){
        data.Date = new Date(data.Date);
        data.Attendance[0].PresentAbsent = data.Attendance[0].PresentAbsent.map(student => {return ({"studentId":ObjectId(student.studentId), "AttendanceStatus":student.AttendanceStatus})});
        if (data.Attendance[0].lectureNo < 2){
            try {
                data = {...data,Allocation_id};
                return await Attendance.insertOne(data);
            } catch (error) {
                console.log(`Unable to add attendance data: ${error}`);
                return {error:error};
            }    
        }else{
            try {
                const cursor = Attendance.find({Allocation_id : Allocation_id})
                let objectId;
                for await (const doc of cursor){
                    objectId = doc._id
                }  
                return await Attendance.updateOne(
                    {_id : objectId},
                    {$push : {Attendance: data.Attendance[0]}}
                ) 
            } catch (error) {
                return {error:error};
            }
        }
    }

    static async updateAttendanceData(data){
        data.students = data.students.map(student => {return ({"studentId":ObjectId(student.studentId),"AttendanceStatus":student.AttendanceStatus})})
        try {
            const updateResponse = await Attendance.updateOne(
                {_id : ObjectId(data.objectId),"Attendance.lectureNo":data.lectureNo},
                {$set : {"Attendance.$.PresentAbsent": data.students }}
            );
            return updateResponse;
        } catch (error) {   
            return {error:error};
        }
    }

    static async report(branch,semester,dateFrom,dateTo){
        try {
            let {Allocationid,subjects} = await Allocated.aggregate([
                {
                    $match : {
                        branch : branch,
                        semester : semester
                    }
                },
                {
                    $group : {
                        _id  : null,
                        Allocationid : {$push : "$_id"},
                        subjects : {$push : "$subject"}   
                    }       
                },
                {
                    $project : {
                        _id : 0,
                    }
                }
            ]).next();
            try {
                const pipline = [
                    {
                        $match : {
                            Allocation_id : {$in : Allocationid},
                            Date : {$gte : dateFrom,
                                    $lte : dateTo
                            }
                        }
                    },
                    {
                        $unwind : "$Attendance"
                    },
                    {
                        $unwind : "$Attendance.PresentAbsent"
                    },
                    {
                        $group: {
                        _id: {
                            Allocation_id: "$Allocation_id",
                            studentId: "$Attendance.PresentAbsent.studentId"
                        },
                        present: { $sum: { $cond: [{ $eq: ["$Attendance.PresentAbsent.AttendanceStatus", 1] }, 1, 0] } },
                        absent: { $sum: { $cond: [{ $eq: ["$Attendance.PresentAbsent.AttendanceStatus", 0] }, 1, 0] } }
                        }
                    },
                    {
                        $sort : {
                            "_id.studentId" : 1
                        }
                    },
                    {                    
                        $group: {
                            _id: "$_id.Allocation_id",
                            data: {
                                $push: {
                                studentId: "$_id.studentId",
                                present: "$present",
                                absent: "$absent"
                                }
                            }
                        }
                    },
                ]
                const data = await Attendance.aggregate(pipline).toArray();
                if (data.length > 0){

                    const studentId = data[0].data.map((student) => student.studentId);
                    const studentsName = [
                        {
                            $match : {
                                _id : {$in : studentId}
                            }
                        },
                        {
                            $group : {
                                _id  : null,
                                students : {$push : "$fname"},
                            }       
                        },
                        {
                            $project : {
                                _id : 0,
                            }
                        } 
                    ]
        
                    const {students} = await Students.aggregate(studentsName).next();
                    return {data,subjects,students,Allocationid};
                }else{
                    return false;
                }
            } catch (error) { 
               return {error:error};
            }
        } catch (error) {
            return {error:error};
        }
    }
}