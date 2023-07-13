import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let student
let Attendance 
export default class StudentDAO{
    static async injectDB(conn) {
        if (student) {
          return
        }
        try {
          student = await conn.db(process.env.RESTREVIEWS_NS).collection("Students")
          Attendance = await conn.db(process.env.RESTREVIEWS_NS).collection("Attendance")
        } catch (e) {
          console.error(
            `Unable to establish a collection handle in studentDAO: ${e}`,
          )
        }
    }
    
    static async addStudentData(data){
        try{
          return await student.insertOne({fname:data.fname,
                                        mname:data.mname,sname:data.sname,address:data.address,enroll:data.enroll
                                        ,course:data.course,sem:data.sem,pcontact:data.pcontact,scontact:data.scontact});
          // console.log(data);
          // const options = {ordered:true};
          // return await student.insertMany(data,options);
        }
        catch(e){
            console.error(`Unable to add student data: ${e}`);
            return {error:e};
        }
    }

    static async getStudentData(){
      let cursor;
      try{
        cursor = await student
          .find()
      }catch(e){
        console.error(`Unable to get data,${e}`);
        return { studentData:[]};
      }

      try{
        const studentData = await cursor.toArray();
        return {studentData};
      }catch(e){
        console.error(`Unable to convert to array ${e}`);
      }
      return {studentData:[]};
    }
    
    static async deleteStudentData(studentId){
      try {
        await student.deleteOne({_id:ObjectId(studentId)});
        try {
          return await Attendance.updateMany({ }, {
            $pull : {"Attendance.$[].PresentAbsent" :{ "studentId" : ObjectId(studentId)}}
          })
        }catch(e){
          console.error(`Unable to delete student Attendance : ${e}`);
        }
      }catch(e){
        console.error(`Unable to delete studentData: ${e}`);
        return {error: e};
      }
    } 
    
    static async updateStudentData(data){
      try{
        const updateResponse = await student.updateOne(
          {_id : ObjectId(data._id)},
          { $set: {fname:data.fname,mname:data.mname,sname:data.sname,
            address:data.address,enroll:data.enroll,course:data.course,sem:data.sem,
            pcontact:data.pcontact,scontact:data.scontact}} 
        )
        return updateResponse
      }catch(e){
        console.error(`Unable to update data: ${e}`);
      }
    }
}