import mongodb from "mongodb"
import { ObjectId } from "mongodb";
let allocate_Faculty
let faculty
let id;
const Id = mongodb.ObjectId

export default class AllocateDAO {
    static async injectDB(conn){
      if (allocate_Faculty){
          return 
      }try{
          allocate_Faculty = await conn.db(process.env.RESTREVIEWS_NS).collection("Allocate_Faculty");
          faculty = await conn.db(process.env.RESTREVIEWS_NS).collection("Faculty");
      }catch(e){
          console.error( `Unable to establish a collection handle in studentDAO: ${e}`,);
      }
    }

    static async addFacultyAllocation(data){
      id = new ObjectId(data.id)
      try{
          return await allocate_Faculty.insertOne({facultyId:id,
              branch : data.branch, semester: data.semester, subject : data.subject});
      }catch(e){
          return {error:e};
      }
    }

    static async getFacultyAllocation(){
        let cursor;
        let facultyId = [];
        let fAllocation;
        let facultyNames;

        try{
            cursor = await allocate_Faculty
                .find();
        }catch(e){
            return {error:e};
        }
        
        try{
            fAllocation = await cursor.toArray();
            fAllocation.forEach(element => {
              facultyId.push(element.facultyId)
            });
        }catch(e){
            return {error:e};
        }

        try {
          facultyNames = await faculty.find({_id : {$in : facultyId}}).project({fname:1}).toArray();
        } catch (error) {
          return {error:error};
        }

        fAllocation.forEach((element,index) => {
          facultyNames.forEach(element2 => {
            if (element.facultyId.equals(element2._id)){
              fAllocation[index] = {...fAllocation[index],"facultyName":element2.fname}
            }
          }
          )
        })
        return fAllocation;
    }

    static async updateFacultyAllocation(data){
      id = new ObjectId(data.facultyId);
      try{
        const updateResponse = await allocate_Faculty.updateOne(
          {_id : Id(data._id)},
          { $set: {facultyId:id,branch : data.branch, semester: data.semester, subject : data.subject}})
        return updateResponse;
      }catch(e){
        return {error:e};
      }
    }

    static async deleteFacultyAllocation(AllocationId){
      try {
        return await allocate_Faculty.deleteOne({_id:Id(AllocationId)});
      }catch(e){
        console.error(`Unable to delete data: ${e}`);
        return {error: e};
      }
    }
}