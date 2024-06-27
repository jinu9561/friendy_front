const BlogPagination = ({ currentPage, setCurrentPage, totalPosts, postsPerPage }) => {
  const pageNumbers = [];

  // 페이지 번호 계산
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pro-pagination-style text-center mt-20">
      <ul>
        <li>
          <button
            className="prev"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <i className="fa fa-angle-double-left" />
          </button>
        </li>
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              className={number === currentPage ? "active" : ""}
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            className="next"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageNumbers.length))}
            disabled={currentPage === pageNumbers.length}
          >
            <i className="fa fa-angle-double-right" />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default BlogPagination;
