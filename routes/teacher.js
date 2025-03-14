const express = require("express");
const router = express.Router();
const Test = require("../model/Test");
const Teacher = require("../model/Teacher");
const User = require("../model/User");

// Route to fetch all the tests assigned by a teacher using teacherId
const mongoose = require('mongoose'); 

router.get("/tests/:profileID", async (req, res) => {
  const profileID = req.params.profileID;

  try {
    // Cast the profileID to ObjectId using mongoose.Types.ObjectId
    const teacherObjectId = new mongoose.Types.ObjectId(profileID);
    

    // Now use teacherObjectId in the query
    const tests = await Test.find({
      teacherId: teacherObjectId,  
    });

    if (tests.length === 0) {
      return res.status(404).json({ message: "No tests found for this teacher" });
    }

    return res.status(200).json({ tests });
  } catch (err) {
    console.log("Error fetching tests:", err.message);
    return res.status(500).send("Error in fetching Tests");
  }
});



// Route to fetch all the classes registered in the database
router.get("/classes", async (req, res) => {
  console.log("fetch classes");

  try {
    const classes = await User.find({}, "className -_id");
    return res.status(200).json({ classes });
  } catch (err) {
    console.log("Error fetching classes:", err.message);
    return res.status(500).send("Error in fetching Classes");
  }
});

// Route to fetch a teacher's profile using profileID
router.get("/profile/:profileID", async (req, res) => {
  const profileID = req.params.profileID;

  try {
    const teacherProfile = await Teacher.findOne({ _id: profileID }).populate("profileInfo").exec();
    if (!teacherProfile) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    return res.status(200).json({ teacherProfile });
  } catch (err) {
    console.log("Error fetching teacher profile:", err.message);
    return res.status(500).send("Error in fetching Teacher Profile");
  }
});

// Route to create a test for students using teacherId
router.post("/create-test", async (req, res) => {
  const { teacherId, testName, category, minutes, rules, className, outOfMarks, answers, questions } = req.body;

  try {
    let existingTest = await Test.findOne({
      testName,
      className,
      category,
    });

    if (existingTest) {
      return res.status(400).json({ msg: "Test Already Created" });
    }

    const newTest = new Test({
      teacherId,
      testName,
      category,
      answers,
      minutes,
      className,
      rules,
      outOfMarks,
      questions,
    });

    const savedTest = await newTest.save();
    return res.status(200).json({ test: savedTest });
  } catch (err) {
    console.log("Error creating test:", err.message);
    return res.status(500).send("Error in Saving Test");
  }
});

// Route to update the questions of a specific test using testID
router.put("/update-test/:testid", async (req, res) => {
  const testID = req.params.testid;
  const questionsData = req.body.questions;

  try {
    const updatedTest = await Test.findByIdAndUpdate(testID, { questions: questionsData }, { new: true });
    if (!updatedTest) {
      return res.status(404).json({ message: "Test not found" });
    }
    return res.status(200).json({ message: "Questions successfully updated", updatedTest });
  } catch (err) {
    console.log("Error updating test:", err.message);
    return res.status(500).send("Error in Updating Test");
  }
});

// Route to update the teacher profile using profileID
router.put("/update-profile/:profileID", async (req, res) => {
  const profileID = req.params.profileID;
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    const updatedProfile = await Teacher.findByIdAndUpdate(profileID, { ...req.body }, { new: true });
    if (!updatedProfile) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    return res.status(200).json({ message: "Profile successfully updated", updatedProfile });
  } catch (err) {
    console.log("Error updating profile:", err.message);
    return res.status(500).send("Error in Updating Profile");
  }
});

// Route to assign a test to a class using testID
router.put("/assigned-to/:testID", async (req, res) => {
  const testID = req.params.testID;
  const { className } = req.body;

  try {
    const updatedTest = await Test.updateOne(
      { _id: testID },
      { $addToSet: { assignedTo: { $each: className } } },
      { new: true }
    );

    if (!updatedTest.nModified) {
      return res.status(400).json({ message: "Failed to assign test" });
    }

    return res.status(200).json({ message: "Test successfully assigned to classes", updatedTest });
  } catch (err) {
    console.log("Error assigning test:", err.message);
    return res.status(500).send("Error in Assigning Test");
  }
});

// Route to delete a specific test using testID
router.delete("/delete-test/:testid", async (req, res) => {
  const testID = req.params.testid;

  try {
    const deletedTest = await Test.findByIdAndDelete(testID);
    if (!deletedTest) {
      return res.status(404).json({ message: "Test not found" });
    }
    return res.status(200).json({ message: "Test successfully deleted" });
  } catch (err) {
    console.log("Error deleting test:", err.message);
    return res.status(500).send("Error in Deleting Test");
  }
});

module.exports = router;
