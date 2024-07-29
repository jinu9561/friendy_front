import React from 'react';
import MeetUpDetail from "../button/MeetUpDetail";
import NoImg from '../../../assets/img/meetup/no_img.jpg';

const PostRow = ({
                     meetUpName,
                     meetUpSeq,
                     interest,
                     meetUpBoardDetailImgNameList,
                     meetUpDeadLine
                 }) => {
    const formatDeadline = (deadline) => {
        const date = new Date(deadline);
        return date.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    const getImageSrc = () => {
        if (meetUpBoardDetailImgNameList.length === 0) {
            return NoImg;
        }

        const imgName = meetUpBoardDetailImgNameList[0];
        return imgName ? `http://localhost:9000/partyBoard/seqimg?meetUpDetailImg=${imgName}` : NoImg;
    };

    return (
        <div style={{
            width: '90%',
            height: 'auto', // Allow the container height to adjust
            margin: '2%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            overflow: 'hidden',
            boxSizing: 'border-box'
        }}>
            <h3 style={{
                marginTop: '5%',
                fontSize: '1.5em',
                textAlign: 'center',
                fontFamily: 'Noto Sans KR, sans-serif',
                color: '#333'
            }}>
                {meetUpName}
            </h3>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                margin: '2% 0',
                fontSize: '1em',
                color: '#555'
            }}>
                <div>
                    <span style={{ fontWeight: 'bold' }}>관심사: </span>
                    <span style={{ backgroundColor: '#f0f0f0', borderRadius: '10px', padding: '0.2em 0.5em' }}>{interest}</span>
                </div>
                <div>
                    <span style={{ fontWeight: 'bold' }}>모집 종료일: </span>
                    {formatDeadline(meetUpDeadLine)}
                </div>
            </div>
            <hr style={{ margin: '2% 0', border: 'none', borderBottom: '1px solid #ccc' }} />
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '300px',
                width:'100%',
                overflow: 'hidden',
                border: '2px solid #ddd',
                borderRadius: '10px',
                margin:'1%'

            }}>
                <img
                    src={getImageSrc()}
                    alt="MeetUp"
                    style={{
                        padding:'5px',
                        width: '100%',
                        height: '100%',
                        borderRadius:'5%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                />
            </div>
            <MeetUpDetail
                meetUpSeq={meetUpSeq}
                meetUpName={meetUpName}
            />
        </div>
    );
};

export default PostRow;
