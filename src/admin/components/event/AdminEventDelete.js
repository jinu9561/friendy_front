import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminEventDelete = ({ eventSeq, onDeleteSuccess }) => {
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:9000/admin/event/delete/${eventSeq}`);
            alert("삭제되었습니다");
            onDeleteSuccess();
            navigate("/adminEvent");
            window.location.reload();
        } catch (error) {
            console.error("이벤트 삭제 중 오류 발생:", error);
            alert("삭제에 실패했습니다.");
        }
    };

    return (
        <button onClick={handleDelete} className="delete-button">
            삭제
        </button>
    );
};

export default AdminEventDelete;