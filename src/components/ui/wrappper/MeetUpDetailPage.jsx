import React, {Fragment, useState, useEffect} from 'react';
import LayoutOne from '../../../layouts/LayoutOne';
import {useLocation, useNavigate} from "react-router-dom";
import SEO from "../../seo";
import Breadcrumb from "../../../wrappers/breadcrumb/Breadcrumb";
import axios from "axios";
import SendReportMeetUp from "../../report/SendReportMeetUp";

const MeetUpDetailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {meetUpSeq, meetUpName} = location.state;
    let {pathname} = useLocation();
    const [meetUp, setMeetUp] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [updatePassword, setUpdatePassword] = useState('');
    const [showRequestConfirmation, setShowRequestConfirmation] = useState(false);
    const [requestText, setRequestText] = useState('');
    const [showReportModal, setShowReportModal] = useState(false); //신고버튼에서 사용
    const [showJellyConfirmation, setShowJellyConfirmation] = useState(false);
    const [useJelly, setUseJelly] = useState(false);
    const [isRequestSuccessful, setIsRequestSuccessful] = useState(false);

    let localUserSeq = localStorage.getItem("userSeq");

    useEffect(() => {
        console.log("+++++++++++++"+meetUpSeq)
        axios
            .get("http://localhost:9000/partyBoard/meetUpSeq", {
                params: {
                    meetUpSeq: meetUpSeq
                },
            })
            .then((result) => {
                console.log(result.data);
                setMeetUp(result.data);
                console.log(result.data.userSeq);

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

    const handleDelete = () => {
        setShowDeleteConfirmation(!showDeleteConfirmation);
    };

    const handleUpdate = () => {
        setShowUpdateConfirmation(!showUpdateConfirmation);
    };

    const confirmDelete = () => {
        axios
            .delete(`http://localhost:9000/partyBoard/delete?meetUpSeq=${meetUpSeq}&meetUpPwd=${deletePassword}`)
            .then((response) => {
                alert('MeetUp deleted successfully!');
                navigate('/MeetUpBoard');
            })
            .catch((error) => {
                alert('삭제에 실패했습니다 다시 시도해주세요.');
            });
        setShowDeleteConfirmation(false);
        setDeletePassword('');
    };

    const confirmUpdate = () => {
        console.log(updatePassword + '||' + meetUp.meetUpPwd)
        if (updatePassword == meetUp.meetUpPwd) {
            navigate(process.env.PUBLIC_URL + '/MeetUpUpdate', {
                state: {meetUpSeq: meetUpSeq}
            });
        } else {
            alert('Incorrect password. Please try again.');
        }
        setShowUpdateConfirmation(false);
        setUpdatePassword('');
    };

    const handleRequest = () => {
        setShowRequestConfirmation(!showRequestConfirmation);
        if (window.confirm("20젤리를 사용하여 모임에 참여하시겠습니까?")) {
            setIsRequestSuccessful(true);
        }
    };

    const confirmRequest = async () => {
        try {
            const formData = new FormData();
            formData.append("userSeq", localUserSeq);
            formData.append("meetUpSeq", meetUpSeq);
            formData.append("requestText", requestText);

            await axios.post("http://localhost:9000/partyBoard/request", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert('MeetUp 신청이 성공적으로 완료되었습니다!');

            const token = localStorage.getItem("Authorization");
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }
            const response = await axios.post(`http://localhost:9000/jelly/use/${localUserSeq}`, {
                jellyAmount: "20", // 젤리 양
                amount: "0", // 금액
                transactionType: "USE" // 트랜잭션 타입
            }, {
                headers: {
                    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert(response.data);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message);
            } else {
                console.error("젤리 사용 실패:", error);
                alert('Error occurred. Please try again.');
            }
        } finally {
            setShowRequestConfirmation(false);
            setRequestText('');
        }
    };

    const handleCheckRequests = () => {
        navigate(process.env.PUBLIC_URL + '/MeetUpRequestList', {
            state: {meetUpSeq: meetUpSeq}
        });
    };

    const buildChatUrl = () => {
        const baseUrl = `${process.env.PUBLIC_URL}/ChattingRoom`;

        console.log(meetUp.userSeq);
        return `${baseUrl}?userSeq=${localUserSeq}&?roomMasterSeq=${meetUp.userSeq}&roomId=${meetUp.roomId}&chattingRoomSeq=${meetUp.chattingRoomSeq}`;

    }

    const enterChatBoard = () => {
        const chatUrl = buildChatUrl();
        window.open(chatUrl, 'ChattingRoom', 'width=600,height=700');
    }

    const formatDeadline = (deadline) => {
        const date = new Date(deadline);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
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
                        {label: "Home", path: process.env.PUBLIC_URL + "/"},
                        {label: "MeetUp", path: process.env.PUBLIC_URL + pathname}
                    ]}
                />
                {meetUp && (
                    <div
                        style={{
                            width: '80%',
                            marginTop: '2rem',
                            textAlign: 'center',
                            border: '2px solid #ffb3b3',
                            padding: '2rem',
                            borderRadius: '8px',
                            marginLeft: "10%",
                            marginBottom: "3%"
                        }}
                    >
                        <div
                            style={{
                                width: '80%',
                                fontSize: '150%',
                                marginTop: '2rem',
                                textAlign: 'center',
                                border: '4px solid #ffb3b3',
                                padding: '2rem',
                                borderRadius: '8px',
                                marginLeft: "10%"
                            }}>
                            {meetUp.meetUpName}
                        </div>
                        <div
                            style={{
                                width: '70%',
                                marginTop: '1%',
                                textAlign: 'center',
                                border: '4px solid #ffb3b3',
                                borderRadius: '8px',
                                marginLeft: "15%"

                            }}
                        >
                            <a> 취미 카테고리 : {meetUp.interestCate}</a>
                            <a style={{marginLeft: "40%", fontSize: "100%"}}> 등록일 : {meetUp.meetUpRegDate}</a>
                        </div>
                        <div>
                            {meetUp.meetUpBoardDetailImgNameList.map((imgName, index) => (
                                <img
                                    key={index}
                                    src={"http://localhost:9000/partyBoard/seqimg?meetUpDetailImg=" + imgName}
                                    alt={`Image ${index}`}
                                    style={{
                                        width: '70%',
                                        height: '70%',
                                        margin: '2%',
                                        borderWidth: "5px",
                                        border: "solid",
                                        borderRadius: "10px"
                                    }}
                                />
                            ))}
                        </div>

                        <div style={{
                            width: '60%',
                            marginTop: '2rem',
                            border: '2px solid #ffb3b3',
                            padding: '2%',
                            textAlign: 'left',
                            borderRadius: '8px',
                            marginLeft: "20%",
                            fontSize: "90%",
                            height: "200px"
                        }}>
                            {/*   소모임 설명 */}

                            {meetUp.meetUpDesc}

                        </div>

                        <div style={{
                            width: '80%',
                            marginTop: '2rem',
                            border: '2px solid #ffb3b3',
                            marginBottom: '2%',
                            padding: '2%',
                            textAlign: 'left',
                            borderRadius: '8px',
                            marginLeft: "10%",
                            fontSize: "90%",
                        }}>
                            <div> 주최자 : {meetUp.userName}</div>
                            <div> 모집일 : {formatDeadline(meetUp.meetUpDeadLine)} 까지</div>
                            <div> 모집 인원 : {meetUp.nowEntry} /{meetUp.meetUpMaxEntry} 명</div>
                            <div> 장소 : {meetUp.meetUpPlace }</div>

                            {/*신고버튼*/}
                            <button onClick={() => setShowReportModal(true)}
                                    style={{
                                        display: 'inline-block',
                                        padding: '8px 15px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        verticalAlign: 'middle',
                                        backgroundColor: '#e0e0e0',
                                        color: '#858585',
                                        border: 'none',
                                        borderRadius: '0.3rem',
                                        cursor: 'pointer',
                                    }}>
                                신고
                            </button>
                            {showReportModal && (
                                <SendReportMeetUp
                                    meetUpSeq={meetUpSeq}
                                    meetUpName={meetUpName}
                                    postUserSeq={meetUp.userSeq}
                                    onReportSent={() => setShowReportModal(false)}
                                />
                            )}

                        </div>
                        {localUserSeq == meetUp.userSeq && (
                            <div>
                                <button style={{
                                    backgroundColor: '#ffb3b3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    margin: '1%'

                                }} onClick={handleDelete}>삭제하기
                                </button>
                                <button style={{
                                    backgroundColor: '#ffb3b3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    margin: '1%'
                                }} onClick={handleUpdate}>수정하기
                                </button>
                                <button style={{
                                    backgroundColor: '#ffb3b3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    margin: '1%'

                                }} onClick={handleCheckRequests}>신청서 확인하기
                                </button>
                            </div>
                        )}

                        {meetUp.nowEntry != meetUp.meetUpMaxEntry && localUserSeq !== null && localUserSeq != meetUp.userSeq && meetUp.meetUpStatus === 0 &&
                            (
                                <button
                                    style={{
                                        backgroundColor: '#ffb3b3',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        margin: '2%'
                                    }}
                                    onClick={handleRequest}>신청하기</button>
                            )}

                        {meetUp.nowEntry == meetUp.meetUpMaxEntry && localUserSeq != meetUp.userSeq && (
                            <a
                                style={{
                                    backgroundColor: 'gray',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    margin: '1%',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >신청이 마감되었습니다</a>

                        )}

                        <div>
                            {meetUp && (meetUp.userSeq == localUserSeq || (meetUp.meetUpPeopleList && meetUp.meetUpPeopleList.includes(Number(localUserSeq)))) && (
                                <div style={{margin: '5%'}}>
                                    <button
                                        style={{
                                            backgroundColor: '#ffb3b3',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            margin: '3%',
                                            borderRadius: '4px',
                                            marginRight: '5%',
                                            cursor: 'pointer',
                                        }}
                                        onClick={enterChatBoard}
                                    >
                                        채팅방 입장하기
                                    </button>
                                </div>
                            )}
                        </div>


                        {localUserSeq !== null && localUserSeq != meetUp.userSeq && meetUp.meetUpStatus === 1 &&
                            (
                                <a
                                    style={{
                                        backgroundColor: 'gray',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >모집이 종료되었습니다</a>
                            )}

                        {showDeleteConfirmation && (
                            <div>
                                <input style={{
                                    width: '80%',
                                    marginTop: '2rem',
                                    border: '2px solid #ffb3b3',
                                    padding: '2%',
                                    textAlign: 'left',
                                    borderRadius: '8px',
                                    fontSize: "90%",
                                }}
                                       type="password"
                                       placeholder="삭제를 위해 암호를 입력해 주세요"
                                       value={deletePassword}
                                       onChange={(e) => setDeletePassword(e.target.value)}
                                />
                                <br/>

                                <button style={{
                                    backgroundColor: '#ffb3b3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    margin: '1%'

                                }} onClick={confirmDelete}>확인
                                </button>
                                <button style={{
                                    backgroundColor: '#ffb3b3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }} onClick={() => setShowDeleteConfirmation(false)}>취소
                                </button>
                            </div>
                        )}
                        {showUpdateConfirmation && (
                            <div>
                                <input style={{
                                    width: '80%',
                                    marginTop: '2rem',
                                    border: '2px solid #ffb3b3',
                                    padding: '2%',
                                    textAlign: 'left',
                                    borderRadius: '8px',
                                    fontSize: "90%",
                                }}
                                       type="password"
                                       placeholder="수정을 위해 암호를 입력해주세요"
                                       value={updatePassword}
                                       onChange={(e) => setUpdatePassword(e.target.value)}
                                />
                                <br/>
                                <button style={{
                                    backgroundColor: '#ffb3b3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    margin: '1%'
                                }} onClick={confirmUpdate}> 확인
                                </button>
                                <button style={{
                                    backgroundColor: '#ffb3b3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }} onClick={() => setShowUpdateConfirmation(false)}> 취소
                                </button>
                            </div>
                        )}
                        {showRequestConfirmation && (
                            <div
                                style={{
                                    width: '60%',
                                    marginLeft: '20%',
                                    marginTop: '2rem',
                                    marginBottom: "3%",
                                    border: '2px solid #ffb3b3',
                                    padding: '2rem',
                                    borderRadius: '8px',
                                }}>
                                <p>간단한 자기소개 부탁드립니다 </p>
                                <textarea style={{
                                    width: '100%',
                                    border: '2px solid #ffb3b3',
                                    borderRadius: '8px',
                                }}
                                          placeholder="본인을 소개해주세요"
                                          value={requestText}
                                          onChange={(e) => setRequestText(e.target.value)}
                                />
                                <button onClick={confirmRequest} style={{
                                    backgroundColor: '#ffb3b3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}> 신청 완료
                                </button>

                                <button style={{
                                    margin: "1%",
                                    backgroundColor: '#ffb3b3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }} onClick={() => setShowRequestConfirmation(false)}> 취 소
                                </button>
                            </div>
                        )}
                    </div>
                )}

            </LayoutOne>
        </Fragment>
    );
};

export default MeetUpDetailPage;
