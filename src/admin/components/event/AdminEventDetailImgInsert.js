import React, {Fragment, useState } from "react";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import Breadcrumb from "../../../wrappers/breadcrumb/Breadcrumb";
import LayoutOne from "../../../layouts/LayoutOne";

const AdminEventDetailImgInsert = () => {
    const [eventSeq, setEventSeq] = useState("");
    const [file, setFile] = useState(null);
    const navigate  = useNavigate();
    let { pathname } = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("eventSeq", eventSeq);

        try {
            await axios.post("http://localhost:9000/admin/event/picture/insert", formData);
            navigate("/adminEvent");
        } catch (error) {
            alert("이미지 업로드에 실패했습니다.");
        }
    };

    return (
        <Fragment>
            <LayoutOne headerTop="visible">
                <Breadcrumb
                    pages={[
                        {label: "Home", path: process.env.PUBLIC_URL + "/" },
                        {label: "InsertDetailImg", path: process.env.PUBLIC_URL + pathname }
                    ]}
                />

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '40vh',
                        backgroundColor: '#f5f5f5',
                        padding: '2rem',
                    }}
                >
        <div>
            <h2>이벤트 세부 이미지 등록</h2>
            <form onSubmit={handleSubmit}>
                <label>이벤트 Number:</label>
                <input
                    type="text"
                    value={eventSeq}
                    onChange={(e) => setEventSeq(e.target.value)}
                />
                <label>세부 이미지:</label>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
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

export default AdminEventDetailImgInsert;