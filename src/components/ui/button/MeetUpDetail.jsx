import React from 'react';
import { useNavigate } from 'react-router-dom';

const MeetUpDetail = ({ meetUpName , meetUpDesc , meetUpSeq}) => {
    const navigate = useNavigate();

    const handleDetailClick = () => {
        navigate(process.env.PUBLIC_URL + "/MeetUpDetail", {
            state: {
                meetUpSeq: meetUpSeq,
                meetUpName: meetUpName
            }
        });
    };

    return (
        <div style={{
            marginTop:'5%',
            marginLeft:'17%',
            display: 'flex',
            justifyContent: 'flex-end',
            backgrundColor: 'transparent',
            width : '85%',
            height: '20%'
        }}>
            <button
                style={{
                    margin:'3%',
                    marginBottom:'5%',
                    marginRight: '13%',
                    display: 'inline-block',
                    width: '30%',
                    height:'30%',
                    fontSize: '12px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    verticalAlign: 'middle',
                    backgroundColor: '#ffb3b3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6%',
                    cursor: 'pointer',
                }}
                onClick={handleDetailClick}
            >

                상세보기
            </button>
        </div>
    );
};

export default MeetUpDetail;
