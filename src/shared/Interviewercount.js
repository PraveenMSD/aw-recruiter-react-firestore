import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/config";

const Interviewercount = () => {
  const [intervwrCount, setintervwrCount] = useState("");

  useEffect(() => {
    getInt();
  }, []);

  const getInt = () => {
    firestore.collection("candidates").onSnapshot((querySnapshot) => {
      var count = [];
      querySnapshot.docs.map((doc) => {
        if (doc.data().interviewer !== "") {
          count.push(doc.data().interviewer);
        }
        setintervwrCount(count.length);
      });
    });
  };

  return intervwrCount;
};

export default Interviewercount;
