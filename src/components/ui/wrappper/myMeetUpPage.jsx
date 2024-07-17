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

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    let localUserSeq = localStorage.getItem("userSeq");
    const navigate = useNavigate();

    const handleDelete = (meetUpSeq) => {
        // 삭제 기능 구현
        console.log(`Deleting meetup with seq: ${meetUpSeq}`);
        // axios 요청 등을 통해 서버에 삭제 요청을 보내는 코드를 여기에 추가하세요.
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMasterItems = masterList.slice(indexOfFirstItem, indexOfLastItem);

    const indexOfLastInvite = currentPage * itemsPerPage;
    const indexOfFirstInvite = indexOfLastInvite - itemsPerPage;
    const currentInviteItems = inviteList.slice(indexOfFirstInvite, indexOfLastInvite);

    const indexOfLastApply = currentPage * itemsPerPage;
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
        return `${baseUrl}?userSeq=${userSeq}&?roomMasterSeq=${roomMasterSeq}&roomId=${roomId}&chattingRoomSeq=${chattingRoomSeq}`;
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const deleteRequest = (userSeq, meetUpSeq) => {
        axios
            .delete("http://localhost:9000/partyBoard/request/deletemy", {
                params: { meetUpSeq: meetUpSeq, userSeq: userSeq }
            })
            .then((result) => {
                console.log(result.data);
                // 삭제 요청이 성공하면 applyList 상태를 업데이트하여 렌더링을 다시 하게 함
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
                            <div key={index} className="meetup-item" style={{marginBottom: '20px'}}>
                                <h3>{meetup.meetUpName}</h3>
                                <p>소모임 생성일 : {meetup.meetUpRegDate}</p>
                                <p>소모임 참여인원 : {meetup.nowEntry} / {meetup.meetUpMaxEntry}</p>
                                <p>소모임 만료일 : {meetup.meetUpDeadLine}</p>
                                <button
                                    style={{
                                        margin: '1%',
                                        display: 'inline-block',
                                        width: '10%',
                                        height: '30%',
                                        fontSize: '12px',
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        verticalAlign: 'middle',
                                        backgroundColor: '#ffb3b3',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '0.25rem',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => navigateToMeetUpDetail(meetup.meetUpSeq)}
                                >
                                    상세보기
                                </button>
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
                                    onClick={() => enterChatBoard(localUserSeq, meetup.userSeq, meetup.roomId, meetup.chattingRoomSeq)}
                                >
                                    채팅방 입장하기
                                </button>
                            </div>
                        ))}
                        <div className="pagination">
                            {Array.from({length: Math.ceil(masterList.length / itemsPerPage)}, (_, i) => i + 1).map((pageNumber) => (
                                <button
                                    style={{
                                        margin: '2%',
                                        display: 'inline-block',
                                        width: '1%',
                                        height: '5%',
                                        fontSize: '12px',
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        verticalAlign: 'middle',
                                        backgroundColor: '#ffb3b3',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '0.25rem',
                                        cursor: 'pointer',
                                    }}
                                    key={pageNumber}
                                    onClick={() => paginate(pageNumber)}
                                    className={currentPage === pageNumber ? 'active' : ''}
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
                            <div key={index} className="meetup-item" style={{marginBottom: '20px'}}>
                                <h3>{invite.meetUpName}</h3>
                                <p>소모임 생성일 : {invite.meetUpRegDate}</p>
                                <p>소모임 참여인원 : {invite.nowEntry} / {invite.meetUpMaxEntry}</p>
                                <p>소모임 만료일 : {invite.meetUpDeadLine}</p>

                                <button
                                    style={{
                                        margin: '1%',
                                        display: 'inline-block',
                                        width: '10%',
                                        height: '30%',
                                        fontSize: '12px',
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        verticalAlign: 'middle',
                                        backgroundColor: '#ffb3b3',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '0.25rem',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => navigateToMeetUpDetail(invite.meetUpSeq)}
                                >
                                    상세보기
                                </button>
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
                                    onClick={() => enterChatBoard(localUserSeq, invite.userSeq, invite.roomId, invite.chattingRoomSeq)}
                                >
                                    채팅방 입장하기
                                </button>
                            </div>
                        ))}
                        <div className="pagination">
                            {Array.from({length: Math.ceil(inviteList.length / itemsPerPage)}, (_, i) => i + 1).map((pageNumber) => (
                                <button
                                    style={{
                                        margin: '2%',
                                        display: 'inline-block',
                                        width: '1%',
                                        height: '5%',
                                        fontSize: '12px',
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        verticalAlign: 'middle',
                                        backgroundColor: '#ffb3b3',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '0.25rem',
                                        cursor: 'pointer',
                                    }}
                                    key={pageNumber}
                                    onClick={() => paginate(pageNumber)}
                                    className={currentPage === pageNumber ? 'active' : ''}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="meetup-section" style={{flex: 1, padding: '20px', border: '1px solid #ccc'}}>
                        <h2 style={{textAlign: 'center'}}>신청한 소모임</h2>
                        {currentApplyItems.map((apply, index) => (
                            <div key={index} className="meetup-item" style={{marginBottom: '20px'}}>
                                <h3>{apply.meetUpName}</h3>
                                <p>신청 상태:
                                    {apply.meetUpRequestStatus === 0 ? '심사중' :
                                        apply.meetUpRequestStatus === 1 ? '수락됨' :
                                            apply.meetUpRequestStatus === 2 ? '거절됨' :
                                                '알 수 없음'}
                                </p>

                                <button
                                    style={{
                                        margin: '1%',
                                        display: 'inline-block',
                                        width: '10%',
                                        height: '30%',
                                        fontSize: '12px',
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        verticalAlign: 'middle',
                                        backgroundColor: '#ffb3b3',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '0.25rem',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => navigateToMeetUpDetail(apply.meetUpSeq)}
                                >
                                    상세보기
                                </button>

                                {(apply.meetUpRequestStatus === 0 || apply.meetUpRequestStatus === 2) && (
                                    <button
                                        style={{
                                            margin: '1%',
                                            display: 'inline-block',
                                            width: '10%',
                                            height: '30%',
                                            fontSize: '12px',
                                            textAlign: 'center',
                                            whiteSpace: 'nowrap',
                                            verticalAlign: 'middle',
                                            backgroundColor: '#ff4d4d',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '0.25rem',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => deleteRequest(apply.meetUpSeq, apply.userSeq)}
                                    >
                                        삭제하기
                                    </button>
                                )}
                            </div>
                        ))}
                        <div className="pagination">
                            {Array.from({length: Math.ceil(applyList.length / itemsPerPage)}, (_, i) => i + 1).map((pageNumber) => (
                                <button
                                    style={{
                                        margin: '2%',
                                        display: 'inline-block',
                                        width: '1%',
                                        height: '5%',
                                        fontSize: '12px',
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                        verticalAlign: 'middle',
                                        backgroundColor: '#ffb3b3',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '0.25rem',
                                        cursor: 'pointer',
                                    }}
                                    key={pageNumber}
                                    onClick={() => paginate(pageNumber)}
                                    className={currentPage === pageNumber ? 'active' : ''}
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
