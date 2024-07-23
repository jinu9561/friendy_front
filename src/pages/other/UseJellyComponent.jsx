import React, {useState} from 'react';
import axios from "axios";

const UseJellyComponent = ({ userSeq }) => {
    const [jellyAmount, setJellyAmount] = useState(2); // 젤리 양
    const [amount, setAmount] = useState(0); // 금액
    const [message, setMessage] = useState('');

    const useJellyHandler = async () => {
        try {
            const token = localStorage.getItem("Authorization");
            console.log(`userSeq: ${userSeq}, token: ${token}`);
            const response = await axios.post(`http://localhost:9000/jelly/use/${userSeq}`, {
                jellyAmount: jellyAmount,
                amount: amount,
                transactionType: "USE" // 트랜잭션 타입
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
            <h3>USe Jelly</h3>
            <button onClick={useJellyHandler}>Use Jelly</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UseJellyComponent;