// lists the students applied in that particular company 

import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap';
import "./StudentList.css"

function MyVerticallyCenteredModal(props) {

    const { sname, clg, smob, cgpa, semail, t_skills } = props.details;

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {sname}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6>College Name: {clg}</h6>
                <h6>Contact Number: {smob}</h6>
                <h6>Mail Address: {semail}</h6>
                <h6>CGPA: {cgpa}</h6>
                <h6 className='d-flex col-md-5 justify-content-between'>
                    {t_skills}
                </h6>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

function StudentList() {

    const [isAppliedList, setIsAppliedList] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [modalData, setModalData] = useState({})

    const [updated, setUpdated] = useState(false)

    useEffect(() => {
        const fetchData = async () => {

            try {

                await axios.all([
                    axios.get('http://localhost:8080/api/selections/appliedstudentlist/2'), // returning all the students who are selected  // return the selected rows of {id} 
                    axios.get('http://localhost:8080/api/students')
                ])
                    .then(axios.spread((obj1, obj2) => {
                        // Both requests are now complete
                        setIsAppliedList(obj1.data)
                        setStudentList(obj2.data);
                    }));
            } catch (err) {
                console.log(err);
            }

        }

        fetchData();
    }, [updated]);

    // let flag = 0;
     console.log(isAppliedList)
     console.log(studentList);

    // filters the list of student who are already selected or rejected 
    let newfilteredArray = [];
    for (let item of isAppliedList) {
        newfilteredArray.push(studentList.find(student => student.std_id === item.std_id));
    }

     console.log(newfilteredArray);

    /*
        functions handling onClick method 
    */

    const handleOnAccept = async (std_id) => {

        try {
            const res = await axios.put("http://localhost:8080/api/selections/",
                {
                    comp_id: 2,
                    std_id: std_id,
                    is_select: 1,
                    is_applied: 1,
                });
            console.log(res);
            setUpdated(true);
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleOnReject = async (std_id) => {

        try {
            const res = await axios.put("http://localhost:8080/api/selections/delete",
                {
                    comp_id: 2,
                    std_id: std_id,
                });
            console.log(res);
            setUpdated(true);
        }
        catch (err) {
            console.log(err)
        }

    }


    return (
        <main className='studentList'>

            {
                newfilteredArray?.length === 0 ? (
                    <h1>No Student to Display</h1>
                )
                    : (newfilteredArray?.map(element => {

                        return (
                            <section key={element?.std_id} className='card card-box p-3 d-flex flex-row justify-content-between mt-3'>

                                <div className=' col-md-9 '>
                                    <button
                                        onClick={() => {
                                            setModalShow(true);
                                            setModalData(element)
                                        }}
                                        className="custom-btn">
                                        <h3>
                                            {element?.sname}
                                        </h3>
                                    </button>
                                    <p className='text-capitalize'>{element?.t_skills}</p>
                                </div>

                                <div className="button-container d-flex align-items-center justify-content-between col-md-2">
                                    <button type="submit" className='btn btn-success' onClick={() => handleOnAccept(element?.std_id)} >Accept</button>
                                    <button type="submit" className='btn btn-danger' onClick={() => handleOnReject(element?.std_id)} >Reject</button>
                                </div>

                            </section>
                        )
                    }))

            }

            <MyVerticallyCenteredModal
                details={modalData}
                show={modalShow}
                onHide={() => setModalShow(false)}
            />

        </main>
    )
}

export default StudentList
