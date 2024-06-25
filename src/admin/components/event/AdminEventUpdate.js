import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminEventUpdate = (eventSeq ) => {

    const [eventName, setEventName] = useState("");
    const [eventContent, setEventContent] = useState("");
    const [eventMainImg, setEventMainImg] = useState(null);
    const [eventDeadLine, setEventDeadLine] = useState("");
    const [eventMaxEntry, setEventMaxEntry] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/event/detail/${eventSeq}`);
                const event = response.data;
                setEventName(event.eventName);
                setEventContent(event.eventContent);
                setEventDeadLine(event.eventDeadLine);
                setEventMaxEntry(event.eventMaxEntry);

            } catch (error) {
                alert("이벤트 정보를 불러오는데 실패했습니다.");
            }
        };

        fetchEventDetails();
    }, [eventSeq]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("eventName", eventName);
        formData.append("eventContent", eventContent);
        formData.append("file", eventMainImg);
        formData.append("eventDeadLine", eventDeadLine);
        formData.append("eventMaxEntry", eventMaxEntry);

        try {
            await axios.put(`http://localhost:9000/admin/event/update/${eventSeq}`, formData);
            alert("이벤트가 성공적으로 수정되었습니다.");
            navigate("/adminEvent");
        } catch (error) {
            alert("이벤트 수정에 실패했습니다.");
        }
    };

    return (
        <div className="admin-event-update">
            <h2>이벤트 수정</h2>
            <form onSubmit={handleSubmit}>
                <label>이벤트명:</label>
                <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                />
                <label>이벤트 내용:</label>
                <textarea
                    value={eventContent}
                    onChange={(e) => setEventContent(e.target.value)}
                />
                <label>이벤트 이미지:</label>
                <input
                    type="file"
                    onChange={(e) => setEventMainImg(e.target.files[0])}
                />
                <label>이벤트 마감일:</label>
                <input
                    type="date"
                    value={eventDeadLine}
                    onChange={(e) => setEventDeadLine(e.target.value)}
                />
                <label>최대 참가자 수:</label>
                <input
                    type="number"
                    value={eventMaxEntry}
                    onChange={(e) => setEventMaxEntry(parseInt(e.target.value))}
                />
                <button type="submit">수정</button>
            </form>
        </div>
    );
};

export default AdminEventUpdate;