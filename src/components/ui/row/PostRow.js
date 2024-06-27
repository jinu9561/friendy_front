import React from 'react';
import MeetUpDetail from "../button/MeetUpDetail";

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
    return (
        <div style={{ position: 'relative', width: '70%', height:'90%', display: 'inline-block', margin: '10%' }}>
            <img
                src={`${process.env.PUBLIC_URL}/assets/img/meetUpBoard/1bcbec75802170a9bb9620bb91e261a62.png`}
                alt="Background"
                style={{ display: 'block', width: '100%', border: '2px solid', borderRadius: '3%' }}
            />
            <div style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'black',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                width: '100%',
                height: '100%' // 박스 크기를 100%로 설정
            }}>
                <h3 style={{ marginTop: '16%', fontSize: '80%', textAlign: 'center', fontFamily: 'Noto Sans KR, sans-serif' , width:'100%' , height:'5%' }}>{meetUpName}</h3>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '12%', fontSize: '80%', width:'100%', height:'5%' }}>
                    <span >관심사: </span>
                    <span style={{ marginLeft: '1%', backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        // padding: '2px 8px',
                        borderRadius: '10px' }}>{interest}</span>
                    <span style={{textAlign:"right",marginLeft:"5%"}}> 모집 종료일:  {formatDeadline(meetUpDeadLine)}</span>
                </div>
                <hr style={{ marginLeft: '5%', width: '90%', marginTop: '2%' }} />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50%', width:'100%',  }}>
                    {meetUpBoardDetailImgNameList.slice(0, 1).map((imgName, index) => (
                        <img
                            key={index}
                            src={"http://localhost:9000/partyBoard/seqimg?meetUpDetailImg=" + imgName}
                            alt={`Image ${index}`}
                            style={{
                                width: '92%',
                                height: '92%',
                                objectFit: 'cover',
                                border: '2px solid',
                                borderRadius: '10px'
                            }}
                        />
                    ))}
                </div>
                <MeetUpDetail
                    meetUpSeq={meetUpSeq}
                    meetUpName={meetUpName}/>
            </div>
        </div>
    );
};

export default PostRow;
