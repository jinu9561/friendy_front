import React from 'react';

const InterestList = ({profileData}) => {
    return (
        <div>
            <ul className="interest-list">
                {profileData.interestList.map((interestDTO, index) => (
                    <li key={interestDTO.interestSeq} className="interest-item">
                        <span className="interest-icon">⭐</span>
                        <strong>{interestDTO.interestCategory}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InterestList;