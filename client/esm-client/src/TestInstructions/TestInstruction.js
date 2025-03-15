import React, { useEffect, useState } from "react";
import { Row, Modal, Col, Button } from "antd";
import { connect } from "react-redux";
import "./TestInstruction.css";
import { FaArrowCircleRight } from "react-icons/fa";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

function TestInstruction(props) {
  const history = useHistory();
  const { confirm } = Modal;
  const { tests } = props;
  const {
    outOfMarks,
    questions,
    minutes,
    category,
    className,
    testName,
    rules,
    _id: testID,
    submitBy
  } = props.selectedTest;

  let testRules, attempted = false;

  if (rules) {
    testRules = rules;
  }

  // Check if the test has been attempted
  tests.map((test, index) => {
    if (test.testName === testName) {
      attempted = true;
    }
  });

  // State to manage the 'Continue' button enabled/disabled status
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Get profileID from localStorage and check if it matches
  const localStorageProfileID = localStorage.getItem('profileID');

  useEffect(() => {
    // Check if profileID matches with the selected test submitBy[0][0].profileID
    if (submitBy && submitBy[0] && submitBy[0][0]?.profileID === localStorageProfileID) {
      setIsButtonDisabled(true); // Disable the button if profileID matches
    } else {
      setIsButtonDisabled(attempted); // Disable the button if the test is already attempted
    }
  }, [submitBy, localStorageProfileID, testName, attempted]);

  const handleButtonClick = () => {
    confirm({
      title: "Do you give test now?",
      icon: <ExclamationCircleOutlined />,
      content: "Once you click OK, the timer will start!",
      onOk() {
        console.log("OK");
        history.push("/start-test");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <>
      <div className="container dashboard">
        <Row gutter={[48, 10]} justify="center">
          <Col className="gutter-row" xs={24} sm={24} md={22} xl={22}>
            <div className="instructions__wrapper">
              <Row justify="center">
                <Col className="gutter-row" xs={24} sm={24} md={12} xl={12}>
                  <div className="instructions__wrapper__left">
                    <p className="instructions__heading">Test Instructions</p>
                    <div className="test__info">
                      <div className="test__subheadings">
                        <div className="test__fields">Test Name:</div>
                        <div className="test__fields__Value">{testName}</div>
                      </div>

                      <div className="test__subheadings">
                        <div className="test__fields">Total Questions:</div>
                        <div className="test__fields__Value">
                          {questions?.length}
                        </div>
                      </div>

                      <div className="test__subheadings">
                        <div className="test__fields">Allocated Time:</div>
                        <div className="test__fields__Value">
                          {minutes} Minutes
                        </div>
                      </div>

                      <div className="test__subheadings">
                        <div className="test__fields">Category:</div>
                        <div className="test__fields__Value">{category}</div>
                      </div>

                      <div className="test__subheadings">
                        <div className="test__fields">Total Marks:</div>
                        <div className="test__fields__Value">{outOfMarks}</div>
                      </div>
                    </div>
                    <div className="test__instructions">
                      <p className="test__instructions__subheading">
                        Instructions
                      </p>
                      <div className="instructions">
                        {testRules?.map((rule, index) => (
                          <p className="rule" key={index}>
                            <FaArrowCircleRight />{" "}
                            <span className="rule__description">
                              {rule.value}
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="gutter-row" xs={24} sm={24} md={12} xl={12}>
                  <div className="instructions__wrapper__right">
                    <div className="ems__log__wrapper">
                      <img
                        src="/ems-logo.png"
                        className="ems__logo"
                        alt="ems-logo"
                      />
                    </div>
                    <p className="navigation__instructions__heading">
                      Navigation Buttons
                    </p>
                    <div className="navigation__instructions">
                      <div className="navigation__buttons__Feature">
                        <Button
                          style={{ backgroundColor: "#449d44" }}
                          className="btn-instructions"
                        >
                          Next
                        </Button>
                        <p className="button__description">
                          Next: By clicking Next button next question will
                          appear to user
                        </p>
                      </div>
                      <div className="navigation__buttons__Feature">
                        <Button
                          style={{ backgroundColor: "#449d44" }}
                          className="btn-instructions"
                        >
                          Previous
                        </Button>
                        <p className="button__description">
                          Previous: By clicking Previous button previous
                          question will appear to user
                        </p>
                      </div>
                      <div className="navigation__buttons__Feature">
                        <Button
                          style={{ backgroundColor: "#ec971f" }}
                          className="btn-instructions"
                        >
                          Flag
                        </Button>
                        <p className="button__description">
                          Flag: Mark this question to revisit later
                        </p>
                      </div>
                      <div className="navigation__buttons__Feature">
                        <Button
                          style={{ backgroundColor: "#ff4d4f" }}
                          className="btn-instructions"
                        >
                          End Test
                        </Button>
                        <p className="button__description">
                          End Test: Finish the test early
                        </p>
                      </div>
                    </div>
                    <div className="select__button">
                      <Button
                        type="primary"
                        onClick={handleButtonClick}
                        disabled={isButtonDisabled}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedTest: state.selectedTest.selectedTestData,
    tests: state.tests.attemptedTest,
  };
};

export default connect(mapStateToProps, null)(TestInstruction);
