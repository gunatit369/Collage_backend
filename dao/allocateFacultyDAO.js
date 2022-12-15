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
          return await allocate_Faculty.insertOne({facultyId:id,facultyName:data.facultyName,
              branch : data.branch, semester: data.semester, subject : data.subject});
      }catch(e){
          console.error(`Unable to add data: ${e}`);
          return {error:e};
      }
    }

    static async getFacultyAllocation(){
        let cursor;
        try{
            cursor = await allocate_Faculty
                .find()
        }catch(e){
            console.error(`Unable to get data,${e}`);
            return {fAllocation:[]};
        }
        
        try{
            const fAllocation = await cursor.toArray();
            return {fAllocation}
        }catch(e){
            console.error(`Unable to convert to array ${e}`);
        }
        return {fAllocation:[]};
    }

    static async updateFacultyAllocation(data){
      id = new ObjectId(data.facultyId);
        try{
          const updateResponse = await allocate_Faculty.updateOne(
            {_id : Id(data.id)},
            { $set: {facultyId:id,facultyName:data.facultyName,
              branch : data.branch, semester: data.semester, subject : data.subject}})
          return updateResponse
        }catch(e){
          console.error(`Unable to update data: ${e}`);
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