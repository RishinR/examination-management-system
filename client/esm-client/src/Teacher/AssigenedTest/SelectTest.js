import React, { useEffect, useState } from "react";
import { fetchAssignedTests } from "../../actions/TeacherActions";
import { selectedAssignedTest } from "../../actions/selectActions";
import { connect } from "react-redux";
import "./SelectTest.css";
import TestList from "./TestList";

function SelectTest(props) {
  const { tests, profileID } = props
  console.log("props",props);
  console.log("tests",tests)

  const handleSelectedTest = (testData) => {
    props.selectedTest(testData);
  };

  useEffect(() => {
    props.fetchTests(profileID);
  }, []);

  return (
    <>
      <div className="select__test__container">
        <TestList tests={tests} handleSelectedTest={handleSelectedTest} />
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    tests: state.teacher.assignedTests,
    
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchTests: (profileID) => dispatch(fetchAssignedTests(profileID)),
    selectedTest: (testData) => dispatch(selectedAssignedTest(testData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectTest);
