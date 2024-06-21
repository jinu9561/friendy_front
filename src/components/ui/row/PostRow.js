import React from 'react';

// 여러개 출력 버전
// const PostRow = ({
//                      meetUpName,
//                      meetUpSeq,
//                      meetUpDesc,
//                      interest,
//                      meetUpBoardDetailImgNameList,
//                  }) => {
//     return (
//         <div>
//             <h3>{meetUpName}</h3>
//             <p>{meetUpDesc}</p>
//             <p>관심사: {interest}</p>
//             <div>
//                 {meetUpBoardDetailImgNameList.map((imgName, index) => (
//                     <img
//                         key={index}
//                         src={`http://localhost:9000/images/${imgName}`}
//                         alt={`Image ${index}`}
//                         style={{ width: '100px', height: '100px', marginRight: '10px' }}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };




const PostRow = ({
                     meetUpName,
                     meetUpSeq,
                     meetUpDesc,
                     interest,
                     meetUpBoardDetailImgNameList,
                 }) => {
    return (
        <div>
            <h3>{meetUpName}</h3>
            <p>{meetUpDesc}</p>
            <p>관심사: {interest}</p>
            <div>
                {meetUpBoardDetailImgNameList.slice(0, 1).map((imgName, index) => (
                    <img
                        key={index}
                        src={"http://localhost:9000/partyBoard/seqimg?meetUpDetailImg=" + imgName}
                        alt={`Image ${index}`}
                        style={{ width: '100px', height: '100px', marginRight: '10px' }}
                    />
                ))}
            </div>
        </div>
    );
};


export default PostRow;
