import React from "react";

const Home = () => {
  return (
    <div className="container jumbotron">
      <h1 class="display-4">Hello,</h1>
      <p class="lead">
        This is a simple ATS developed using React and Firebase.
      </p>
      <hr class="my-4" />
      <ul>
        <li>HR - Can access all pages.</li>
        <li>Interviewer- Can access only "Interviewer" page.</li>
        <li>Candidates - Can access only "Candidates & Status" page.</li>
      </ul>
    </div>
  );
};

export default Home;
