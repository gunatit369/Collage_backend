import AllocateDAO from "../dao/allocateFacultyDAO.js";

export default class AllocationController {

    static async apiAddAllocationData(req,res,next){
        try {
            await AllocateDAO.addFacultyAllocation(req.body);
        } catch (error) {
            console.log(error);
        }
    }

    static async apiGetAllocationData(req,res,next){
        try{
            const {fAllocation} = await AllocateDAO.getFacultyAllocation();
            let response = {
                fAllocation : fAllocation
            }
            res.json(response);
        }catch(e){
            res.status(500).json({error:e.message})
        }
    }

    static async apiUpdateAllocationData(req,res,next){
        try{
            await AllocateDAO.updateFacultyAllocation(req.body);
            res.json({status:"success"});
        }catch(e){
            console.log(e);
        }
    }

    static async apiDeleteAllocationData(req,res,next){
        try{
            const AllocationId = req.query.id;
            // console.log(studentId);
            await AllocateDAO.deleteFacultyAllocation(AllocationId);
            res.json({status:"success"});
        }catch(e){
            res.status(500).json({error:e.message});
        }
    }
}