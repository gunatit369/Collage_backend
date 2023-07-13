import express from "express"
import StudentCtrl from "../controllers/student.controller.js"
import SignCtrl from "../controllers/signup.controller.js";
import BranchCtrl from "../controllers/branch.controller.js";
import FacultyController from "../controllers/faculty.controller.js";
import AllocationCtrl from "../controllers/allocateFaculty.controller.js";
import AttendanceCtrl from "../controllers/attendance.controller.js";

const router = express.Router();

// router.route("/getData").get(AttendanceCtrl.apigetAllocatedFacultyBranch);
// router.route("/Attendancebranch").get(AttendanceCtrl.apiBranch);

router.route("/addStudents").post(StudentCtrl.apiAddStudentData);
router.route("/getStudents").get(StudentCtrl.apiGetStudentData);
router.route("/deleteStudent").delete(StudentCtrl.apiDeleteStudentData);
router.route("/editStudent").put(StudentCtrl.apiUpdateStudentData);

router.route("/branch").get(BranchCtrl.apiBranchName);
router.route("/semester/:branchName").get(BranchCtrl.apiSemester);
router.route("/subject/:branchName/:semester").get(BranchCtrl.apiSubject);
router.route("/getNonAllocatedSubjects/:facultyId/:branchName/:semester/:subject").get(BranchCtrl.apiGetNonAllocatedSubjects)
// router.route("/subject/:branchName").get(BranchCtrl.apiSubject);
router.route("/id/:facultyName").get(BranchCtrl.apiFacultyId);

router.route("/addAllocation").post(AllocationCtrl.apiAddAllocationData);
router.route("/getAllocation").get(AllocationCtrl.apiGetAllocationData);
router.route("/editAllocation").put(AllocationCtrl.apiUpdateAllocationData);
router.route("/deleteAllocation").delete(AllocationCtrl.apiDeleteAllocationData)

router.route("/addFaculty").post(FacultyController.apiAddFaculty);
router.route("/getFaculty").get(FacultyController.apiGetFaculty);
router.route("/editFaculty").put(FacultyController.apiUpdateFaculty);
router.route("/deleteFaculty").delete(FacultyController.apiDeleteFaculty);

router.route("/getFacultyBranch/:id").get(AttendanceCtrl.apigetAllocatedFacultyBranch);
router.route("/getFacultySem/:branch").get(AttendanceCtrl.apiGetFacultySem);
router.route("/getFacultySubject/:semester").get(AttendanceCtrl.apiGetFacultySubject);

router.route("/addBranch").post(BranchCtrl.apiAddBranchData);
router.route("/getBranch").get(BranchCtrl.apiGetBranchData);
router.route("/deleteBranch").delete(BranchCtrl.apiDeleteBranchData)

router.route("/addUser").post(SignCtrl.apiAddSignup);
router.route("/getUser").get(SignCtrl.apiGetSignup);
router.route("/checkEmail").post(SignCtrl.apiCheckEmailExitance)

router.route("/getAttendance/:branch/:sem/:subject/:date/:lectureNo").get(AttendanceCtrl.apiGetAttendanceData);
router.route("/addAttendance").post(AttendanceCtrl.apiAddAttendanceData);
router.route("/editAttendance").put(AttendanceCtrl.apiUpdateAttendaceData);
router.route("/report").post(AttendanceCtrl.apiReport)


export default router