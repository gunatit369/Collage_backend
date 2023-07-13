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

    static async emailExistance(data){
      try {
        const cursor = await signup.find({email : data.email}).project({role:1,facultyId:1}).limit(1).toArray();
        // console.log(cursor);
        if (cursor.length === 1){
          return cursor;
          // return 
        }else{
          // return "User Don't not exist";
          return false
        }
      } catch (error) {
        console.error(`Unable to find email existance: ${error}`)
      }
    }

    static async addSignup(data){
      console.log({data});
        // try{
        //   const cursor = await signup.find({email : data.email}).limit(1).hasNext();
        //   if (cursor){
        //     return cursor
        //   }else{
            try {
              return await signup.insertOne(data)
            } catch (error) {
              console.error(`Unable to add user : ${error}`);
            }
        //   }
        // }catch(e){
        //     console.error(`Unable to find user : ${e}`);
        //     return {error:e};
        // }
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