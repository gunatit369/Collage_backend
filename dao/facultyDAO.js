import mongodb from "mongodb"
const OjeectId = mongodb.ObjectId
let faculty

export default class facultyDAO {
    static async injectDB(conn) {
      if (faculty) {
        return
      }
      try {
        faculty = await conn.db(process.env.RESTREVIEWS_NS).collection("Faculty")
      } catch (e) {
        console.error(
          `Unable to establish a collection handle in studentDAO: ${e}`,
        )
      }
    }

    static async getBranchData(){    

      let cursor

      try{
          cursor = await faculty
              .find();
      }catch(e){
          console.error(`Unable to issue find command, ${e}`);
          return { branchData: []}
      }

      try {
          const branchData = await cursor.toArray();
          return {branchData};
      } catch (error) {
          console.error(
              `Unable to convert cursor to array or problem counting documents, ${error}`,
          )
      }
    return {branchData:[]}
    }

    static async getBranchName(){
      let branchName = [];
      try{
        branchName = await faculty.distinct("branch_name")
        return branchName
      }catch(e){
        console.error("unable to get data");
      }
    }

    static async getSemester(bname){
      let semester = [];
      try{
        semester = await faculty.distinct("semesters.sem_name",{branch_name:bname});
        return semester
      }catch(e){
        console.error("unable to get data");
        console.log(e);
      }
    }

    static async getSubjects(semester,bname){
      let cursor
      let sem = parseInt(semester)
      // try {
      //   cursor = await faculty.find({branch_name:bname,"semesters.sem_name":sem})
      //   let subjects = await cursor.toArray();
      //   subjects = subjects[0].semesters[sem-1].subject;
      //    return subjects
      // } catch (error) {
      //   console.log(error);        
      // }  
    }

    static async addFaculty(data){
        try{
            return await faculty.insertOne({fname:data.fname,
                                      qulification:data.qulification,
                                      expertise:data.expertise,
                                      experience:data.experience});
          }
          catch(e){
            console.error(`Unable to add faculty data: ${e}`);
            return {error:e};
        }
    }

    static async getFaculty(){
      let cursor;
      try{
        cursor = await faculty
          .find()
      }catch(e){
        console.error(`Unable to get data,${e}`);
        return { facultyData:[]};
      }

      try{
        const facultyData = await cursor.toArray();
        return {facultyData};
      }catch(e){
        console.error(`Unable to convert to array ${e}`);
      }
      return {facultyData:[]};
    }

    static async updateFacultyData(data){
      try{
        const updateResponse = await faculty.updateOne(
          {_id : OjeectId(data.id)},
          { $set: data} 
        )
        return updateResponse
      }catch(e){
        console.error(`Unable to update data: ${e}`);
      }
    }

    static async deleteFacultyData(facultyId){
      try {
        return await faculty.deleteOne({_id:OjeectId(facultyId)});
      }catch(e){
        console.error(`Unable to delete data: ${e}`);
        return {error: e};
      }
    }
}