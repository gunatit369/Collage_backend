import mongodb from "mongodb"
let branch
let faculty
let allocate
let id;
export default class BranchDAO{
    static async injectDB(conn){
        if (branch){
            return 
        }try{
            branch = await conn.db(process.env.RESTREVIEWS_NS).collection("Branch");
            faculty = await conn.db(process.env.RESTREVIEWS_NS).collection("Faculty");
            allocate = await conn.db(process.env.RESTREVIEWS_NS).collection("Allocate_Faculty");
        }catch(e){
            console.error( `Unable to establish a collection handle in studentDAO: ${e}`,);
        }
    }

    static async addBranchData(data){
        try{
            return await branch.insertOne(data);
        }catch(e){
            console.error(`Unable to add student data: ${e}`);
            return {error:e};
        }
    }

    static async getBranchData(){
        let cursor;
        try{
            cursor = await branch
                .find()
        }catch(e){
            console.error(`Unable to get data,${e}`);
            return {branchData:[]};
        }
        
        try{
            const branchData = await cursor.toArray();
            return {branchData}
        }catch(e){
            console.error(`Unable to convert to array ${e}`);
        }
        return {branchData:[]};
    }

    static async deleteBranchData(branchId){
        try {
          return await branch.deleteOne({_id:OjeectId(branchId)});
        }catch(e){
          console.error(`Unable to delete studentData: ${e}`);
          return {error: e};
        }
    }

    static async updateBranchData(data){
        try{
          const updateResponse = await branch.updateOne(
            {_id : OjeectId(data.firebaseId)},
            { $set: data} 
          )
          return updateResponse
        }catch(e){
          console.error(`Unable to update data: ${e}`);
        }
    }

    static async getBranchName(){
      let branchName = [];
      try{
        branchName = await branch.distinct("branchname")
        return branchName
      }catch(e){
        console.error("unable to get data");
      }
   }

   static async getSemester(bname){
    let semester = [];
    try{
       semester = await branch.distinct("semesters.sem",{branchname:bname});
      // semester = await branch.distinct("totalSemvalues",{branchname:bname});
      return semester
    }catch(e){
      console.error("unable to get data");
      console.log(e);
    }
  }

  static async getSubjects(bname,sem){
    let cursor
    let allocated_sub;

    try {
      allocated_sub = await allocate.distinct("subject",{facultyId:id})
      console.log({allocated_sub});
    }catch(error){
      console.error(error);
    }
    // let sem = parseInt(semester)
    try {
      let remain_sub = [];
      cursor = await branch.find({branchname:bname})
      let subjects = await cursor.toArray();
      subjects = subjects[0].semesters[sem-1].subject;
      if (allocated_sub.length > 0){
        for (const element of allocated_sub){
          for (const element2 of subjects){
            if (element === element2){
              subjects.splice(subjects.indexOf(element),1)
              break;
            }
          }
        }
      }

      // console.log({subjects});
      return subjects
    } catch (error) {
      console.log(error);        
    }  
    // try {
    //   cursor = await branch.find({branchname:bname},{"semesters.sem_name":1,"semesters.subject":1});
    //   let subjects = await cursor.toArray();
    //   console.log(subjects);
    // } catch (error) {
    //   console.log(error); 
    // }
  }

  static async getFacultyId(facultyName){
    let cursor;
    try {
      cursor = await faculty.find({fname:facultyName});
      id = await cursor.toArray();
      id = id[0]._id;
      return id;
    } catch (error) {
      console.log(error);
    }
  }
}