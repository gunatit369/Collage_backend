import express from "express"
import StudentCtrl from "../controllers/student.controller.js"
import SignCtrl from "../controllers/signup.controller.js";
import BranchCtrl from "../controllers/branch.controller.js";

const router = express.Router();

router.route("/addStudents").post(StudentCtrl.apiAddStudentData);
router.route("/getStudents").get(StudentCtrl.apiGetStudentData);
router.route("/deleteStudent").delete(StudentCtrl.apiDeleteStudentData);
router.route("/editStudent").put(StudentCtrl.apiUpdateStudentData);

router.route("/addBranch").post(BranchCtrl.apiAddBranchData);

router.route("/addUser").post(SignCtrl.apiAddSignup);
router.route("/getUser").get(SignCtrl.apiGetSignup);

export default router