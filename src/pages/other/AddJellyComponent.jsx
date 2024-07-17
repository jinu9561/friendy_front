import React, { useState } from 'react';
import axios from 'axios';

const AddJellyComponent = ({ userSeq }) => {
    const [jellyAmount, setJellyAmount] = useState(2); // 젤리 양
    const [amount, setAmount] = useState(0); // 금액
    const [message, setMessage] = useState('');

    const addJellyHandler = async () => {
        try {
            alert("@@@!@#!@#");
            const token = localStorage.getItem("Authorization");
            console.log(`userSeq: ${userSeq}, token: ${token}`);
            const response = await axios.post(`http://localhost:9000/jelly/add/${userSeq}`, {
                jellyAmount: jellyAmount,
                amount: amount,
                transactionType: "ADD" // 트랜잭션 타입
            }, {
                headers: {
                    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`
                }
            });
            setMessage(response.data);
        } catch (error) {
            console.error("Error adding jelly:", error);
            setMessage("Failed to add jelly");
        }
    };

    return (
        <div>
            <h3>Add Jelly</h3>
            <button onClick={addJellyHandler}>Add Jelly</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddJellyComponent;
