import express from "express"
import StudentCtrl from "../controllers/student.controller.js"
import SignCtrl from "../controllers/signup.controller.js";
import BranchCtrl from "../controllers/branch.controller.js";
import FacultyController from "../controllers/faculty.controller.js";

const router = express.Router();

router.route("/addStudents").post(StudentCtrl.apiAddStudentData);
router.route("/getStudents").get(StudentCtrl.apiGetStudentData);
router.route("/deleteStudent").delete(StudentCtrl.apiDeleteStudentData);
router.route("/editStudent").put(StudentCtrl.apiUpdateStudentData);

router.route("/branch").get(FacultyController.apiGetBranch);
router.route("/semester/:branchName").get(FacultyController.apiGetSemester);
router.route("/subject/:branchName/:semester").get(FacultyController.apiGetSubject);

router.route("/addFaculty").post(FacultyController);
router.route("/getFaculty").get()

router.route("/addBranch").post(BranchCtrl.apiAddBranchData);
router.route("/getBranch").get(BranchCtrl.apiGetBranchData);

router.route("/addUser").post(SignCtrl.apiAddSignup);
router.route("/getUser").get(SignCtrl.apiGetSignup);

export default router