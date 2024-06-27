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
          <br/>
          <input
              type="text"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
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
      </div>
  );
};

export default FriendRequestForm;