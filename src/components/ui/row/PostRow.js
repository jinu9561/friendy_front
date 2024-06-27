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
        <div style={{ position: 'relative', width: '100%', height:'90%', display: 'inline-block', margin: '5%' }}>
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
                height: '100%'
            }}>
                <h3 style={{ marginTop: '16%', fontSize: '90%', textAlign: 'center', width:'100%' , height:'5%' }}>{meetUpName}</h3>
                <div className={'midWrapper'} style={{ border:'2px solid #FFB3B3', display: 'flex', alignItems: 'center', width:'100%', height:'5%' }}>
                    <span style={{ marginLeft: '2%' ,fontSize:'70%' }} >관심사: </span>
                    <span style={{ marginRight:'17%', marginLeft:'1%', fontSize:'70%', borderRadius: '10px' }}>{interest}</span>
                    <span style={{textAlign:"right" , fontSize:'70%'}}> 모집 종료일:  {formatDeadline(meetUpDeadLine)}</span>
                </div>
                <hr style={{ marginLeft: '5%', width: '90%', marginTop: '2%' }} />
                <a style={{ marginBottom:'10%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '52%', width:'100%',  }}>
                    {meetUpBoardDetailImgNameList.slice(0, 1).map((imgName, index) => (
                        <img
                            key={index}
                            src={"http://localhost:9000/partyBoard/seqimg?meetUpDetailImg=" + imgName}
                            alt={`Image ${index}`}
                            style={{
                                width: '92%',
                                height: '100%',
                                objectFit: 'cover',
                                border:'2px solid #FFB3B3',
                                borderRadius: '10px',
                            }}
                        />
                    ))}
                </a>
                <MeetUpDetail
                    meetUpSeq={meetUpSeq}
                    meetUpName={meetUpName}/>
            </div>
        </div>
    );
};

export default PostRow;
