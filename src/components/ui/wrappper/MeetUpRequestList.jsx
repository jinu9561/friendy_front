import React, { Fragment, useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import SEO from "../../seo";
import LayoutOne from '../../../layouts/LayoutOne';
import Breadcrumb from "../../../wrappers/breadcrumb/Breadcrumb";
import axios from "axios";
import defaultProfileImage from "../../../assets/img/prof/default.jpeg";

const MeetUpRequestList = () => {
    const location = useLocation();
    const { meetUpSeq } = location.state;
    const [requestList, setRequestList] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [userList, setUserList] = useState([]);
    let { pathname } = useLocation();
    const [userDetailModalVisible, setUserDetailModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [refuseModalVisible, setRefuseModalVisible] = useState(false);
    const [selectedRequestSeq, setSelectedRequestSeq] = useState(null); // New state
    const [selectedUserProfile, setSelectedUserProfile] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [userCurrentPage, setUserCurrentPage] = useState(1);
    const userItemsPerPage = 5;
    const [refusalReason, setRefusalReason] = useState(''); // New state for refusal reason

    useEffect(() => {
        fetchUserList();
        fetchRequestList();
    }, [meetUpSeq]);

    const fetchUserList = () => {
        axios
            .get("http://localhost:9000/partyBoard/findMeetUpList", {
                params: { meetUpSeq: meetUpSeq }
            })
            .then((result) => {
                setUserList(result.data);
                console.log("userList", result.data);
            })
            .catch((err) => {
                alert(handleErrorMessage(err));
            });
    };

    const fetchRequestList = () => {
        axios
            .get("http://localhost:9000/partyBoard/request/selectBySeq", {
                params: { meetUpSeq: meetUpSeq },
            })
            .then((result) => {
                setRequestList(result.data);
                console.log(result.data);
            })
            .catch((err) => {
                alert(handleErrorMessage(err));
            });
    };

    const handleDetailClick = (userSeq) => {
        axios.get(`http://localhost:9000/partyBoard/request/profile/${userSeq}`)
            .then(response => {
                const profile = response.data;
                const request = requestList.find(req => req.userSeq === userSeq);
                setSelectedProfile({ ...profile, requestText: request.requestText });
                console.log("profile" + request)
                setModalVisible(true);
            })
            .catch(err => {
                alert(handleErrorMessage(err));
            });
    };

    const refuseHandler = (userSeq) => {
        setSelectedRequestSeq(userSeq);
        setRefusalReason('');
        setRefuseModalVisible(true);
    }

    const refuseModalClose = () => {
        setRefuseModalVisible(false);
        setSelectedRequestSeq(null); // Clear the selected request seq
        setRefusalReason(''); // Clear the refusal reason
    }

    const handleUserDetailClick = (user) => {
        setSelectedUserProfile(user);
        setUserDetailModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedProfile(null);
    };

    const closeUserDetailModal = () => {
        setUserDetailModalVisible(false);
        setSelectedUserProfile(null);
    };

    const handlerConfirm = async (requestStatus, userSeq, refuseReason) => {
        try {
            await axios.put('http://localhost:9000/partyBoard/request/changestatus', {
                meetUpRequestStatus: requestStatus,
                meetUpSeq: meetUpSeq,
                userSeq: userSeq,
                refuseReason: refuseReason
            });

            setRequestList(prevList => {
                const updatedList = prevList.map(request =>
                    request.userSeq === userSeq
                        ? { ...request, meetUpRequestStatus: requestStatus }
                        : request
                );

                if (requestStatus === 1) {
                    console.log('요청이 수락됨, 호스트에게 젤리 추가');
                    addJellyToHost();
                } else if (requestStatus === 2) {
                    console.log('요청이 거절됨, 사용자에게 젤리 환불');
                    refundJelly(userSeq);

                    const wasAccepted = prevList.find(request => request.userSeq === userSeq).meetUpRequestStatus === 1;
                    if (wasAccepted) {
                        console.log('수락된 후 거절됨, 호스트에게서 젤리 차감');
                        deductJellyFromHost();
                    }
                } else {
                    console.log('처리되지 않은 requestStatus:', requestStatus);
                }

                return updatedList;
            });

            fetchUserList();
        } catch (error) {
            if (error.response && error.response.status === 700) {
                alert("최대 참가 인원이 초과되었습니다.");
            } else {
                console.error("상태 변경 실패:", error);
            }
        }
    };


    const refundJelly = async (userSeq) => {
        try {
            const token = localStorage.getItem("Authorization");
            console.log(`Calling addJelly with userSeq: ${userSeq}`);
            console.log(`userSeq: ${userSeq}, token: ${token}`);
            const response = await axios.post(`http://localhost:9000/jelly/refund/${userSeq}`, {
                jellyAmount: "20", // 예시로 젤리 2개 추가
                amount: "0",
                transactionType: "ADD" // 트랜잭션 타입
            }, {
                headers: {
                    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert(response.data);
        } catch (error) {
            console.error("젤리 환불 실패:", error);
        }
    };

    const addJellyToHost = async () => {
        try {
            const token = localStorage.getItem("Authorization");
            // 여기에 현재 로그인한 사용자의 시퀀스를 가져오는 로직을 추가합니다.
            // 예를 들어, localStorage에 저장된 userSeq를 가져온다고 가정합니다.
            const userSeq = localStorage.getItem("userSeq");

            if (!userSeq) {
                throw new Error("현재 로그인한 사용자의 시퀀스를 가져올 수 없습니다.");
            }

            console.log(`Calling addJellyToHost with userSeq: ${userSeq}`);
            const response = await axios.post(`http://localhost:9000/jelly/add/host/${userSeq}`, {
                jellyAmount: "15", // 예시로 젤리 15개 추가
                amount: "0",
                transactionType: "ADD" // 트랜잭션 타입
            }, {
                headers: {
                    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert(response.data);
        } catch (error) {
            console.error("젤리 추가 실패:", error);
        }
    };

    const deductJellyFromHost = async () => {
        try {
            const token = localStorage.getItem("Authorization");
            const userSeq = localStorage.getItem("userSeq");

            if (!userSeq) {
                throw new Error("현재 로그인한 사용자의 시퀀스를 가져올 수 없습니다.");
            }

            console.log(`Calling deductJellyFromHost with userSeq: ${userSeq}`);
            const response = await axios.post(`http://localhost:9000/jelly/deduct/host/${userSeq}`, {
                jellyAmount: "15", // 예시로 젤리 15개 차감
                amount: "0",
                transactionType: "DEDUCT" // 트랜잭션 타입
            }, {
                headers: {
                    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert(response.data);
        } catch (error) {
            console.error("젤리 차감 실패:", error);
        }
    };


    const handleErrorMessage = (err) => {
        return `${err.response.data.type}\n${err.response.data.title}\n${err.response.data.detail}\n${err.response.data.status}\n${err.response.data.instance}\n${err.response.data.timestamp}`;
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = requestList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(requestList.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const userIndexOfLastItem = userCurrentPage * userItemsPerPage;
    const userIndexOfFirstItem = userIndexOfLastItem - userItemsPerPage;
    const currentUserItems = userList.slice(userIndexOfFirstItem, userIndexOfLastItem);
    const userTotalPages = Math.ceil(userList.length / userItemsPerPage);

    const userPaginate = (pageNumber) => setUserCurrentPage(pageNumber);

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
                <div style={{display: 'flex'}}>
                    <div className="meetup-request-list-container"
                         style={{flex: 6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                        <div className="meetup-request-list">
                            {currentItems.map((request, index) => (
                                <div key={request.userSeq || index} className="request-card">
                                    <div className="request-info">
                                        <p>{indexOfFirstItem + index + 1}<strong> 번 신청</strong></p>
                                        <p><strong>닉네임:</strong> {request.userNickName}</p>
                                        <p><strong>신청 상태: </strong>
                                            {request.meetUpRequestStatus === 0 ? '진행중' :
                                                request.meetUpRequestStatus === 1 ? '수락됨' :
                                                    request.meetUpRequestStatus === 2 ? '거절됨' :
                                                        '알 수 없음'}
                                        </p>
                                        {request.meetUpRequestStatus === 2 && (
                                            <p><strong>거절 사유: </strong> {request.refuseReason} </p>
                                        )}
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
                                            className="detail-button">
                                            신청 상세보기
                                        </button>
                                    </div>
                                    {request.meetUpRequestStatus === 0 && (
                                        <>
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
                                                onClick={() => handlerConfirm(1, request.userSeq)}>
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
                                                onClick={() => refuseHandler(request.userSeq)}>
                                                신청 거절하기
                                            </button>
                                        </>
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
                                            onClick={() => handlerConfirm(2, request.userSeq)}>
                                            거절하기
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pagination">
                            {Array.from({length: totalPages}, (_, index) => (
                                <button
                                    style={{margin: '1%'}}
                                    key={index}
                                    onClick={() => paginate(index + 1)}
                                    className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}>
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="inviteList" style={{flex: 4}}>
                        <div style={
                            {
                                textAlign: 'center',
                                marginTop: '1%',
                                marginRight: '20%',
                                backgroundColor: '#ffb3b3',
                                borderRadius: '5px',
                                fontFamily: "Chivo-Medium"
                            }}>
                            모임 참여자 명단
                        </div>

                        {currentUserItems.map((user, index) => (
                            <div style={{
                                width: '80%',
                                margin: '1%',
                                padding: '1%',
                                border: '2px solid #ffb3b3',
                                borderRadius: '8px',
                                marginBottom: "3%"
                            }}
                                 key={user.userSeq || index}>
                                <div style={{marginRight: '5%'}}>{userIndexOfFirstItem + index + 1}. 참여자 닉네임
                                    : {user.nickName}</div>
                                <button
                                    style={{
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        marginTop: '0.5rem'
                                    }}
                                    onClick={() => handleUserDetailClick(user)}>
                                    신청자 상세보기
                                </button>
                            </div>
                        ))}

                        <div className="pagination">
                            {Array.from({length: userTotalPages}, (_, index) => (
                                <button style={{margin: '1%'}}
                                        key={index}
                                        onClick={() => userPaginate(index + 1)}
                                        className={`page-number ${userCurrentPage === index + 1 ? 'active' : ''}`}>
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {refuseModalVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={refuseModalClose}>&times;</span>

                            <p>거절 사유를 입력해 주세요</p>
                            <input
                                type="text"
                                value={refusalReason}
                                onChange={(e) => setRefusalReason(e.target.value)}
                                placeholder="거절 사유를 입력하세요"
                            />
                            <button onClick={() => {
                                if (selectedRequestSeq) {
                                    handlerConfirm(2, selectedRequestSeq, refusalReason);
                                    refuseModalClose();
                                }
                            }}>
                                확인
                            </button>
                        </div>
                    </div>
                )}

                {modalVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            {selectedProfile && (
                                <div className="profile-details">
                                    <span className="close" onClick={closeModal}>&times;</span>
                                    <div style={{display: 'flex'}}>
                                        <div style={{flex: 1, padding: '10px'}}>
                                            <p><strong>신청자 닉네임 :</strong> {selectedProfile.nickName}</p>
                                            <p><strong>이메일 :</strong> {selectedProfile.email}</p>
                                            <p><strong>국적 :</strong> {selectedProfile.country}</p>
                                            <p><strong>성별 :</strong> {selectedProfile.gender}</p>
                                            <p><strong>핸드폰 번호 :</strong> {selectedProfile.phone}</p>
                                        </div>
                                        <div style={{flex: 1, padding: '10px', textAlign: 'center'}}>
                                            <img
                                                style={{
                                                    width: '80%',
                                                    height: 'auto',
                                                    borderRadius: '5%',
                                                    border: '5% solid black'
                                                }}
                                                src={selectedProfile.imgName ? `http://localhost:9000/partyBoard/seqimg?meetUpDetailImg=${selectedProfile.imgName}` : defaultProfileImage}
                                                alt="Profile"
                                            />
                                        </div>
                                    </div>
                                    <p><strong>자기 소개</strong></p>
                                    <textarea
                                        style={{
                                            width: '100%',
                                            height: '100px',
                                            border: '2px solid #ffb3b3',
                                            borderRadius: '8px',
                                            resize: 'none'
                                        }}
                                        readOnly
                                        defaultValue={selectedProfile.requestText}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {userDetailModalVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            {selectedUserProfile && (
                                <div className="profile-details">
                                    <span className="close" onClick={closeUserDetailModal}>&times;</span>
                                    <p><strong>참가자 닉네임 :</strong> {selectedUserProfile.nickName}</p>
                                    <p><strong>이메일 :</strong> {selectedUserProfile.email}</p>
                                    <p><strong>국적 :</strong> {selectedUserProfile.country}</p>
                                    <p><strong>성별 :</strong> {selectedUserProfile.gender}</p>
                                    <p><strong>번호 :</strong> {selectedUserProfile.phone}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </LayoutOne>

            <style>{`
                .meetup-request-list-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                }

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

                .pagination {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                }

                .page-number {
                    background-color: #ffb3b3;
                    border: none;
                    color: white;
                    padding: 10px;
                    margin: 0 5px;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: background-color 0.3s;
                }

                .page-number.active {
                    background-color: #ffb6c1;
                }

                .page-number:hover {
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
                    background-color: rgba(0, 0, 0, 0.4);
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
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
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
