import React, { useEffect, useState } from "react";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

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
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '23px', // 버튼 크기 증가
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
                    width: '300px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    zIndex: '1000'
                }}>
                    <h4>알림</h4>
                    <ul>
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <li key={index}>{notification}</li>
                            ))
                        ) : (
                            <li>새로운 알림이 없습니다.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Notification;