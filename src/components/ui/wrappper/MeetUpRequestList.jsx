import React, { Fragment, useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import SEO from "../../seo";
import LayoutOne from '../../../layouts/LayoutOne';
import Breadcrumb from "../../../wrappers/breadcrumb/Breadcrumb";
import axios from "axios";

const MeetUpRequestList = () => {
    const location = useLocation();
    const { meetUpSeq } = location.state;
    const [requestList, setRequestList] = useState([]);
    const [userProfiles, setUserProfiles] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    let { pathname } = useLocation();

    useEffect(() => {
        axios
            .get("http://localhost:9000/partyBoard/request/selectBySeq", {
                params: { meetUpSeq: meetUpSeq },
            })
            .then((result) => {
                setRequestList(result.data);
                console.log(result.data)
            })
            .catch((err) => {
                alert(handleErrorMessage(err));
            });
    }, [meetUpSeq]);

    const handleDetailClick = (userSeq) => {
        axios.get(`http://localhost:9000/partyBoard/request/profile/${userSeq}`)
            .then(response => {
                const profile = response.data;
                const request = requestList.find(req => req.userSeq === userSeq);
                setSelectedProfile({ ...profile, requestText: request.requestText });
                setModalVisible(true);
            })
            .catch(err => {
                alert(handleErrorMessage(err));
            });
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedProfile(null);
    };

    const handler = (requestStatus, userSeq) => {
        axios.put('http://localhost:9000/partyBoard/request/changestatus', {
            meetUpRequestStatus: requestStatus,
            meetUpSeq: meetUpSeq,
            userSeq: userSeq
        })
            .then(response => {
                // Update the requestList state with the new status
                setRequestList(prevList =>
                    prevList.map(request =>
                        request.userSeq === userSeq
                            ? { ...request, meetUpRequestStatus: requestStatus }
                            : request
                    )
                );
            })
            .catch(error => {
                if(error.response.status === 700){
                    alert("최대 참가 인원이 초과됬습니다.")

                }
            });
    };

    const handleErrorMessage = (err) => {
        return `${err.response.data.type}\n${err.response.data.title}\n${err.response.data.detail}\n${err.response.data.status}\n${err.response.data.instance}\n${err.response.data.timestamp}`;
    };

    return (
        <Fragment>
            <SEO
                titleTemplate="MeetUp Requests"
                description="MeetUp requests and user profiles."
            />
            <LayoutOne headerTop="visible">
                <Breadcrumb
                    pages={[
                        { label: "Home", path: process.env.PUBLIC_URL + "/" },
                        { label: "MeetUpRequestManage", path: process.env.PUBLIC_URL + pathname }
                    ]}
                />
                <div className="meetup-request-list">
                    {requestList.map((request, index) => (
                        <div key={request.meetUpRequestSeq} className="request-card">
                            <div className="request-info">
                                <p>{index + 1}<strong> 번 신청</strong> </p>
                                <p><strong>닉네임:</strong> {request.userNickName}</p>
                                <p><strong>신청 상태: </strong>
                                    {request.meetUpRequestStatus === 0 ? '진행중' :
                                        request.meetUpRequestStatus === 1 ? '수락됨' :
                                            request.meetUpRequestStatus === 2 ? '거절됨' :
                                                '알 수 없음'}
                                </p>
                                <button
                                    style={{
                                        backgroundColor: '#ffb3b3',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        marginTop: '0.5rem'
                                    }}
                                    onClick={() => handleDetailClick(request.userSeq)}
                                    className="detail-button"
                                >
                                    신청 상세보기
                                </button>
                            </div>
                            {request.meetUpRequestStatus === 0 && (
                                <Fragment>
                                    <button
                                        style={{
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginRight: '0.5rem'
                                        }}
                                        onClick={() => handler(1, request.userSeq)}
                                    >
                                        수락하기
                                    </button>
                                    <button
                                        style={{
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handler(2, request.userSeq)}
                                    >
                                        거절하기
                                    </button>
                                </Fragment>
                            )}
                            {request.meetUpRequestStatus === 1 && (
                                <button
                                    style={{
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handler(2, request.userSeq)}
                                >
                                    거절하기
                                </button>
                            )}
                            {request.meetUpRequestStatus === 2 && (
                                <button
                                    style={{
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handler(1, request.userSeq)}
                                >
                                    수락하기
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {modalVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            {selectedProfile && (
                                <div className="profile-details">
                                    <span className="close" onClick={closeModal}>&times;</span>
                                    <p><strong>Nickname:</strong> {selectedProfile.nickName}</p>
                                    <p><strong>Email:</strong> {selectedProfile.email}</p>
                                    <p><strong>Country:</strong> {selectedProfile.country}</p>
                                    <p><strong>Gender:</strong> {selectedProfile.gender}</p>
                                    <p><strong>Phone:</strong> {selectedProfile.phone}</p>
                                    <p> 자기 소개 </p>
                                    <input
                                        type="text"
                                        style={{
                                            width: '100%',
                                            border: '2px solid #ffb3b3',
                                            borderRadius: '8px',
                                        }}
                                        readOnly
                                        defaultValue={selectedProfile.requestText}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </LayoutOne>

            {/* Basic CSS for modal */}
            <style jsx>{`
                .meetup-request-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 16px;
                    padding: 16px;
                }
                .request-card {
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    padding: 16px;
                    width: calc(33.333% - 32px);
                    box-sizing: border-box;
                    transition: transform 0.2s;
                }
                .request-card:hover {
                    transform: translateY(-5px);
                }
                .request-info p {
                    margin: 8px 0;
                }
                .detail-button {
                    background-color: #007bff;
                    border: none;
                    color: white;
                    padding: 10px 20px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    margin: 10px 0;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: background-color 0.3s;
                }
                .detail-button:hover {
                    background-color: #0056b3;
                }
                .modal {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: fixed;
                    z-index: 1;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    background-color: rgba(0,0,0,0.4);
                }
                .modal-content {
                    background-color: #fefefe;
                    border-radius: 8px;
                    padding: 20px;
                    width: 80%;
                    max-width: 500px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    position: relative;
                    animation: fadeIn 0.3s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .profile-details p {
                    margin: 10px 0;
                }
                .close {
                    color: #aaa;
                    float: right;
                    font-size: 28px;
                    font-weight: bold;
                    cursor: pointer;
                }
                .close:hover, .close:focus {
                    color: black;
                }
            `}</style>
        </Fragment>
    );
};

export default MeetUpRequestList;
