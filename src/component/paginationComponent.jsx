import React from 'react';

const PaginationComponent=({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    return (
        <div className='pagination-container'>
            <button
                className='pagination-button'
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &laquo; Previous
            </button>

            {pageNumbers.map((number)=>(
                <button key={number} 
                    className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                    onClick={() => onPageChange(number)}
                >
                        {number}    
                </button>
            ))}

            <button
                className='pagination-button'
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next &raquo;
            </button>
        </div>
    )
}

export default PaginationComponent;