const FilterButton = ({ interestCategory, onClick }) => (
    <button
        onClick={onClick}
        style={{
            display: 'inline-block',
            width: 'auto',
            padding: '5px 10px',
            fontSize: '12px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            verticalAlign: 'middle',
            backgroundColor: '#ffb3b3',
            color: '#fff',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            margin: 2
        }}
    >
        {interestCategory}
    </button>
);

export default FilterButton;
