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
            marginTop:'6%',
            marginLeft:'15%',
            display: 'flex',
            justifyContent: 'flex-end',
            width : '85%',
            height: '20%'
        }}>
            <button
                style={{
                    marginRight: '15%',
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
                    borderRadius: '0.25rem',
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
