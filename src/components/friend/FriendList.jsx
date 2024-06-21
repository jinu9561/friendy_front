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
                    alert("친구 목록이 없습니다.");
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

    return (
        showFriendList && (
            <div className="offcanvas offcanvas-end show" tabIndex="-1" style={{ visibility: "visible" }}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">친구 목록</h5>
                    <button type="button" className="btn-close text-reset" onClick={toggleFriendListHandler}></button>
                </div>
                <div className="offcanvas-body">
                    <ul>
                        {friendList.map(friend => (
                            <li key={friend.friendUserSeq}>
                                {friend.friendName}
                                <button
                                    onClick={() => handleChat(friend.friendUserSeq)}
                                    style={{ marginLeft: '15px' }}
                                >
                                    채팅
                                </button>
                                <button
                                    onClick={() => handleDelete(friend.friendUserSeq)}
                                    style={{ marginLeft: '5px' }}
                                >
                                    삭제
                                </button>
                                <button
                                    onClick={() => handleBlock(friend.friendUserSeq)}
                                    style={{ marginLeft: '5px' }}
                                >
                                    차단
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    );
};

export default FriendList;