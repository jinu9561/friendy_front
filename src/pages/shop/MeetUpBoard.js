import React, { Fragment, useState, useEffect } from 'react';
import LayoutOne from '../../layouts/LayoutOne';
import MeetUpBoardWrapper from "../../components/ui/wrappper/MeetUpBoardWrapper";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import SEO from "../../components/seo";

const MeetUpBoard = () => {
    const [interestList, setInterestList] = useState([]);
    const [meetUpListAsc, setMeetUpListAsc] = useState([]);
    const [meetUpListDesc, setMeetUpListDesc] = useState([]);
    const navigate = useNavigate();
    let { pathname } = useLocation();

    useEffect(() => {
        axios
            .get("http://localhost:9000/partyBoard/interestList")
            .then((result) => {
                console.log(result.data);
                setInterestList(result.data);
            })
            .catch((err) => {
                let errMessage = err.response.data.type + "\n";
                errMessage += err.response.data.title + "\n";
                errMessage += err.response.data.detail + "\n";
                errMessage += err.response.data.status + "\n";
                errMessage += err.response.data.instance + "\n";
                errMessage += err.response.data.timestamp;
                alert(errMessage);
            });
    }, []);


        //오래된순
    useEffect(() => {
        axios
            .get("http://localhost:9000/partyBoard/selectAllAsc")
            .then((result) => {
                setMeetUpListAsc(result.data);
                console.log(result.data+"+++++++")

            })
            .catch((err) => {
                let errMessage = err.response.data.type + "\n";
                errMessage += err.response.data.title + "\n";
                errMessage += err.response.data.detail + "\n";
                errMessage += err.response.data.status + "\n";
                errMessage += err.response.data.instance + "\n";
                errMessage += err.response.data.timestamp;
                alert(errMessage);
            });
    }, []);

    //최신순
    useEffect(() => {
        axios
            .get("http://localhost:9000/partyBoard/selectAllDesc")
            .then((result) => {
                setMeetUpListDesc(result.data);
                console.log(result.data+"======")
            })
            .catch((err) => {
                let errMessage = err.response.data.type + "\n";
                errMessage += err.response.data.title + "\n";
                errMessage += err.response.data.detail + "\n";
                errMessage += err.response.data.status + "\n";
                errMessage += err.response.data.instance + "\n";
                errMessage += err.response.data.timestamp;
                alert(errMessage);
            });
    }, []);







    const handleSaveButtonClick = () => {
        navigate(process.env.PUBLIC_URL + "/SaveForm");
    };

    return (
        <div  style={{width:'100%' , height:'100%'}}>
            <SEO
                titleTemplate="Shop Page"
                description="Shop page of flone react minimalist eCommerce template."
            />

            <LayoutOne headerTop="visible">
                <Breadcrumb
                    pages={[
                        {label: "Home", path: process.env.PUBLIC_URL + "/" },
                        {label: "MeetUpBoard", path: process.env.PUBLIC_URL + pathname }
                    ]}
                />
                <MeetUpBoardWrapper
                    interestList={interestList}
                    meetUpListAsc={meetUpListAsc}
                    meetUpListDesc={meetUpListDesc}
                    onSaveButtonClick={handleSaveButtonClick}
                 />
            </LayoutOne>
        </div>
    );
};

export default MeetUpBoard;
