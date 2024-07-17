import React, { useState } from 'react';
import axios from "axios";

const FriendRequestForm = () => {
    const [friendRequest, setFriendRequest] = useState([]);
    const [receiverNickname, setReceiverNickname] = useState('');
    const [suggestions, setSuggestions] = useState([]); // 연관 검색어 리스트
    const [message, setMessage] = useState('');

    const requestFriend = () => {
        axios({
            url: "http://localhost:9000/friend/request",
            method: "post",
            headers: {
                Authorization: localStorage.getItem("Authorization"),
            },
            params: {
                receiverNickname: receiverNickname, // receiverNickname을 파라미터로 전송
            },
        })
            .then((res) => {
                setFriendRequest(res.data);
                setMessage('친구요청 성공');
            })
            .catch((err) => {
                console.log(err);
                setMessage('친구요청 실패');
            });
    };

    const handleClick = () => {
        requestFriend();
    };

    const handleInputChange = (e) => {
        const { value } = e.target;
        setReceiverNickname(value);

        // 닉네임 검색 API 호출
        if (value) {
            axios({
                url: "http://localhost:9000/users/search",
                method: "get",
                params: { nickname: value },
            })
                .then((res) => {
                    setSuggestions(res.data); // 검색 결과 업데이트
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setSuggestions([]); // 입력값이 없으면 연관 검색어 리스트를 비움
        }
    };

    const handleSuggestionClick = (nickname) => {
        setReceiverNickname(nickname); // 선택한 닉네임으로 설정
        setSuggestions([]); // 연관 검색어 리스트 비우기
    };

    return (
        <div>
            <label>
                <br />
                <input
                    type="text"
                    value={receiverNickname}
                    onChange={handleInputChange}
                    required
                    placeholder="닉네임으로 친구요청"
                    style={{
                        color: '#999',
                        backgroundColor: '#f3f7fb',
                        height: '35px',
                        width: '260px',
                        fontSize: '14px',
                    }}
                />
            </label>
            <button
                onClick={handleClick}
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
                }}
            >
                친구요청
            </button>
            {message && <p>{message}</p>}
            {suggestions.length > 0 && (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {suggestions.map((user) => (
                        <li
                            key={user.userSeq}
                            onClick={() => handleSuggestionClick(user.nickName)}
                            style={{
                                cursor: 'pointer',
                                padding: '5px 10px',
                                backgroundColor: '#f3f7fb',
                                borderBottom: '1px solid #ccc',
                            }}
                        >
                            {user.nickName}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FriendRequestForm;


// import React, { useState } from 'react';
// import axios from "axios";
//
// const FriendRequestForm = () => {
//     const [friendRequest, setFriendRequest] = useState([]);
//     const [receiverId, setReceiverId] = useState('');
//     const [suggestions, setSuggestions] = useState([]); // 연관 검색어 리스트
//     const [message, setMessage] = useState('');
//
//     const requestFriend = () => {
//         axios({
//             url: "http://localhost:9000/friend/request",
//             method: "post",
//             headers: {
//                 Authorization: localStorage.getItem("Authorization"),
//             },
//             params: {
//                 receiverId: receiverId, // receiverId를 파라미터로 전송
//             },
//         })
//             .then((res) => {
//                 setFriendRequest(res.data);
//                 setMessage('친구요청 성공');
//             })
//             .catch((err) => {
//                 console.log(err);
//                 setMessage('친구요청 실패');
//             });
//     };
//
//     const handleClick = () => {
//         requestFriend();
//     };
//
//     const handleInputChange = (e) => {
//         const { value } = e.target;
//         setReceiverId(value);
//
//         // 닉네임 검색 API 호출
//         if (value) {
//             axios({
//                 url: "http://localhost:9000/users/search",
//                 method: "get",
//                 params: { nickname: value },
//             })
//                 .then((res) => {
//                     setSuggestions(res.data); // 검색 결과 업데이트
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                 });
//         } else {
//             setSuggestions([]); // 입력값이 없으면 연관 검색어 리스트를 비움
//         }
//     };
//
//     const handleSuggestionClick = (nickname) => {
//         setReceiverId(nickname); // 선택한 닉네임으로 설정
//         setSuggestions([]); // 연관 검색어 리스트 비우기
//     };
//
//     return (
//         <div>
//             <label>
//                 <br />
//                 <input
//                     type="text"
//                     value={receiverId}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="닉네임으로 친구요청"
//                     style={{
//                         color: '#999',
//                         backgroundColor: '#f3f7fb',
//                         height: '35px',
//                         width: '260px',
//                         fontSize: '14px',
//                     }}
//                 />
//             </label>
//             <button
//                 onClick={handleClick}
//                 style={{
//                     display: 'inline-block',
//                     padding: '5px 10px',
//                     fontSize: '13px',
//                     fontWeight: 'bold',
//                     textAlign: 'center',
//                     whiteSpace: 'nowrap',
//                     verticalAlign: 'middle',
//                     backgroundColor: '#ffb3b3',
//                     color: '#fff',
//                     border: 'none',
//                     borderRadius: '0.25rem',
//                     cursor: 'pointer',
//                     marginLeft: '5px',
//                 }}
//             >
//                 친구요청
//             </button>
//             {message && <p>{message}</p>}
//             {suggestions.length > 0 && (
//                 <ul style={{ listStyleType: 'none', padding: 0 }}>
//                     {suggestions.map((user) => (
//                         <li
//                             key={user.userSeq}
//                             onClick={() => handleSuggestionClick(user.nickName)}
//                             style={{
//                                 cursor: 'pointer',
//                                 padding: '5px 10px',
//                                 backgroundColor: '#f3f7fb',
//                                 borderBottom: '1px solid #ccc',
//                             }}
//                         >
//                             {user.nickName}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };
//
// export default FriendRequestForm;
