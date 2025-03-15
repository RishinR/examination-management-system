import React, { useState, useEffect } from "react";
import { Button } from "antd";
import SearchBox from "./SearchBox";
import { useHistory } from "react-router-dom";
import { Skeleton } from "antd";

export default function TestList(props) {
  const history = useHistory();
  const [tests, setTests] = useState([]);
  const [searchTests, setSearchTests] = useState([]);
  const [searching, setSearching] = useState("");
  const [selectedTest, setSelectedTest] = useState(null); // Use state to track selected test

  useEffect(() => {
    setTests(props.tests.reverse());
  }, [props]);

  const handleListData = (searchTerm) => {
    if (searchTerm === "") setSearching(searchTerm);
    else {
      setSearching(true);
      setSearchTests(
        tests.filter((test) => test.testName.toLowerCase().includes(searchTerm))
      );
    }
  };

  const handleButtonClick = () => {
    // Now passing the state value of selectedTest
    if (selectedTest) {
      props.handleSelectedTest(selectedTest);
      history.push("/test-instructions");
      console.log("Selected Test Data:", selectedTest); // Log selected test data
    }
  };

  const handleSelectTest = (e, index) => {
    // Set the selected test using useState
    const test = tests[index];
    setSelectedTest(test); // Update the state with the selected test

    console.log("Selected Test:", test);
  };

  return (
    <>
      <div className="select__test__wrapper">
        <p className="test__wrapper__heading">Available Test</p>
        <div className="select__test__search__box">
          <p className="search__box__heading">Search Test</p>
          {<SearchBox handleListData={handleListData} />}
          <div className="test__wrapper__body">
            <p className="test__wrapper__heading select__heading">
              Select Test
            </p>
            <div className="select__test__body">
              {tests && tests.length > 0 ? (
                searching !== "" ? (
                  searchTests.map((test, index) => (
                    <div
                      key={index}
                      className={`test__wrapper`}
                      onClick={(e) => handleSelectTest(e, index)}
                    >
                      <p className="select__test">{test.testName}</p>
                      <div className="test__time">
                        <p className="time start">Duration: {test.minutes} min</p>
                        <p className="time end">Max Marks: {test.outOfMarks}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  tests.map((test, index) => (
                    <div
                      key={index}
                      className={`test__wrapper`}
                      onClick={(e) => handleSelectTest(e, index)}
                    >
                      <p className="select__test">{test.testName}</p>
                      <div className="test__time">
                        <p className="time start">Duration: {test.minutes} min</p>
                        <p className="time end">Max Marks: {test.outOfMarks}</p>
                      </div>
                    </div>
                  ))
                )
              ) : (
                <div className="select__skeleton">
                  <div className="select__single-skeleton">
                    <Skeleton.Avatar
                      className="select__avatar-skelton"
                      active={true}
                      size="default"
                      shape="square"
                    />
                    <Skeleton.Input
                      className="select__input-skelton"
                      active={true}
                      size="default"
                    />
                  </div>
                  <div className="select__single-skeleton">
                    <Skeleton.Avatar
                      className="select__avatar-skelton"
                      active={true}
                      size="default"
                      shape="square"
                    />
                    <Skeleton.Input
                      className="select__input-skelton"
                      active={true}
                      size="default"
                    />
                  </div>
                  <div className="select__single-skeleton">
                    <Skeleton.Avatar
                      className="select__avatar-skelton"
                      active={true}
                      size="default"
                      shape="square"
                    />
                    <Skeleton.Input
                      className="select__input-skelton"
                      active={true}
                      size="default"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="select__button">
          <Button
            type="primary"
            onClick={handleButtonClick}
            disabled={!selectedTest} // Disable button if no test is selected
          >
            Continue
          </Button>
        </div>
      </div>
    </>
  );
}
