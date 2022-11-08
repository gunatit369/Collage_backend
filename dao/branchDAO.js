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
}