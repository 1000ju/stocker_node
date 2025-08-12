const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const ctrl = require("./investment_profile.controller");

// 1 저장(최초)
router.post("/result", auth, ctrl.saveResult);

// 2 조회
router.get("/result", auth, ctrl.getResult);

// 3 재검사 갱신
router.put("/result", auth, ctrl.retestAndUpdate);

// 4 모든 거장
router.get("/masters", auth, ctrl.listAllMasters);

module.exports = router;
