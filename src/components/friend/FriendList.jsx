import React, { useEffect, useState } from "react";
import axios from "axios";

const FriendList = ({ showFriendList, toggleFriendListHandler }) => {
    const [friendList, setFriendList] = useState([]);

    useEffect(() => {
        if (showFriendList) {
            axios({
                url: "http://localhost:9000/friend/list",
                method: "get",
                headers: {
                    Authorization: localStorage.getItem("Authorization"),
                }
            })
                .then(res => {
                    setFriendList(res.data);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [showFriendList]);

    const handleChat = (friendUserSeq) => {
        // Implement chat functionality here
        alert(`Chat with user ${friendUserSeq}`);
    };

    const handleDelete = (friendUserSeq) => {
        // Implement delete functionality here
        axios({
            url: `http://localhost:9000/friend/delete`,
            method: "delete",
            headers: {
                Authorization: localStorage.getItem("Authorization"),
            },
            params: {
                friendUserId: friendUserSeq,
            },
        })
            .then(res => {
                alert("친구가 삭제되었습니다.");
                setFriendList(friendList.filter(friend => friend.friendUserSeq !== friendUserSeq));
            })
            .catch(err => {
                console.log(err);
                alert("친구 삭제에 실패했습니다.");
            });
    };

    const handleBlock = (friendUserSeq) => {
        // Implement block functionality here
        axios({
            url: `http://localhost:9000/friend/block`,
            method: "post",
            headers: {
                Authorization: localStorage.getItem("Authorization"),
            },
            params: {
                friendUserId: friendUserSeq,
            },
        })
            .then(res => {
                alert("친구가 차단되었습니다.");
                setFriendList(friendList.filter(friend => friend.friendUserSeq !== friendUserSeq));
            })
            .catch(err => {
                console.log(err);
                alert("친구 차단에 실패했습니다.");
            });
    };

    const Button = ({ onClick, children, style }) => (
        <button
            onClick={onClick}
            style={{
                display: 'inline-block',
                padding: '5px 10px',
                fontSize: '13px',
                fontWeight: 'bold',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                verticalAlign: 'middle',
                backgroundColor: '#ffb3b3',
                color: '#fff',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                marginLeft: '5px',
                ...style
            }}
        >
            {children}
        </button>
    );

    return (
        showFriendList && (
            <div className="offcanvas offcanvas-end show" tabIndex="-1" style={{visibility: "visible"}}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">친구 목록</h5>
                    <button type="button" className="btn-close text-reset" onClick={toggleFriendListHandler}></button>
                </div>
                <div className="offcanvas-body">
                    <ul style={{listStyleType: 'none', padding: 0}}>
                        {friendList.map(friend => (
                            <li key={friend.userSeq}
                                style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                                <div style={{
                                    width: '170px',
                                    marginRight: '15px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {friend.nickName}
                                </div>
                                <div>
                                    <Button onClick={() => handleChat(friend.friendUserSeq)}>채팅</Button>
                                    <Button onClick={() => handleDelete(friend.friendUserSeq)}>삭제</Button>
                                    <Button onClick={() => handleBlock(friend.friendUserSeq)}>차단</Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    );
};

export default FriendList;