import React, { useEffect, useState } from "react";
import axios from "axios";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const [reports, setReports] = useState([]);
    const [viewedNotifications, setViewedNotifications] = useState(new Set()); // Track viewed notifications

    useEffect(() => {
        axios.get("http://localhost:9000/friend/request/list", {
            headers: {
                Authorization: localStorage.getItem("Authorization"),
            },
        })
            .then(response => {
                setFriendRequests(response.data);
            })
            .catch(error => {
                console.log("Failed to load friend requests:", error);
            });
    }, []);

    useEffect(() => {
        axios.get("http://localhost:9000/report/result", {
            headers: {
                Authorization: localStorage.getItem("Authorization"),
            },
        })
            .then(response => {
                setReports(response.data);
                const newNotifications = response.data.filter(report => report.reportStatus === 1)
                    .map(report => {
                        switch(report.reportResult) {
                            case 1:
                                return `신고해주신 게시글은 규정위반한 사실을 확인하지 못하였습니다.`;
                            case 2:
                                return `신고해주신 유저는 규정 위반으로 계정이 3일 정지되었습니다.`;
                            case 3:
                                return `신고해주신 유저는 규정 위반으로 영구 정지 되었습니다.`;
                            default:
                                return `신고 처리 결과가 정해지지 않았습니다.`;
                        }
                    });
                setNotifications(prevNotifications => [...prevNotifications, ...newNotifications]);
            })
            .catch(error => {
                console.error("Failed to fetch report results:", error);
            });
    }, []);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (showNotifications) {
            setHasUnreadMessages(false);
            setViewedNotifications(new Set(notifications.map((notif, index) => index)));
        }
    };

    const handleAcceptRequest = (requestId, receiverId) => {
        axios({
            url: `http://localhost:9000/friend/request/accept`,
            method: "post",
            headers: {
                Authorization: localStorage.getItem("Authorization"),
                'Content-Type': 'application/json'
            },
            data: {
                friendRequestSeq: requestId,
                receiverId: receiverId
            },
        })
            .then(res => {
                setFriendRequests(friendRequests.filter(request => request.friendRequestSeq !== requestId));
                alert("친구요청이 허락되었습니다!");
            })
            .catch(err => {
                console.error("친구 요청에 실패 했습니다:", err);
            });
    };

    const handleRejectRequest = (requestId) => {
        axios({
            url: `http://localhost:9000/friend/request/reject`,
            method: "post",
            headers: {
                Authorization: localStorage.getItem("Authorization"),
                'Content-Type': 'application/json'
            },
            data: {
                friendRequestSeq: requestId
            },
        })
            .then(res => {
                setFriendRequests(friendRequests.filter(request => request.friendRequestSeq !== requestId));
                alert("Friend request rejected.");
            })
            .catch(err => {
                console.error("Failed to reject friend request:", err);
            });
    };

    return (
        <div style={{ position: 'relative' }}>
            <button onClick={toggleNotifications} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>
                <i className="pe-7s-bell"/>
                {hasUnreadMessages && <span style={{ color: 'red' }}> (새로운 메시지)</span>}
            </button>
            {showNotifications && (
                <div style={{
                    position: 'absolute',
                    top: '40px',
                    right: '0',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    padding: '10px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    width: '450px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    zIndex: '1000',
                    borderRadius: '0.3rem',
                }}>
                    <h4 style={{ marginTop: '10px', marginLeft: '10px' }}>Notifications</h4><hr/>
                    <ul>
                        {notifications.map((notif, index) => (
                            !viewedNotifications.has(index) && <li key={index}>{notif}</li>
                        ))}
                        {friendRequests.map((request, index) => (
                            <li key={index}>
                                {`${request.senderName}님이 친구요청을 보냈습니다.`}
                                <button onClick={() => handleAcceptRequest(request.friendRequestSeq)}
                                        style={buttonStyle}>수락
                                </button>
                                <button onClick={() => handleRejectRequest(request.friendRequestSeq)}
                                        style={buttonStyle}>거절
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const buttonStyle = {
    padding: '2px 7px',
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    backgroundColor: '#ffb3b3',
    color: '#fff',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    marginLeft: '5px',
};

export default Notification;
