import mongodb from "mongodb"
const OjeectId = mongodb.ObjectId
let signup

export default class SignDAO{
    static async injectDB(conn) {
        if (signup) {
          return
        }
        try {
           signup = await conn.db(process.env.RESTREVIEWS_NS).collection("Registration")
        } catch (e) {
          console.error(
            `Unable to establish a collection handle in studentDAO: ${e}`,
          )
        }
    }

    static async addSignup(data){
        try{
            return await signup.insertOne(data)
        }catch(e){
            console.error(`Unable to register user : ${e}`);
            return {error:e};
        }
    }

    static async getSignup(){
        let cursor;
        try{
            cursor = await signup
              .find()
          }catch(e){
            console.error(`Unable to get data,${e}`);
            return { signUpData:[]};
          }
    
          try{
            const signUpData = await cursor.toArray();
            return {signUpData};
          }catch(e){
            console.error(`Unable to convert to array ${e}`);
          }
        return {signUpData:[]};
    }
}