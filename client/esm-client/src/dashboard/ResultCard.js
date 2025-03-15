import React, { useEffect, useState } from "react";
import "./TestCard.css";
import { HiOutlineClipboardList, HiClipboardCopy } from "react-icons/hi";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "antd";

function ResultCard(props) {
  const { isLoading, profileID, trimLength } = props;
  const [tests, setTests] = useState([]);

  useEffect(() => {
    if (profileID) {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      };

      fetch(`http://localhost:5000/student/attempt-tests/${profileID}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            if (data?.error?.name === "TokenExpiredError") {
              // Handle token expiration
            } else {
              console.log("Attempted Test", data.obj);
              setTests(data.obj.attemptedTest || []); // Update state with the correct array of tests
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [profileID]); // Re-fetch if profileID changes

  // Log tests when it changes
  useEffect(() => {
    console.log("Fetched tests:", tests);
  }, [tests]);

  // Ensure trimming of tests based on the length
  const displayTests = tests.length > trimLength ? tests.slice(-trimLength).reverse() : tests;

  return (
    <>
      <div className="left__header">
        <p className="left__header__text">
          <HiOutlineClipboardList /> Recently Attempted Tests
        </p>
      </div>
      <div className="left__body">
        {tests.length > 0 ? (
          <ul className="left__body__list__ul">
            {displayTests.map((test, index) => (
              <Link to="/result" key={index}>
                <li className="left__body__test">
                  <div className="test__index">
                    <p className="index__box" style={{ backgroundColor: "#1e90ff" }}>
                      {index + 1}
                    </p>
                  </div>
                  <div className="test__name">{test?test[0].testName:""}</div>
                  <div className="test__icon">
                    <HiClipboardCopy />
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <div className="skeleton">
            {Array(trimLength)
              .fill()
              .map((item, i) => (
                <div className="single-skeleton" key={i}>
                  <Skeleton.Avatar className="avatar-skelton" active={true} size="default" shape="square" />
                  <Skeleton.Input className="input-skelton" active={true} size="default" />
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.tests.isLoadingAttemptedTest,
    profileID: state.auth.profileID,
  };
};

export default connect(mapStateToProps)(ResultCard);
