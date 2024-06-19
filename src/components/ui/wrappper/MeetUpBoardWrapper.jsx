    import React from 'react';
    import FilterButton from "../button/FilterButton";

    const MeetUpBoardWrapper = ({ interestList }) => {
        return (
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                width: '70%',
                margin: '0 auto'
            }}>


              <FilterButton interestCategory={"전체"}></FilterButton>

                {interestList.map((interest) => (

                    <FilterButton
                        key={interest.interestSeq}
                        interestCategory={interest.interestCategory}
                        interestSeq={interest.interestSeq}
                    />
                ))}
            </div>
        );
    };

    export default MeetUpBoardWrapper;
