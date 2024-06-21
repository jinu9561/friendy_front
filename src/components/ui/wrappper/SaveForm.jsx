import React, { Fragment, useState, useEffect, useRef } from 'react';
import LayoutOne from "../../../layouts/LayoutOne";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Breadcrumb from "../../../wrappers/breadcrumb/Breadcrumb";
import {useLocation} from "react-router-dom";

const SaveForm = () => {
    const [userName, setUserName] = useState(localStorage.getItem('userId'));
    const meetUpNameInput = useRef(null);
    const [interestList, setInterestList] = useState([]);
    const [maxParticipants, setMaxParticipants] = useState(0);
    let { pathname } = useLocation();

    useEffect(() => {
        axios
            .get("http://localhost:9000/partyBoard/interestList")
            .then((result) => {
                console.log(result.data);
                setInterestList(result.data);
            })
            .catch((err) => {
                let errMessage = err.response.data.type + "\n";
                errMessage += err.response.data.title + "\n";
                errMessage += err.response.data.detail + "\n";
                errMessage += err.response.data.status + "\n";
                errMessage += err.response.data.instance + "\n";
                errMessage += err.response.data.timestamp;
                alert(errMessage);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        meetUpNameInput.current.focus();
        meetUpNameInput.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    return (
        <Fragment>
            <LayoutOne headerTop="visible">
                <Breadcrumb
                    pages={[
                        {label: "Home", path: process.env.PUBLIC_URL + "/" },
                        {label: "CreateMeetUp", path: process.env.PUBLIC_URL + pathname }
                    ]}
                />

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        backgroundColor: '#f5f5f5',
                        padding: '2rem',
                    }}
                >

                    <Form
                        style={{
                            width: '60%',
                            marginTop: '2rem',
                            border: '2px solid #ffb3b3',
                            padding: '2rem',
                            borderRadius: '8px',
                        }}
                        onSubmit={handleSubmit}
                    >
                        <Row>
                            <Col xs={8}>
                                <Form.Label htmlFor="meetUpName"> 소모임 제목 </Form.Label>
                                <Form.Control
                                    type="text"
                                    id="meetUpName"
                                    name="meetUpName"
                                    ref={meetUpNameInput}
                                    style={{
                                        border: '2px solid #ffb3b3',
                                    }}
                                />
                            </Col>
                            <Col xs={4}>
                                <Form.Label htmlFor="userName"> 작성자 </Form.Label>
                                <Form.Control
                                    type="text"
                                    id="userName"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    readOnly
                                    style={{
                                        border: '2px solid #ffb3b3',
                                    }}
                                />
                            </Col>
                        </Row>
                        <Form.Label htmlFor="meetUpDesc">소모임 설명</Form.Label>
                        <Form.Control
                            as="textarea"
                            id="meetUpDesc"
                            name="meetUpDesc"
                            rows={5}
                            style={{
                                border: '2px solid #ffb3b3',
                            }}
                        />
                        <Row>
                            <Col xs={8}>
                                <Form.Label htmlFor="interestCategory">관심사</Form.Label>
                                <Form.Control
                                    as="select"
                                    id="interestCategory"
                                    name="interestCategory"
                                    style={{
                                        border: '2px solid #ffb3b3',
                                    }}
                                >
                                    <option value="">관심사 선택</option>
                                    {interestList.map((interest) => (
                                        <option key={interest.interestSeq} value={interest.interestCategory}>
                                            {interest.interestCategory}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>
                            <Col xs={4}>
                                <Form.Label htmlFor="maxParticipants">최대 참여 인원</Form.Label>
                                <Form.Control
                                    type="number"
                                    id="maxParticipants"
                                    name="maxParticipants"
                                    value={maxParticipants}
                                    onChange={(e) => setMaxParticipants(Math.max(0, e.target.value))}
                                    min={0}
                                    style={{
                                        border: '2px solid #ffb3b3',
                                    }}
                                />

                            </Col>
                        </Row>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#ffb3b3',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            저장
                        </button>
                    </Form>
                </div>


            </LayoutOne>
        </Fragment>
    );
};

export default SaveForm;
