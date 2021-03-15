import React, { useContext, useState, useEffect } from 'react'
import { firestore, auth } from '../firebase/config';
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';
import { Ring } from 'react-spinners-css';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";

const Candidatestatus = () => {

    const [appliedCandidates, setCandidate] = useState([]);
    const currentLoggedUser = auth.currentUser;
    const userName = currentLoggedUser?.email.split("@")[0];
    const capUserName = userName?.charAt(0).toUpperCase() + userName?.slice(1);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCandidates();
    }, []);

    const getCandidates = () => {
        firestore.collection('candidates').get()
            .then(response => {
                const fetchedCandidates = [];
                response.docs.forEach(document => {
                    const fetchedCandidate = {
                        id: document.id,
                        interviewer: document.data().interviewer,
                        title: document.data().jobAssignTitle,
                        useremail: document.data().userEmail,
                        candidatename: document.data().userEmail,
                        status: document.data().status,
                    };
                    fetchedCandidates.push(fetchedCandidate);
                });
                //(currentLoggedUser?.email === "hrjack@awr.com")) ? fetchedCandidates : setCandidate(fetchedCandidates.filter(email => (email.useremail === currentLoggedUser?.email)));
                if (currentLoggedUser == null || currentLoggedUser?.email === "hrjack@awr.com") {
                    setCandidate(fetchedCandidates)
                }
                else {
                    setCandidate(fetchedCandidates.filter(email => (email.useremail === currentLoggedUser?.email) || (email.interviewer == capUserName)));
                }
                setLoading(false)
                //setCandidate(fetchedCandidates.filter(email => (email.useremail === currentLoggedUser?.email) || (email.useremail =="hrjack@awr.com") ));
            })
    }

    console.log(appliedCandidates)

    // Export Candidate status to PDF
    const exportPDF = () => {
        const unit = "pt";
        const size = "A4";
        const orientation = "portrait";

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Canidate Status";
        const headers = [["CANDIDATE NAME", "CANDIDATE EMAIL", "APPLIED POSITION", "ASSIGNED INTERVIEWER", "STATUS"]];

        const data = appliedCandidates.map(elt => [(elt.candidatename).split("@")[0], elt.useremail, elt.title, elt.interviewer, elt.status]);
        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("report.pdf")

    }

    // Export Candidate Status to CSV
    const headers = [
        { label: "CANDIDATE NAME", key: "candidatename" },
        { label: "CANDIDATE EMAIL", key: "useremail" },
        { label: "APPLIED POSITION", key: "title" },
        { label: "ASSIGNED INTERVIEWER", key: "interviewer" },
        { label: "STATUS", key: "status" }
    ];

    const data = appliedCandidates

    const prettyLink = {
        color: 'white'
    };


    console.log(appliedCandidates)

    const appliedCandidatescolumns = [
        {
            Header: () => (
                <div className="text-center font-weight-bold">
                    Interviewer
                </div>
            ),
            accessor: 'interviewer',
            className: 'font',
            width: 200,
            Cell: row => <div className="text-center h-4">{row.value}</div>,
        },
        {
            Header: () => (
                <div className="text-center font-weight-bold">
                    Candidate Name
                </div>
            ),
            accessor: 'candidatename',
            className: 'font',
            width: 200,
            Cell: row => <div className="text-center h-6">{(row.value).split("@")[0]}</div>,
        },
        {
            Header: () => (
                <div className="text-center font-weight-bold">
                    Candidate Email
                </div>
            ),
            accessor: 'useremail',
            className: 'font',
            width: 230,
            Cell: row => <div className="text-center h-6">{row.value}</div>,
        },
        {
            Header: () => (
                <div className="text-center font-weight-bold">
                    Position
                </div>
            ),
            accessor: 'title',
            className: 'font',
            width: 200,
            Cell: row => <div className="text-center h-6">{row.value}</div>,
        },
        {
            Header: () => (
                <div className="text-center font-weight-bold">
                    Status
                </div>
            ),
            accessor: 'status',
            className: 'font',
            width: 200,
            Cell: row => <div className="text-center h-6">{row.value}</div>,
        }
    ];

    return !loading ? (

        <div className="container-fluid">
            <div className="d-flex flex-row-reverse bd-highlight allExportButton">
                <div className="p-2 bd-highlight mr-5">
                    <button className="btn btn-info exportPDFBtn" onClick={() => exportPDF()}>Generate Report</button>
                </div>

                <div className="p-2 bd-highlight">
                    <button className="btn btn-info exportCSVBtn">
                        <CSVLink data={data} headers={headers} style={prettyLink}>
                            Generate CSV
                        </CSVLink>
                    </button>
                </div>
            </div>
            <div className="d-flex bd-highlight">
                <div class="d-inline-flex p-2 bd-highlight">
                    <ReactTable
                        data={appliedCandidates}
                        columns={appliedCandidatescolumns}
                        className='statusCandidateReactTable'
                        sortable={true}
                        defaultPageSize={5}
                        resizable={false}
                        showPageSizeOptions={false}
                    />
                </div>
            </div>
        </div >

        // <div>
        //     <button className="btn btn-info" onClick={() => exportPDF()}>Generate Report</button>
        //     {/* <ReactTable
        //         data={appliedCandidates}
        //         columns={appliedCandidatescolumns}
        //         className='statusCandidateReactTable'
        //         sortable={true}
        //         defaultPageSize={5}
        //         resizable={false}
        //         showPageSizeOptions={false}
        //     /> */}
        // </div>
    ) : (
        <span><Ring color="black" size={100} /></span>
    )
}

export default Candidatestatus