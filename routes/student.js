const express = require("express");
const router = express.Router();
const Student = require("../model/Student");
const Test = require("../model/Test");
const User = require("../model/User");

const mongoose = require('mongoose'); 

/**
 * @method - GET
 * @param - /profile/:profileID
 * @description - Fetch student profile using profileID
 */
router.get("/profile/:profileID", async (req, res) => {
  const profileID = req.params.profileID;

  try {
    const obj = await Student.findOne({ _id: profileID }).populate("profileInfo");
    return res.status(200).json({ obj });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in fetching Student Data");
  }
});

/**
 * @method - GET
 * @param - /tests/:studentClass
 * @description - Fetch all the tests assigned to the student's class
 */
router.get("/tests/:studentClass", async (req, res) => {
  const studentClass = req.params.studentClass;

  try {
    const obj = await Test.find({ className: studentClass });
    return res.status(200).json({ obj });
  } catch (err) {
    console.log("Error fetching test data:", err.message);
    res.status(500).send("Error in fetching Test Data");
  }
});

/**
 * @method - GET
 * @param - /attempt-tests/:studentID
 * @description - Fetch all attempted tests of a student
 */
router.get("/attempt-tests/:studentID", async (req, res) => {
  const studentID = req.params.studentID;
  console.log(studentID);
  

  try {
    const studentObjectId = new mongoose.Types.ObjectId(studentID);

    const obj = await Student.findOne({ _id: studentObjectId });
    return res.status(200).json({ obj });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in fetching attempted tests");
  }
});

/**
 * @method - POST
 * @param - /results/:studentID
 * @description - Fetch student results using studentID
 */
router.post("/results/:studentID", async (req, res) => {
  const studentID = req.params.studentID;
  const { testID } = req.body;

  try {
    const obj = await Test.find({ _id: testID }, "submitBy -_id");
    const result = obj[0].submitBy.filter((student) => student.id === studentID);
    return res.status(200).json({ result });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in fetching Test Data");
  }
});

/**
 * @method - PUT
 * @param - /update-profile/:profileID
 * @description - Update student profile using profileID
 */
router.put("/update-profile/:profileID", async (req, res) => {
  const profileID = req.params.profileID;
  const { firstName, lastName, email, phone, className, section } = req.body;

  try {
    const updatedData = await User.findOneAndUpdate(
      { _id: profileID },
      { ...req.body },
      { new: true }
    );
    return res.status(200).json({ message: "Profile successfully updated", updatedData });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in updating profile");
  }
});

/**
 * @method - PUT
 * @param - /submit-test/:testID
 * @description - Submit a test using testID
 */
router.put("/submit-test/:testID", async (req, res) => {
  const testID = req.params.testID;
  const submittedData = req.body.submitBy;
  const testName = req.body.testName;
  const date = Date.now();

  try {
    await Test.updateOne(
      { _id: testID },
      { $addToSet: { submitBy: submittedData }, attempted: true }
    );

    await Student.updateOne(
      { _id: submittedData[0].profileID },
      { $addToSet: { attemptedTest: [{ testName, date, ...submittedData }] } }
    );

    return res.status(200).json({ message: "Test submitted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in submitting test data");
  }
});

/**
 * @method - PUT
 * @param - /update-test-status/:testID
 * @description - Track time spent on a test using attemptedTime
 */
router.put("/update-test-status/:testID", async (req, res) => {
  const testID = req.params.testID;
  const { profileID, testName, completed, attemptedTime, totalTime } = req.body;

  try {
    let studentData = await Student.findById(profileID);
    let { testStatus } = studentData;
    let test = testStatus.filter((t) => t.testID === testID);

    if (test.length < 1) {
      studentData.testStatus.push({
        testID,
        attemptedTime,
        testName,
        completed,
        totalTime,
      });
      await studentData.save();
      return res.status(200).json({ studentData });
    } else {
      const updatedStudent = await Student.findOneAndUpdate(
        { _id: profileID, "testStatus.testID": testID },
        { $set: { "testStatus.$.attemptedTime": attemptedTime } },
        { new: true }
      );
      return res.status(200).json({ updatedStudent });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error in updating test data");
  }
});

module.exports = router;
