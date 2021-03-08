import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase/config';
import { UserContext } from '../providers/UserProvider'
import { firestore } from '../firebase/config';

import { Pie } from 'react-chartjs-2';


const Profile = () => {

    const labelssArray = [];
    const dataaArray = [];
    const item = "";

    const [ labelsArray, setlabelsArray ] = useState([]);
    const [ dataArray, setdataArray ] = useState([]);
    const [jobsDetails, setJobDetails] = useState([]);
    const [isFirebaseInitialized, setFirebaseInitialized] = useState(false)




    // const getJobsForCandidates = async () => {
	// 	firestore.collection('jobs').get()
    //     .then((snapshot) => {
    //         snapshot.docs.forEach(doc => {
    //             var item = doc.data();
    //             var jobtitle = item.jobtitle;
    //             labelssArray.push(jobtitle);

    //             var jobVacancy = item.totalopenings;
    //             dataaArray.push(jobVacancy);


    //         })
    //     })
    // }

    useEffect(() => {
		(async()=>{
			await firestore.collection('jobs').get()
            .then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    var item = doc.data();
                    var jobtitle = item.jobtitle;
                    labelssArray.push(doc.data().jobtitle);
                    console.log(labelssArray)
    
                    var jobVacancy = item.totalopenings;
                    dataaArray.push(jobVacancy);
    
    
                })
            })
		 })();
	},[labelssArray.length<0]);

    console.log(labelssArray)



    const data = {    
        labels: [
            jobsDetails,
        ],
        datasets: [{
            data: [100],
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#36A2EB',
                '#FFCE56'
            ],
            hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#36A2EB',
                '#FFCE56'
            ]
        }]
    };

    console.log(labelssArray);
    console.log(dataaArray)

    const currentUser = auth.currentUser
    const userMsg = currentUser ? `${currentUser.email} ,Welcome back` : `No user is logged in`;


    return (
        // <div>
        //     <h2>Pie Example</h2>
        //     <Pie data={data} />
        // </div>
        <div class="jumbotron">
            <h1 class="display-4">Hello, {currentUser.email}</h1>
            <p class="lead">This is a simple ATS developed using React and Firebase.</p>
            <hr class="my-4" />
            <ul>
                <li>HR - Can access all pages.</li>
                <li>Interviewer- Can access only "Interviewer" page.</li>
                <li>Candidates - Can access only "Candidates & Status" page.</li>
            </ul>
        </div>
    )
}

export default Profile;