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
  const [selectedData, setSelectedData] = useState(null); // Track selected test data
  let selectRef = null;

  useEffect(() => {
    console.log("props.tests", props);
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
    if (selectedData) {
      console.log("selectedData", selectedData[0].testName);
      props.handleSelectedTest(selectedData);
      history.push(
        `/result/${selectedData.testName?.replace(/\s+/g, "-").toLowerCase()}`
      );
    }
  };

  const handleSelectTest = (e, index) => {
    // Remove the previous selected class
    if (selectRef) {
      selectRef.classList.remove("selected__test");
    }
    selectRef = e.currentTarget; // Update the ref to the newly selected test div
    e.currentTarget.classList.add("selected__test"); // Add selected class

    setSelectedData(tests[index]); // Set the selected test
  };

  // Function to format the timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp); // Convert timestamp to date object
    return date.toLocaleString(); // Formats the date as "MM/DD/YYYY, HH:mm AM/PM"
  };

  return (
    <>
      <div className="select__test__wrapper">
        <p className="test__wrapper__heading">Attempted Test</p>
        <div className="select__test__search__box">
          <p className="search__box__heading">Search Test</p>
          {<SearchBox handleListData={handleListData} />}
          <div className="test__wrapper__body">
            <p className="test__wrapper__heading select__heading">Select Test</p>
            <div className="select__test__body">
              {tests.length > 0 ? (
                searching !== "" ? (
                  searchTests.map((test, index) => (
                    <div
                      key={index}
                      className="test__wrapper"
                      onClick={(e) => handleSelectTest(e, index)}
                    >
                      <p className="select__test">{test[0].testName}</p>
                      <div className="test__time">
                        <p className="time start">
                          Published On: {formatDate(test[0].date)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  tests.map((test, index) => (
                    <div
                      key={index}
                      className="test__wrapper"
                      onClick={(e) => handleSelectTest(e, index)}
                    >
                      <p className="select__test">{test[0].testName}</p>
                      <div className="test__time">
                        <p className="time start">
                          Published On: {formatDate(test[0].date)}
                        </p>
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
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="select__button">
          <Button
            type="primary"
            onClick={handleButtonClick}
            disabled={!selectedData} // Disable button if no test is selected
          >
            Continue
          </Button>
        </div>
      </div>
    </>
  );
}
