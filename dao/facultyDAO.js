import mongodb from "mongodb"
const OjeectId = mongodb.ObjectId
let faculty
let Allocation_faculty
export default class facultyDAO {
    static async injectDB(conn) {
      if (faculty) {
        return;
      }
      try {
        faculty = await conn.db(process.env.RESTREVIEWS_NS).collection("Faculty");
        Allocation_faculty = await conn.db(process.env.RESTREVIEWS_NS).collection("Allocate_Faculty");
      } catch (e) {
        console.error(
          `Unable to establish a collection handle in studentDAO: ${e}`,
        )
      }
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
        cursor = await faculty.find()
      }catch(e){
        return {error:e};        
      }

      try{
        const facultyData = await cursor.toArray();
        return facultyData;
      }catch(e){
        return {error:e};
      }
    }

    static async updateFacultyData(data){
      try{
        const updateResponse = await faculty.updateOne(
          {_id : OjeectId(data._id)},
          { $set: {fname:data.fname,
            qulification:data.qulification,
            expertise:data.expertise,
            experience:data.experience}} 
        );
        return updateResponse;
      }catch(e){
        return {error:e};
      }
    }

    static async deleteFacultyData(facultyId){
      try {
         await faculty.deleteOne({_id:OjeectId(facultyId)});
          try {
            return await Allocation_faculty.deleteMany({facultyId:OjeectId(facultyId)})
        } catch (error) {
            return {error: e};    
        }
      }catch(e){
        return {error: e};
      }
    }
}