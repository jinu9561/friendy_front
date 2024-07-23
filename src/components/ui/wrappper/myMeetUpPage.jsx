import React, { Fragment, useEffect, useState } from 'react';
import SEO from "../../seo";
import LayoutOne from "../../../layouts/LayoutOne";
import Breadcrumb from "../../../wrappers/breadcrumb/Breadcrumb";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const MyMeetUpPage = () => {
    let { pathname } = useLocation();
    const [masterList, setMasterList] = useState([]);
    const [inviteList, setInviteList] = useState([]);
    const [applyList, setApplyList] = useState([]);

    const [currentMasterPage, setCurrentMasterPage] = useState(1);
    const [currentInvitePage, setCurrentInvitePage] = useState(1);
    const [currentApplyPage, setCurrentApplyPage] = useState(1);
    const [itemsPerPage] = useState(6);
    let localUserSeq = localStorage.getItem("userSeq");
    const navigate = useNavigate();

    const handleDelete = (meetUpSeq) => {
        console.log(`Deleting meetup with seq: ${meetUpSeq}`);

    };

    const indexOfLastMasterItem = currentMasterPage * itemsPerPage;
    const indexOfFirstMasterItem = indexOfLastMasterItem - itemsPerPage;
    const currentMasterItems = masterList.slice(indexOfFirstMasterItem, indexOfLastMasterItem);

    const indexOfLastInvite = currentInvitePage * itemsPerPage;
    const indexOfFirstInvite = indexOfLastInvite - itemsPerPage;
    const currentInviteItems = inviteList.slice(indexOfFirstInvite, indexOfLastInvite);

    const indexOfLastApply = currentApplyPage * itemsPerPage;
    const indexOfFirstApply = indexOfLastApply - itemsPerPage;
    const currentApplyItems = applyList.slice(indexOfFirstApply, indexOfLastApply);

    const navigateToMeetUpDetail = (meetUpSeq) => {
        navigate(process.env.PUBLIC_URL + "/MeetUpDetail", {
            state: {
                meetUpSeq: meetUpSeq,
            }
        });
    };

    const enterChatBoard = (userSeq, roomMasterSeq, roomId, chattingRoomSeq) => {
        const chatUrl = buildChatUrl(userSeq, roomMasterSeq, roomId, chattingRoomSeq);
        window.open(chatUrl, 'ChattingRoom', 'width=600,height=700');
    };

    const buildChatUrl = (userSeq, roomMasterSeq, roomId, chattingRoomSeq) => {
        const baseUrl = `${process.env.PUBLIC_URL}/ChattingRoom`;
        return `${baseUrl}?userSeq=${userSeq}&roomMasterSeq=${roomMasterSeq}&roomId=${roomId}&chattingRoomSeq=${chattingRoomSeq}`;
    };

    const paginateMaster = (pageNumber) => setCurrentMasterPage(pageNumber);
    const paginateInvite = (pageNumber) => setCurrentInvitePage(pageNumber);
    const paginateApply = (pageNumber) => setCurrentApplyPage(pageNumber);

    const deleteRequest = (meetUpSeq, userSeq) => {
        axios
            .delete("http://localhost:9000/partyBoard/request/deletemy", {
                params: { meetUpSeq: meetUpSeq, userSeq: userSeq }
            })
            .then((result) => {
                console.log(result.data);
                setApplyList(applyList.filter(apply => apply.meetUpSeq !== meetUpSeq));
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        axios
            .get("http://localhost:9000/partyBoard/findByUserSeq", {
                params: { userSeq: localUserSeq }
            })
            .then((result) => {
                setMasterList(result.data);
                console.log(result.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [localUserSeq]);

    useEffect(() => {
        axios
            .get("http://localhost:9000/partyBoard/findInviteMeetUpByUserSeq", {
                params: { userSeq: localUserSeq }
            })
            .then((result) => {
                setInviteList(result.data);
                console.log(result.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [localUserSeq]);

    useEffect(() => {
        axios
            .get("http://localhost:9000/partyBoard/myRequestList", {
                params: { userSeq: localUserSeq }
            })
            .then((result) => {
                setApplyList(result.data);
                console.log(result.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [localUserSeq]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const cardStyle = {
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        padding: '16px',
        borderRadius: '5px',
        textAlign: 'center',
        backgroundColor: '#fff',
        marginBottom: '20px'
    };

    const buttonStyle = {
        margin: '1%',
        display: 'inline-block',
        width: 'auto',
        padding: '8px 16px',
        fontSize: '12px',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
        backgroundColor: '#ffb3b3',
        color: '#fff',
        border: 'none',
        borderRadius: '0.25rem',
        cursor: 'pointer',
    };

    const deleteButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#ff4d4d'
    };

    const handleCheckRequests = (meetUpSeq) => {
        navigate(process.env.PUBLIC_URL + '/MeetUpRequestList', {
            state: {meetUpSeq: meetUpSeq}
        });
    };

    return (
        <Fragment>
            <SEO
                titleTemplate="My Meet Up Page"
                description="Meet Up page of flone react minimalist eCommerce template."
            />
            <LayoutOne headerTop="visible">
                <Breadcrumb
                    pages={[
                        { label: "Home", path: process.env.PUBLIC_URL + "/" },
                        { label: "MyMeetUp", path: process.env.PUBLIC_URL + pathname }
                    ]}
                />

                <div className="meetup-sections"
                     style={{display: 'flex', justifyContent: 'space-around', marginBottom: '20px'}}>
                    <div className="meetup-section"
                         style={{flex: 1, padding: '20px', border: '1px solid #ccc', marginRight: '10px'}}>
                        <h2 style={{textAlign: 'center'}}>내가 주최한 소모임</h2>
                        {currentMasterItems.map((meetup, index) => (
                            <div key={index} className="meetup-item" style={cardStyle}>
                                <h3>{meetup.meetUpName}</h3>
                                <p><strong>소모임 생성일 : </strong> {meetup.meetUpRegDate}</p>
                                <p><strong>소모임 참여인원 : </strong>{meetup.nowEntry} / {meetup.meetUpMaxEntry}</p>
                                <p><strong>소모임 만료일 :</strong> {meetup.meetUpDeadLine}</p>
                                <button
                                    style={buttonStyle}
                                    onClick={() => navigateToMeetUpDetail(meetup.meetUpSeq)}
                                >
                                    상세보기
                                </button>
                                <button
                                    style={buttonStyle}
                                    onClick={() => enterChatBoard(localUserSeq, meetup.userSeq, meetup.roomId, meetup.chattingRoomSeq)}
                                >
                                    채팅방 입장하기
                                </button>
                                <button style={{
                                    backgroundColor: '#ffb3b3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    margin: '1%'

                                }} onClick={() => handleCheckRequests(meetup.meetUpSeq)}>신청서 확인하기
                                </button>
                            </div>
                        ))}
                        <div className="pagination">
                            {Array.from({length: Math.ceil(masterList.length / itemsPerPage)}, (_, i) => i + 1).map((pageNumber) => (
                                <button
                                    style={buttonStyle}
                                    key={pageNumber}
                                    onClick={() => paginateMaster(pageNumber)}
                                    className={currentMasterPage === pageNumber ? 'active' : ''}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="meetup-section"
                         style={{flex: 1, padding: '20px', border: '1px solid #ccc', marginRight: '10px'}}>
                        <h2 style={{textAlign: 'center'}}>내가 참여하고 있는 소모임</h2>
                        {currentInviteItems.map((invite, index) => (
                            <div key={index} className="meetup-item" style={cardStyle}>
                                <h3>{invite.meetUpName}</h3>
                                <p><strong> 소모임 주최자 : </strong> {invite.nickName} </p>
                                <p><strong> 소모임 참여인원 :</strong>{invite.nowEntry} / {invite.meetUpMaxEntry}</p>
                                <p><strong> 소모임 만료일 :</strong> {invite.meetUpDeadLine}</p>
                                <p><strong> 소모임 주최장소 :</strong> {invite.meetUpPlace}</p>

                                <button
                                    style={buttonStyle}
                                    onClick={() => navigateToMeetUpDetail(invite.meetUpSeq)}
                                >
                                    상세보기
                                </button>
                                <button
                                    style={buttonStyle}
                                    onClick={() => enterChatBoard(localUserSeq, invite.userSeq, invite.roomId, invite.chattingRoomSeq)}
                                >
                                    채팅방 입장하기
                                </button>
                            </div>
                        ))}
                        <div className="pagination">
                        {Array.from({length: Math.ceil(inviteList.length / itemsPerPage)}, (_, i) => i + 1).map((pageNumber) => (
                                <button
                                    style={buttonStyle}
                                    key={pageNumber}
                                    onClick={() => paginateInvite(pageNumber)}
                                    className={currentInvitePage === pageNumber ? 'active' : ''}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="meetup-section" style={{flex: 1, padding: '20px', border: '1px solid #ccc'}}>
                        <h2 style={{textAlign: 'center'}}>신청한 소모임</h2>
                        {currentApplyItems.map((apply, index) => (
                            <div key={index} className="meetup-item" style={cardStyle}>
                                <h3>{apply.meetUpName}</h3>
                                <p><strong>소모임 신청일 : </strong> {formatDate(apply.meetUpRequestDate)}</p>
                                <p>신청 상태:
                                    {apply.meetUpRequestStatus === 0 ? '심사중' :
                                        apply.meetUpRequestStatus === 1 ? '수락됨' :
                                            apply.meetUpRequestStatus === 2 ? '거절됨' :
                                                '알 수 없음'}
                                </p>
                                {apply.meetUpRequestStatus === 2 && (
                                    <p><strong>거절 사유: </strong> {apply.refuseReason} </p>
                                )}

                                <button
                                    style={buttonStyle}
                                    onClick={() => navigateToMeetUpDetail(apply.meetUpSeq)}
                                >
                                    상세보기
                                </button>
                                <button
                                    style={deleteButtonStyle}
                                    onClick={() => deleteRequest(apply.meetUpSeq, localUserSeq)}
                                >
                                    신청 취소하기
                                </button>
                            </div>
                        ))}
                        <div className="pagination">
                            {Array.from({length: Math.ceil(applyList.length / itemsPerPage)}, (_, i) => i + 1).map((pageNumber) => (
                                <button
                                    style={buttonStyle}
                                    key={pageNumber}
                                    onClick={() => paginateApply(pageNumber)}
                                    className={currentApplyPage === pageNumber ? 'active' : ''}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </LayoutOne>
        </Fragment>
    );
};

export default MyMeetUpPage;
