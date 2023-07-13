import AllocateDAO from "../dao/allocateFacultyDAO.js";

export default class AllocationController {

    static async apiAddAllocationData(req,res,next){
        try {
            const response =  await AllocateDAO.addFacultyAllocation(req.body);
            res.json(response.insertedId)
        } catch (error) {
            console.log(error);
        }
    }

    static async apiGetAllocationData(req,res,next){
        try{
            const {fAllocation} = await AllocateDAO.getFacultyAllocation();
            res.json(fAllocation);
        }catch(e){
            res.status(500).json({error:e.message})
        }
    }

    static async apiUpdateAllocationData(req,res,next){
        try{
            const response = await AllocateDAO.updateFacultyAllocation(req.body);
            res.json(response.acknowledged)
        }catch(e){
            console.log(e);
        }
    }

    static async apiDeleteAllocationData(req,res,next){
        try{
            const AllocationId = req.query.id;
            const response = await AllocateDAO.deleteFacultyAllocation(AllocationId);
            res.json(response.acknowledged);
        }catch(e){
            res.status(500).json({error:e.message});
        }
    }
}