import { Fragment, useState, useEffect } from 'react';
import SEO from "../../components/seo";
import LayoutOne from '../../layouts/LayoutOne';
import MeetUpBoardWrapper from "../../components/ui/wrappper/MeetUpBoardWrapper";
import axios from "axios";

const MeetUpBoard = () => {

    const [interestList , setInterestList] = useState([]);
    const [meetUpList , setMeetUpList] = useState([]);
    useEffect(()=>{
        axios
            .get("http://localhost:9000/partyBoard/selectAll")
            .then((result)=>{
                console.log(result.data);
                setMeetUpList(result.data);

            })
            .catch((err)=>{
                let errMessage = err.response.data.type +"\n";
                errMessage += err.response.data.title +"\n";
                errMessage += err.response.data.detail +"\n";
                errMessage += err.response.data.status +"\n";
                errMessage += err.response.data.instance +"\n";
                errMessage += err.response.data.timestamp;
                alert(errMessage);
            });
    }, []);


    useEffect(()=>{
        axios
            .get("http://localhost:9000/partyBoard/interestList")
            .then((result)=>{
                console.log(result.data);
                setInterestList(result.data);
            })
            .catch((err)=>{
                let errMessage = err.response.data.type +"\n";
                errMessage += err.response.data.title +"\n";
                errMessage += err.response.data.detail +"\n";
                errMessage += err.response.data.status +"\n";
                errMessage += err.response.data.instance +"\n";
                errMessage += err.response.data.timestamp;
                alert(errMessage);
            });
    }, []);

    return (
        <Fragment>
            <LayoutOne headerTop="visible">
                <MeetUpBoardWrapper interestList={interestList} />
            </LayoutOne>
        </Fragment>
    )
}

export default MeetUpBoard;
