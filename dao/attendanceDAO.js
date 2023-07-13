import mongodb, { ObjectId, ReturnDocument } from "mongodb"
const objectId = mongodb.ObjectId
let faculty
let branch
let Allocated 
let Attendance
let data = []
let Students
let Allocation_id;
var facultyId;
var branchName;

export default class AttendanceDAO {
    static async injectDB(conn) {
      if (faculty) {
        return
      }
      try {
        faculty = await conn.db(process.env.RESTREVIEWS_NS).collection("Faculty")
        Allocated = await conn.db(process.env.RESTREVIEWS_NS).collection("Allocate_Faculty")
        branch = await conn.db(process.env.RESTREVIEWS_NS).collection("Branch")
        Attendance = await conn.db(process.env.RESTREVIEWS_NS).collection("Attendance")
        Students = await conn.db(process.env.RESTREVIEWS_NS).collection("Students")
      } catch (e) {
        console.error(
          `Unable to establish a collection handle in studentDAO: ${e}`,
        )
      }
    }

    // static async getAllocatedFacultyBranch(){
    //     let cursor;
    //     try {
    //         cursor = await faculty.aggregate([{
    //             $lookup:
    //             {
    //                 from: "Allocate_Faculty",
    //                     let : {id : "$_id"},
    //                     pipeline : [
    //                         {$match : 
    //                             {$expr : 
    //                                 {$and :
    //                                 [
    //                                     { $eq : ["$$id",ObjectId('63882814a445ed43148811f1')]},
    //                                     { $eq : ["$facultyId",ObjectId('63882814a445ed43148811f1')]}
    //                                 ]
    //                                 }
    //                             }
    //                         },
    //                         {$project : {_id:0}}  
    //                     ],
    //                     as: "data"
    //             }
    //         }])
    //         data = await cursor.toArray();
    //         console.log({data});
    //     } catch (error) {
    //         console.log(error);
    //     }        
    // }

    static async getAllocatedFacultyBranch(id) {
        let cursor;
        facultyId = id;
        try {
            cursor = await Allocated.distinct("branch",{facultyId: ObjectId(facultyId)});
            return cursor;
        } catch (error) {
            console.log(error);
        }
    }

    static async getFacultySem(branch){
        let cursor;
        branchName = branch
        try {
            cursor = await Allocated.distinct("semester",{facultyId: ObjectId(facultyId),branch:branch});
            return cursor;
        } catch (error) {
            console.log(error);
        }
    }

    static async getFacultySubject(semester){
        let cursor;
        try {
            cursor = await Allocated.distinct("subject",{facultyId:ObjectId(facultyId),branch:branchName,semester:semester});
            // console.log(cursor);
            return cursor;
        } catch (error) {
            console.log(error);
        }
    }

    static async getBranch(){
        let branch = []
        // data[0].forEach(function(element) {
        //     console.log(element.subject);
        //     branch.push(element.subject)
        // });
        for (const element of data){
            console.log(element.subject);
            branch.push(element.subject)
        }
        console.log(branch);
        return branch;
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
            console.error(error);
        }
    }

    static async searchInAttendance(branch,sem,subject,date,lectureNo){
        this.getAllocationId(branch,sem,subject)
        
        let cursor;
        cursor = Attendance.find({Date:new Date(date)})
        let Attendancedata = await cursor.toArray()
        
        let id = []
        let status = []
        
        if (Attendancedata.length > 0 ){
            const findAllocationId = Attendancedata.filter(st=>{return st.Allocation_id.equals(Allocation_id)})
            if (findAllocationId.length > 0){
                findAllocationId.forEach(element => {
                    element.Attendance.forEach(lecture =>{
                        if (lecture.lectureNo === parseInt(lectureNo)){
                            lecture.PresentAbsent.forEach(studentAttendance => {
                                id.push(new ObjectId(studentAttendance.studentId))
                                status.push(studentAttendance.AttendanceStatus)
                            })
                        }              
                    })
                })
                if (id.length === 0){
                    return this.getAttendanceData(branch,sem)        
                }else{
                    let student = await Students.find({_id : {$in : id}}).project({fname:1,_id:1,sname:1}).toArray();
                    student = student.map((stud,index) => ({...stud,id : index,"AttendanceStatus" : status[index],objectId : findAllocationId[0]._id}))
                    return student;
                }
            }else{
                return this.getAttendanceData(branch,sem)
            }
        }else{
            return this.getAttendanceData(branch,sem)
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
                    // {$group :
                    {$match :
                    {$expr : 
                        {$and : 
                        [
                            {$eq : ["$course",branchName]},
                            {$eq : ["$sem",parseInt(sem)]}
                        ]
                        }
                    }
                    // }
                    },
                    {$project : {fname : 1,_id : 1,sname:1}}
                    ],
                    as: "result"
                }
            }]).next()
            return cursor.result.map((student,index) => ({...student,id : index,"AttendanceStatus":0}))
        } 
        catch(error){
            console.log(`Can't able to get student for attendance: ${error}`);
        }         
    }

    static async addAttendanceData(data){
        data.Date = new Date(data.Date);
        // console.log(typeof(data.Date));
        data.Attendance[0].PresentAbsent = data.Attendance[0].PresentAbsent.map(student => {return ({"studentId":ObjectId(student.studentId), "AttendanceStatus":student.AttendanceStatus})});
        // console.log(data.Attendance[0].PresentAbsent);
        if (data.Attendance[0].lectureNo < 2){
            try {
                data = {...data,Allocation_id};
                return await Attendance.insertOne(data);
            } catch (error) {
                console.log(`Unable to add attendance data: ${error}`);
            }    
        }else{
            const cursor = Attendance.find({Allocation_id : Allocation_id})
            let objectId;
            for await (const doc of cursor){
                objectId = doc._id
            }
            
            return await Attendance.updateOne(
                {_id : objectId},
                {$push : {Attendance: data.Attendance[0]}}
            )
        }
        // try {
        //     data = {...data,Allocation_id};
        //     return await Attendance.insertOne(data);
        // } catch (error) {
        //     console.log(`Unable to add attendance data: ${error}`);
        // }
    }

    static async updateAttendanceData(data){
        data.students = data.students.map(student => {return ({"studentId":ObjectId(student.studentId),"AttendanceStatus":student.AttendanceStatus})})
        try {
             return await Attendance.updateOne(
                {_id : ObjectId(data.objectId),"Attendance.lectureNo":data.lectureNo},
                {$set : {"Attendance.$.PresentAbsent": data.students }}
            )
        } catch (error) {   
            console.log({error});
        }
    }

    static async report(branch,semester,dateFrom,dateTo){
        try {
            // const subjectIds = await Allocated.find({branch:"BCA",semester:1}).project({_id:1}).toArray();
            // console.log(subjectIds);
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
            ]).next()
            console.log(Allocationid);
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
                console.log(data);
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
                console.log(Allocationid);
                return {data,subjects,students,Allocationid};
                // console.log(data[1]); 
                // let allPresent = [];
                // data.forEach((subjects) =>{
                //     let present = [];
                //     subjects.data.forEach((student) => {
                //         present.push(student.present)
                //     })
                //     allPresent.push(present)
                // })
                // console.log(allPresent);
            } catch (error) {
               console.log({error}); 
            }
        } catch (error) {
            console.log({error});
        }
    }
}