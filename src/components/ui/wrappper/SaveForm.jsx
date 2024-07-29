import React, { Fragment, useState, useEffect, useRef } from 'react';
import LayoutOne from "../../../layouts/LayoutOne";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Breadcrumb from "../../../wrappers/breadcrumb/Breadcrumb";
import { useLocation, useNavigate } from "react-router-dom";
import SEO from "../../seo";

const SaveForm = () => {
    const [userName, setUserName] = useState(localStorage.getItem('userId'));
    const meetUpNameInput = useRef(null);
    const [interestList, setInterestList] = useState([]);
    const [maxParticipants, setMaxParticipants] = useState(0);
    const [files, setFiles] = useState([]);
    const [meetUpDateTime, setMeetUpDateTime] = useState('');
    const [password, setPassword] = useState('');
    const [meetUpPlace, setMeetUpPlace] = useState('');
    let { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:9000/partyBoard/interestList")
            .then((result) => {
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
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        let userSeq = localStorage.getItem("userSeq");

        formData.append("userSeq", userSeq);
        formData.append("meetUpName", meetUpNameInput.current.value);
        formData.append("userName", userName);
        formData.append("meetUpDesc", e.target.meetUpDesc.value);
        formData.append("interestSeq", e.target.interestCategory.value);
        formData.append("meetUpMaxEntry", maxParticipants);
        formData.append("meetUpDeadLine", meetUpDateTime);
        formData.append("meetUpPwd", password);
        formData.append("meetUpPlace", meetUpPlace);
        files.map((file) => {
            formData.append("file", file);
        });

        axios
            .post("http://localhost:9000/partyBoard/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                alert("폼이 성공적으로 제출되었습니다!");
                navigate('/MeetUpBoard');
            })
            .catch((error) => {
                console.error("폼 제출 중 오류가 발생했습니다!", error);
            });
    };

    const openWindow = () => {
        const baseUrl = `${process.env.PUBLIC_URL}/Address`;
        const windowFeatures = "width=800,height=600,top=100,left=100,scrollbars=yes,resizable=yes";
        window.open(baseUrl, "_blank", windowFeatures);
    };

    useEffect(() => {
        meetUpNameInput.current.focus();
        meetUpNameInput.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Handle the message event
        const handleMessage = (event) => {
            if (event.origin !== window.location.origin) return; // Ensure security
            if (event.data.address) {
                setMeetUpPlace(event.data.address);
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
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
                        minHeight: '100vh',
                        padding: '2rem',
                    }}
                >
                    <div
                        style={{
                            width: '60%',
                            border: '2px solid #ffb3b3',
                            padding: '2rem',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            backgroundColor: '#fff',
                        }}
                    >
                        <Form
                            style={{
                                width: '100%',
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
                                <Col xs={6}>
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
                                <Col xs={6}>
                                    <Form.Label htmlFor="password">비밀번호</Form.Label>
                                    <Form.Control
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="비밀번호는 숫자만 입력해주세요"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{
                                            border: '2px solid #ffb3b3',
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={9}>
                                    <Form.Label htmlFor="location">장소</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="meetUpPlace"
                                        name="meetUpPlace"
                                        value={meetUpPlace}
                                        readOnly
                                        placeholder={"검색버튼을 눌러주세요 "}
                                        onChange={(e) => setMeetUpPlace(e.target.value)}
                                        style={{
                                            border: '2px solid #ffb3b3',
                                            marginBottom: '1rem',
                                        }}
                                    />
                                </Col>
                                <Col xs={3} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <button
                                        onClick={openWindow}
                                        type="button"
                                        style={{
                                            backgroundColor: '#ffb3b3',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            width: '100%',
                                            marginBottom: "5%"
                                        }}
                                    >
                                        검색
                                    </button>
                                </Col>
                            </Row>
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
                            {files.length > 0 && (
                                <div style={{ marginTop: '1rem' }}>
                                    <h5>업로드된 사진:</h5>
                                    <h6> 업로드 된 사진은 소모임 제목 밑에 출력됩니다.</h6>
                                    <ul>
                                        {files.map((file, index) => (
                                            <li key={index}>
                                                {file.type.startsWith('image/') ? (
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={file.name}
                                                        style={{ maxWidth: '100px', marginRight: '10px' }}
                                                    />
                                                ) : (
                                                    file.name
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <button
                                type="submit"
                                style={{
                                    backgroundColor: '#ffb3b3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginTop: '1rem',
                                    width: '100%',
                                }}
                            >
                                저장
                            </button>
                        </Form>
                    </div>
                </div>
            </LayoutOne>
        </Fragment>
    );
};

export default SaveForm;
