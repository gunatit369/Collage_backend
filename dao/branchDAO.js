import mongodb, { ObjectId } from "mongodb"
let branch
let faculty
let allocate
let id;
const objectId = mongodb.ObjectId
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
            return await branch.insertOne({branchname:data.branchname,semesters:data.semesters});
        }catch(e){
            return {error:e};
        }
    }

    static async getBranchData(){
      let cursor;
      try{
          cursor = await branch
              .find()
      }catch(e){
        return {error:e};
      }
      try{
        const branchData = await cursor.toArray();
        return {branchData}
      }catch(e){
        return {error:e};
      }
    }

    static async deleteBranchData(branchId){
      try {
        return await branch.deleteOne({_id:objectId(branchId)});
      }catch(e){
        return {error: e};
      }
    }

    static async updateBranchData(data){
        try{
          const updateResponse = await branch.updateOne(
            {_id : objectId(data.firebaseId)},
            { $set: data} 
          )
          return updateResponse
        }catch(e){
          return {error:e};
        }
    }

    static async getBranchName(){
      let branchName = [];
      try{
        branchName = await branch.distinct("branchname")
        return branchName
      }catch(e){
        return {error:e};
      }
   }

   static async getSemester(bname){
    let semester = [];
    try{
      semester = await branch.distinct("semesters.sem",{branchname:bname});
      // semester = await branch.distinct("totalSemvalues",{branchname:bname});
      return semester
    }catch(e){
      return {error:e};
    }
  }

  static async getSubjects(bname,sem){
    let cursor;
    let allocated_sub;

    try {
      allocated_sub = await allocate.distinct("subject",{facultyId:id});
      try {
        cursor = await branch.find({branchname:bname});
        let subjects = await cursor.toArray();
        subjects = subjects[0].semesters[sem-1].subject;
        if (allocated_sub.length > 0){
          for (const element of allocated_sub){
            for (const element2 of subjects){
              if (element === element2){
                subjects.splice(subjects.indexOf(element),1);
                break;
              }
            }
          }
        }
        return subjects;
      }
      catch (error) {
        return {error:error};       
      } 
    }catch(error){
      return {error:error};
    }
  }

  static async getFacultyId(facultyName){
    let cursor;
    try {
      cursor = await faculty.find({fname:facultyName});
      id = await cursor.toArray();
      id = id[0]._id;
      return id;
    } catch (error) {
      return {error:error};
    }
  }

  static async getNonAllocatedSubjects(facultyId,branchName,semester,subject){
      try {
        let allocated_subjects = await allocate.find({facultyId:objectId(facultyId),branch:branchName,semester:parseInt(semester)}).project({subject:1,_id:0}).toArray();
        let findBranch = await branch.find({branchname:branchName}).toArray();
        let subjects = await branch.aggregate([
          {
            $project: {
              _id: 0,
              appleQuantities: {
                $filter: {
                  input: findBranch[0].semesters,
                  as: "item",
                  cond: { $eq: [ "$$item.sem", parseInt(semester) ] }
                }
              }
            }
          },
          {
            $project: {
              appleQuantities: "$appleQuantities.subject"
            }
          }
        ]).next();
        subjects = subjects.appleQuantities.flat();
        if (subjects.length > allocated_subjects.length){
          subjects.forEach((element,index) => {
            allocated_subjects.forEach((element2) => {
              if (element === element2.subject){
                subjects.splice(index,1);
              }
            })
          });
          subjects.push(subject);
          return subjects;
      }else{
        return [subject]
      }
    }  
    catch (error) {
      return {error:error};
    }
  }  
}