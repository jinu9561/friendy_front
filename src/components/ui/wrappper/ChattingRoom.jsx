import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios";

const ChattingRoom = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userSeq = searchParams.get('userSeq');
    const roomId = searchParams.get('roomId');
    const chattingRoomSeq = searchParams.get('chattingRoomSeq');

    const socketUrl = `ws://localhost:9000/ws/chat?userSeq=${userSeq}&roomId=${roomId}&chattingRoomSeq=${chattingRoomSeq}`;
    const socketRef = useRef(null);
    const chatContainerRef = useRef(null);

    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [messageLog, setMessageLog] = useState([]);
    let userId = localStorage.getItem("userId");
    let localSeq= localStorage.getItem("userSeq");

    // 채팅 내역 들고오기
    useEffect(() => {
        axios
            .get(`http://localhost:9000/chatting/joinRoom/${chattingRoomSeq}`)
            .then((result) => {
                console.log(result.data);
                setMessageLog(result.data);
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
    }, [chattingRoomSeq]);

    useEffect(() => {
        console.log('Connecting to WebSocket:', socketUrl);
        socketRef.current = new WebSocket(socketUrl);

        socketRef.current.onopen = () => {
            console.log('WebSocket connection established.');
        };

        socketRef.current.onmessage = (event) => {
            console.log('Received message:', event.data);
            const newMessage = JSON.parse(event.data);
            console.log("newMessage:" + newMessage);
            setChatHistory((prevHistory) => [...prevHistory, newMessage]);
        };

        socketRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (socketRef.current) {
                console.log('Closing WebSocket connection.');
                socketRef.current.close();
            }
        };
    }, [socketUrl]);

    // 채팅 기록이 업데이트될 때마다 스크롤을 아래로 이동
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, messageLog]);

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
            setMessage('');
        }
    };

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            const messageData = {
                userId,
                message,
                userSeq
            };
            socketRef.current.send(JSON.stringify(messageData));
            setMessage('');
        }
    };

    return (
        <div style={{overflow: "hidden"}}>
            <div
                ref={chatContainerRef}
                style={{
                    width: '98%',
                    marginLeft: '1%',
                    border: '2px solid #ffb3b3',
                    padding: '1%',
                    borderRadius: '8px',
                    height: "550px",
                    overflow: "auto" // 스크롤 가능하도록 설정
                }}
            >
                {messageLog.map((list, index) => (

                    <div key={index} style={{ marginTop:'1%',  textAlign: list.userSeq == localSeq ? 'right' : 'left' }}>
                        <div style={{backgroundColor:"#ffb3b3" ,border:"solid, 2px", borderRadius:'3px',  fontSize: '0.8rem'}}> {list.userSeq == localSeq ? list.sender+'(나) ' : list.sender}</div>
                        <div style={{ padding:'3px', backgroundColor:"#F5F5F5", border:"solid, 2px", borderRadius:'3px', fontSize: '0.8rem', textAlign: list.userSeq == localSeq ? 'right' : 'left' }}> {list.chattingContent} ({list.chattingCreateDate})</div>
                    </div>
                ))}
                {
                    chatHistory.map((msg, index) => (
                        <div style={{marginTop:'1%'}} key={index}>
                            <div style={{ padding:'3px', backgroundColor:"#ffb3b3", border:"solid, 2px", borderRadius:'3px',  fontSize: '0.8rem', textAlign: 'right' }}> {msg.senderNickname}(나) </div>
                            <div style={{ padding:'3px', backgroundColor:"#F5F5F5", border:"solid, 2px", borderRadius:'3px', fontSize: '0.8rem', textAlign: 'right' }}>{msg.message}  ({msg.nowTime})</div>
                        </div>
                    )
                )}
            </div>
            <div>
                <input
                    type="text"
                    value={message}
                    onChange={handleMessageChange}
                    onKeyPress={handleKeyPress}
                />
                <button
                    style={{
                        backgroundColor: '#ffb3b3',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        margin: '1%'
                    }}
                    onClick={handleSendMessage}
                >
                    전송
                </button>


            </div>
        </div>
    );
};

export default ChattingRoom;
