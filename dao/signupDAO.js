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
        if (cursor.length === 1){
          return cursor;
        }else{
          return false;
        }
      } catch (error) {
        return {error:error};  
      }
    }

    static async addSignup(data){
      try {
        return await signup.insertOne(data);
      } catch (error) {
        return {error:error}
      }
    }

    static async getSignup(){
        let cursor;
        try{
            cursor = await signup
              .find();
          }catch(e){
            return {error:e};
        }
    
        try{
          const signUpData = await cursor.toArray();
          return {signUpData};
        }catch(e){
          return {error:e};
        }
    }
}