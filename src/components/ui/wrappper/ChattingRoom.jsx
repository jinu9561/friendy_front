import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';

const ChattingRoom = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userSeq = searchParams.get('userSeq');
    const roomId = searchParams.get('roomId');
    const chattingRoomSeq = searchParams.get('chattingRoomSeq');
    const roomMasterSeq = searchParams.get('?roomMasterSeq');
    const socketUrl = `ws://localhost:9000/ws/chat?userSeq=${userSeq}&roomId=${roomId}&chattingRoomSeq=${chattingRoomSeq}&roomMasterSeq=${roomMasterSeq}`;

    const socketRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [messageLog, setMessageLog] = useState([]);
    const [noticeText, setNoticeText] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [noticeList, setNoticeList] = useState([]);
    const [selectedNotice, setSelectedNotice] = useState([]);

    let userId = localStorage.getItem('userId');
    let localSeq = localStorage.getItem('userSeq');
    const fetchNotices = () => {
        axios
            .get('http://localhost:9000/chatting/allNotice', {
                params: {
                    roomId: roomId,
                },
            })
            .then((result) => {
                setNoticeList(result.data);
            })
            .catch((error) => {
                alert(error);
            });
    };
    useEffect(() => {
        axios
            .get(`http://localhost:9000/chatting/joinRoom/${chattingRoomSeq}`)
            .then((result) => {
                setMessageLog(result.data);
            })
            .catch((err) => {
                let errMessage =
                    err.response.data.type +
                    '\n' +
                    err.response.data.title +
                    '\n' +
                    err.response.data.detail +
                    '\n' +
                    err.response.data.status +
                    '\n' +
                    err.response.data.instance +
                    '\n' +
                    err.response.data.timestamp;
                alert(errMessage);
            });
    }, [chattingRoomSeq]);

    useEffect(() => {
        fetchNotices();
    }, []);

    useEffect(() => {
        console.log('Connecting to WebSocket:', socketUrl);
        socketRef.current = new WebSocket(socketUrl);

        socketRef.current.onopen = () => {
        };

        socketRef.current.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            console.log(newMessage)
            setChatHistory((prevHistory) => [...prevHistory, newMessage]);
        };

        socketRef.current.onerror = (error) => {
            console.log(error)
            alert('권한이없습니다')
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [socketUrl]);

    // Scroll to the bottom of the chat when new messages are added
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
    const formData = new FormData();

    const showNoticeInput = () => {
        setShowInput(true);
    };

    const hideNoticeInput = () => {
        setShowInput(false);
        setNoticeText('');
    };

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            const messageData = {
                userId,
                message,
                userSeq,
            };
            socketRef.current.send(JSON.stringify(messageData));
            setMessage('');
        }
    };

    const createNotice = () => {
        formData.append('roomId', roomId);
        formData.append('chattingRoomSeq', chattingRoomSeq);
        formData.append('noticeContent', noticeText);

        axios
            .post('http://localhost:9000/chatting/createNotice', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                alert('공지 사항 등록 완료');
                setNoticeText('');
                setShowInput(false); // 입력 필드 초기화 및 입력창 숨김
                fetchNotices();
            })
            .catch((error) => {
                alert('내용을 입력해 주세요');
            });
    };

    const noticeListOpen = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const formatDeadline = (deadline) => {
        const date = new Date(deadline);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const changeNotice = (noticePostSeq) => {
        axios.put(`http://localhost:9000/chatting/changeNotice?noticePostSeq=${noticePostSeq}`)
            .then((response) => {
                setSelectedNotice(response.data);
                alert("성공적으로 변경 되었습니다")
                fetchNotices(); // 최신 공지 사항 리스트 불러오기
            })
            .catch((error) => {
                console.error('공지 변경 중 오류가 발생했습니다!', error);
                alert('공지 변경 중 오류가 발생했습니다.');
            });
    };

    const deleteNotice = (noticeContent, noticeCreateDate, noticePostSeq) => {
        axios
            .delete('http://localhost:9000/chatting/deleteNotice', {
                params: {
                    noticeContent: noticeContent,
                    noticeCreateDate: noticeCreateDate,
                    noticePostSeq: noticePostSeq,
                },
            })
            .then((result) => {
                console.log(result.data);
                alert('삭제 되었습니다');
                fetchNotices(); // Fetch the updated notices
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div style={{ overflow: 'hidden' }}>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    zIndex: 1,
                    backgroundColor: 'white', // 배경색을 추가하여 고정된 div가 다른 요소와 겹치지 않도록 합니다.
                }}
            >
                {noticeList.slice(0, 1).map((list, index) => (
                    <div
                        key={index}
                        style={{
                            width: '97%',
                            height: 'auto',
                            border: '2px solid black',
                            borderRadius: '5px',
                            margin: '1%',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 8fr 1fr',
                        }}
                    >
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/img/meetUpBoard/image-removebg-preview (2).png`}
                            alt="Background"
                            style={{ width: '100%', gridColumn: '1 / 2' }}
                        />
                        <a
                            style={{
                                marginTop: '2%',
                                textAlign: 'center',
                                paddingTop: '30%',
                                gridColumn: '2 / 3',
                            }}
                        >
                            Notice
                        </a>
                        <a style={{ padding: '3%', gridColumn: '3 / 4', wordWrap: 'break-word' }}>
                            {list.noticeContent}
                        </a>
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/img/meetUpBoard/image-removebg-preview (3).png`}
                            alt="Background"
                            style={{
                                margin: '25%',
                                width: '70%',
                                gridColumn: '4 / 5',
                                justifySelf: 'end',
                            }}
                            onClick={() => noticeListOpen()}
                        />
                    </div>
                ))}
                <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
                    <div style={{ marginTop: '8%' }}>공지 사항</div>
                    {noticeList.map((list, index) => (
                        <div
                            style={{ border: 'solid 2px ', borderRadius: '5px', margin: '2%', padding: '2%' }}
                            key={index}
                        >
                            <div className={'noticeContent'} style={{ wordWrap: 'break-word' }}>
                                {' '}
                                내용 : {list.noticeContent}
                            </div>
                            <div className={'noticeCreateDate'}>
                                {' '}
                                날짜 : {formatDeadline(list.noticeCreateDate)}
                            </div>
                            <button
                                style={{
                                    backgroundColor: '#ffb3b3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    margin: '1%',
                                }}
                                onClick={() =>
                                    deleteNotice(
                                        list.noticeContent,
                                        list.noticeCreateDate,
                                        list.noticePostSeq
                                    )
                                }
                            >
                                {' '}
                                삭제하기{' '}
                            </button>
                            <button
                                style={{
                                    backgroundColor: '#ffb3b3',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    margin: '1%',
                                }}
                                onClick={() =>
                                    changeNotice(
                                        list.noticePostSeq
                                    )
                                }

                            >
                                {' '}
                                공지 등록
                            </button>
                        </div>
                    ))}

                    <button onClick={closeModal}>Close</button>
                </Modal>
            </div>

            <div
                ref={chatContainerRef}
                style={{
                    width: '98%',
                    marginLeft: '1%',
                    border: '2px solid #ffb3b3',
                    padding: '1%',
                    borderRadius: '8px',
                    height: '700px',
                    overflow: 'auto',
                    marginTop: '120px',
                }}
            >
                {messageLog.map((list, index) => (
                    <div
                        key={index}
                        style={{ marginTop: '1%', textAlign: list.userSeq == localSeq ? 'right' : 'left' }}
                    >
                        <div
                            style={{
                                backgroundColor: '#ffb3b3',
                                border: 'solid, 2px',
                                borderRadius: '3px',
                                fontSize: '0.8rem',
                            }}
                        >
                            {' '}
                            {list.userSeq == localSeq ? list.sender + '(나) ' : list.sender}
                        </div>
                        <div
                            style={{
                                padding: '3px',
                                backgroundColor: '#F5F5F5',
                                border: 'solid, 2px',
                                borderRadius: '3px',
                                fontSize: '0.8rem',
                                textAlign: list.userSeq == localSeq ? 'right' : 'left',
                            }}
                        >
                            {' '}
                            {list.chattingContent} ({list.chattingCreateDate})
                        </div>
                    </div>
                ))}
                {chatHistory.map((msg, index) => (
                    <div style={{ marginTop: '1%' }} key={index}>
                        <div
                            style={{
                                padding: '3px',
                                backgroundColor: '#ffb3b3',
                                border: 'solid, 2px',
                                borderRadius: '3px',
                                fontSize: '0.8rem',
                                textAlign: msg.senderSeq == localSeq ? 'right' : 'left',
                            }}
                        >

                            {msg.senderSeq == localSeq ? msg.senderNickname + '(나) ' : msg.senderNickname}
                            {' '}
                        </div>
                        <div
                            style={{
                                padding: '3px',
                                backgroundColor: '#F5F5F5',
                                border: 'solid, 2px',
                                borderRadius: '3px',
                                fontSize: '0.8rem',
                                textAlign: msg.senderSeq == localSeq ? 'right' : 'left',
                            }}
                        >
                            {msg.message} ({msg.nowTime})
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    value={message}
                    onChange={handleMessageChange}
                    onKeyPress={handleKeyPress}
                    style={{
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        width: '100%',
                        border: 'solid 1px ',
                        borderRadius: '5px',
                        marginTop: '2%',
                    }}
                />
            </div>
            <div>
                <button
                    style={{
                        backgroundColor: '#ffb3b3',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        margin: '1%',
                    }}
                    onClick={handleSendMessage}
                >
                    전송
                </button>
                {localSeq === roomMasterSeq && (
                    <div>
                        <button
                            style={{
                                backgroundColor: '#ffb3b3',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                margin: '1%',
                            }}
                            onClick={showNoticeInput}
                        >
                            공지 작성하기
                        </button>
                        {showInput && (
                            <div>
                                <input
                                    type="text"
                                    value={noticeText}
                                    onChange={(e) => setNoticeText(e.target.value)}
                                    placeholder="공지 내용을 입력하세요"
                                    style={{
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        width: '100%',
                                    }}
                                />
                                <button
                                    style={{
                                        backgroundColor: '#ffb3b3',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        margin: '1%',
                                    }}
                                    onClick={createNotice}
                                >
                                    확인
                                </button>
                                <button
                                    style={{
                                        backgroundColor: '#ffb3b3',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        margin: '1%',
                                    }}
                                    onClick={hideNoticeInput}
                                >
                                    닫기
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChattingRoom;
