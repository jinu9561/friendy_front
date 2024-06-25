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

    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [messageLog, setMessageLog] = useState([]);

    useEffect(() => {
        axios
            .get(`http://localhost:9000/chatting/joinRoom/${chattingRoomSeq}`)
            .then((result) => {
                console.log(result.data);
                setMessageLog(result.data);
                setChatHistory(result.data.map((msg) => ({
                    userSeq: msg.userSeq,
                    message: JSON.parse(msg.chattingContent).message,
                })));
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
            setChatHistory((prevHistory) => [...prevHistory, newMessage]);
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket connection closed.');
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


    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            const messageData = {
                userSeq,
                message,
            };
            socketRef.current.send(JSON.stringify(messageData));
            setMessage('');
        }
    };

    return (
        <div>
            <p>UserSeq: {userSeq}</p>
            <p>RoomId: {roomId}</p>
            <div>
                {chatHistory.map((msg, index) => (
                    <div key={index}>
                        <p>User {msg.userSeq}: {msg.message}</p>
                    </div>
                ))}
            </div>
            <div>
                <input type="text" value={message} onChange={handleMessageChange} />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChattingRoom;
