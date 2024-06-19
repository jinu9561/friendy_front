import React from 'react';

const FilterButton = ({ interestCategory, interestSeq }) => {
    return (
        <a
            type="button"
            className="btn btn-secondary btn-sm"
            style={{
                display: 'inline-block',
                width: 'auto',
                padding: '5px 10px',
                fontSize: '12px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                verticalAlign: 'middle',
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                margin: 2
            }}
        >
            {interestCategory}
        </a>
    );
};

export default FilterButton;
