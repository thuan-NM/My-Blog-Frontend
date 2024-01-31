import React from 'react';

const Pagination = ({page, pageSize, totalPages, onPageChange}) => {
    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;

    const handlePageChange= (newPage) =>{
        if (newPage >=1 && newPage <= totalPages && newPage !== page){
            onPageChange(newPage);
        }
    };
    
    if(totalPages===0) totalPages =1;

    return (
        <div className="d-flex justify-content-center">
          <button className="pagination-item"onClick={() => handlePageChange(1)} disabled={isFirstPage}>
          <i className="bi bi-chevron-double-left"></i>
          </button>
          <button className="pagination-item" onClick={() => handlePageChange(page - 1)} disabled={isFirstPage}>
          <i className="bi bi-chevron-left"></i>
          </button>
          <span className="pagenation-content">{`${page}`}</span>
          <button className="pagination-item" onClick={() => handlePageChange(page + 1)} disabled={isLastPage}>
          <i className="bi bi-chevron-right"></i>
          </button>
          <button className="pagination-item" onClick={() => handlePageChange(totalPages)} disabled={isLastPage}>
          <i className="bi bi-chevron-double-right"></i>
          </button>
        </div>
      );
};

export default Pagination;