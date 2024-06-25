import React, { Fragment, useState, useEffect, useRef } from 'react';
import LayoutOne from "../../../layouts/LayoutOne";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Breadcrumb from "../../../wrappers/breadcrumb/Breadcrumb";
import { useLocation , useNavigate } from "react-router-dom";
import SEO from "../../seo";

const SaveForm = () => {
    const [userName, setUserName] = useState(localStorage.getItem('userId'));
    const meetUpNameInput = useRef(null);
    const [interestList, setInterestList] = useState([]);
    const [maxParticipants, setMaxParticipants] = useState(0);
    const [files, setFiles] = useState([]);
    const [meetUpDateTime, setMeetUpDateTime] = useState('');
    const [password, setPassword] = useState('');
    let { pathname } = useLocation();
    const navigate = useNavigate();

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

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        let userSeq = localStorage.getItem("userSeq");

        formData.append("userSeq", userSeq);
        formData.append("meetUpName", meetUpNameInput.current.value);
        formData.append("userName", userName);
        formData.append("meetUpDesc", e.target.meetUpDesc.value);
        formData.append("interestSeq", e.target.interestCategory.value); // 키값(interestSeq)을 추가
        formData.append("meetUpMaxEntry", maxParticipants);
        formData.append("meetUpDeadLine", meetUpDateTime);
        formData.append("meetUpPwd", password);
        files.map((file) => {
            formData.append("file", file);
        });
        console.log(Array.from(formData));


        axios
            .post("http://localhost:9000/partyBoard/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                alert("폼이 성공적으로 제출되었습니다!");
                console.log(response.data);
                // 성공 시 MeetUpBoard 페이지로 이동
                navigate('/MeetUpBoard');
            })
            .catch((error) => {
                console.error("폼 제출 중 오류가 발생했습니다!", error);
            });
    };
    useEffect(() => {
        meetUpNameInput.current.focus();
        meetUpNameInput.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    return (
        <Fragment>
            <SEO
                titleTemplate="Shop Page"
                description="Shop page of flone react minimalist eCommerce template."
            />
            <LayoutOne headerTop="visible">
                <Breadcrumb
                    pages={[
                        { label: "Home", path: process.env.PUBLIC_URL + "/" },
                        { label: "CreateMeetUp", path: process.env.PUBLIC_URL + pathname }
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
                            <Col xs={6}>
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
                                        <option key={interest.interestSeq} value={interest.interestSeq}>
                                            {interest.interestCategory}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>
                            <Col xs={6}>
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
                        <Row>
                            <Col>
                                <Form.Label htmlFor="meetUpDateTime">날짜와 시간 선택</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    id="meetUpDateTime"
                                    name="meetUpDateTime"
                                    value={meetUpDateTime}
                                    onChange={(e) => setMeetUpDateTime(e.target.value)}
                                    style={{
                                        border: '2px solid #ffb3b3',
                                    }}
                                />
                            </Col>
                        </Row>
                        <Form.Label htmlFor="password">비밀번호</Form.Label>
                        <Form.Control
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                border: '2px solid #ffb3b3',
                                marginBottom: '1rem',
                            }}
                        />
                        <Form.Label htmlFor="file">파일 첨부</Form.Label>
                        <form
                            style={{
                                backgroundColor: '#ffb3b3',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}>
                            <input type="file" id="file" onChange={handleFileChange} multiple="multiple"></input>
                        </form>

                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#ffb3b3',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                margin: '1%'
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
