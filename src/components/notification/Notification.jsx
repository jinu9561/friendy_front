import React, { useEffect, useState } from "react";
import axios from "axios";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false); // 알림 창 가시성 상태 추가
    const [friendRequests, setFriendRequests] = useState([]); // 친구 요청 상태 추가

    useEffect(() => {
        const eventSource = new EventSource("http://localhost:9000/notification/stream");

        eventSource.onmessage = function(event) {
            console.log("새 알림: ", event.data);
            setNotifications(prevNotifications => [...prevNotifications, event.data]);
        };

        eventSource.onerror = function(event) {
            console.error("EventSource 실패:", event);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    // 알림 창 가시성 토글 함수
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);

        // showNotifications가 false이면 친구 요청을 불러옴
        if (!showNotifications) {
            axios({
                url: "http://localhost:9000/friend/request/list",
                method: "get",
                headers: {
                    Authorization: localStorage.getItem("Authorization"),
                },
            })
                .then(res => {
                    setFriendRequests(res.data);
                })
                .catch(err => {
                    console.log(err);
                });
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
                alert("친구 요청을 수락했습니다.");
            })
            .catch(err => {
                console.log(err);
                alert("친구 요청 수락에 실패했습니다.");
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
                alert("친구 요청을 거절했습니다.");
            })
            .catch(err => {
                console.log(err);
                alert("친구 요청 거절에 실패했습니다.");
            });
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px', // 버튼 크기 증가
                }}
                onClick={toggleNotifications}
            >
                <i className="pe-7s-bell"/>
            </button>
            {showNotifications && (
                <div style={{
                    position: 'absolute',
                    top: '50px', // 버튼 바로 아래에 위치하도록 조정
                    right: '0',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    padding: '10px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    width: '400px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    zIndex: '1000'
                }}>
                    <h4>알림</h4>
                    <ul>
                        {friendRequests.length > 0 ? (
                            friendRequests.map((request, index) => (
                                <li key={index}>
                                    {request.senderName}님이 친구 요청을 보냈습니다.
                                    <button onClick={() => handleAcceptRequest(request.friendRequestSeq)} style={{ marginLeft: "15px" }}>수락</button>
                                    <button onClick={() => handleRejectRequest(request.friendRequestSeq)} style={{ marginLeft: "15px" }}>거절</button>
                                </li>
                            ))
                        ) : (
                            <li></li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Notification;
