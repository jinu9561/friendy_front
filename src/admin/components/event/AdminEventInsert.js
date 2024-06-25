import React, { Fragment, useState } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../../../wrappers/breadcrumb/Breadcrumb";
import LayoutOne from "../../../layouts/LayoutOne";


const AdminEventInsert = () => {
    const [eventName, setEventName] = useState("");
    const [eventContent, setEventContent] = useState("");
    const [eventMainImg, setEventMainImg] = useState(null);
    const [eventDeadLine, setEventDeadLine] = useState("");
    const [eventMaxEntry, setEventMaxEntry] = useState(0);
    const navigate  = useNavigate();
    let { pathname } = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("eventName", eventName);
        formData.append("eventContent", eventContent);
        formData.append("file", eventMainImg);
        formData.append("eventDeadLine", eventDeadLine);
        formData.append("eventMaxEntry", eventMaxEntry);

        try {
            await axios.post("http://localhost:9000/admin/event/create", formData);
            alert("이벤트가 성공적으로 등록되었습니다.");
            navigate("/adminEvent");
        } catch (error) {
            alert("이벤트 등록에 실패했습니다.");
        }
    };

    return (
        <Fragment>
            <LayoutOne headerTop="visible">
                <Breadcrumb
                    pages={[
                        {label: "Home", path: process.env.PUBLIC_URL + "/" },
                        {label: "CreateEvent", path: process.env.PUBLIC_URL + pathname }
                    ]}
                />

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        backgroundColor: '#f5f5f5',
                        padding: '2rem',
                    }}
                >

        <div className="admin-event-insert">
            <h2>이벤트 등록</h2>
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
                <br/> <br/>
                <div className="pro-details-cart btn-hover">
                    <button type="submit" style={{ border: '0.5px solid black' }}>등록</button>
                </div>
            </form>
        </div>
                </div>
            </LayoutOne>
        </Fragment>
    );
};

export default AdminEventInsert;