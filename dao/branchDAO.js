import mongodb from "mongodb"
let branch

export default class BranchDAO{
    static async injectDB(conn){
        if (branch){
            return 
        }try{
            branch = await conn.db(process.env.RESTREVIEWS_NS).collection("Branch");
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
}