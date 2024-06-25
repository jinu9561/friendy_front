import React, { useState } from 'react';
import axios from "axios";


const FriendRequestForm = () => {
  const [friendRequest, setFriendRequest] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');

  const requestFriend = ()=>{
    
    axios({
      url:"http://localhost:9000/friend/request" ,
      method:"post",
      headers: {
        Authorization: localStorage.getItem("Authorization"),
      },
      params: {
        receiverId: receiverId, // receiverId를 파라미터로 전송
      },
    })
    .then((res) => {
      setFriendRequest(res.data);
      setMessage('친구요청 성공');
    })
    .catch((err) => {
      console.log(err);
      setMessage('친구요청 실패');
    })
  }

  const handleClick = () => {
    requestFriend();
  }

  return (
      <div>
        <label>
          친구 ID:
          <input
              type="text"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              required
          />
        </label>
        <button onClick={handleClick} style={{fontSize: "15px"}}>친구요청</button>
        {message && <p>{message}</p>}
      </div>
  );
};

export default FriendRequestForm;