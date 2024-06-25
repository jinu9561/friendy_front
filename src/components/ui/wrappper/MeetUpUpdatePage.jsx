import React, { Fragment, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import axios from "axios";
import SEO from "../../seo";
import LayoutOne from '../../../layouts/LayoutOne';
import Breadcrumb from "../../../wrappers/breadcrumb/Breadcrumb";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const MeetUpUpdatePage = () => {
    const [maxParticipants, setMaxParticipants] = useState(0);
    const location = useLocation();
    const { meetUpSeq } = location.state;
    const [files, setFiles] = useState([]);
    const [meetUp, setMeetUp] = useState(null);
    const [meetUpDateTime, setMeetUpDateTime] = useState('');
    const navigate = useNavigate();
    let { pathname } = useLocation();
    console.log(meetUpSeq + ' 컨스트 meetUpSeq');
    let userId = localStorage.getItem('userId');

    useEffect(() => {
        console.log(meetUpSeq + ' 엑시오스 meetUpSeq');
        axios
            .get("http://localhost:9000/partyBoard/meetUpSeq", {
                params: {
                    meetUpSeq: meetUpSeq
                },
            })
            .then((result) => {
                console.log(result.data);
                setMeetUp(result.data);
                setMeetUpDateTime(result.data.meetUpDeadLine); // 기본 값 설정
                setMaxParticipants(result.data.meetUpMaxEntry); // 기본 값 설정
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
    }, [meetUpSeq]);

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        let userSeq = localStorage.getItem("userSeq");
        formData.append("meetUpSeq", meetUpSeq);
        formData.append("meetUpName", e.target.meetUpName.value);
        formData.append("meetUpDesc", e.target.meetUpDesc.value);
        formData.append("userSeq", userSeq);
        formData.append("meetUpMaxEntry", maxParticipants);
        formData.append("interestSeq", meetUp.interestSeq);
        formData.append("meetUpDeadLine", meetUpDateTime);

        files.forEach((file) => {
            formData.append("file", file);
        });
        console.log(Array.from(formData));

        axios
            .put("http://localhost:9000/partyBoard/update", formData, {
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
                        { label: "MeetUp", path: process.env.PUBLIC_URL + pathname }
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
                    {meetUp && (
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
                                        defaultValue={meetUp.meetUpName}
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
                                        value={userId}
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
                                defaultValue={meetUp.meetUpDesc}
                                style={{
                                    border: '2px solid #ffb3b3',
                                }}
                            />
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
                            <Form.Label htmlFor="file">파일 첨부</Form.Label>
                            <form>
                                fileData1:  <input type="file" id="file" onChange={handleFileChange} multiple="multiple"></input>
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
                                }}
                            >
                                저장
                            </button>
                        </Form>
                    )}
                </div>
            </LayoutOne>
        </Fragment>
    );
};

export default MeetUpUpdatePage;
