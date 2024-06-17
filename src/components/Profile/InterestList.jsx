import React from 'react';

const InterestList = ({profileData}) => {
    return (
        <div>
            <ul className="interest-list">
                {profileData.interestList.map((interestDTO, index) => (
                    <li key={interestDTO.interestSeq} className="interest-item">
                        <strong>{interestDTO.interestCategory}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InterestList;