interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageNumbers = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const buttonBaseClasses = "px-4 py-2 rounded-md transition-all duration-200 font-medium";
  const activeButtonClasses = "bg-black text-white hover:bg-gray-800";
  const inactiveButtonClasses = "bg-white text-black border border-gray-300 hover:bg-gray-100";
  const disabledButtonClasses = "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200";

  return (
    <nav className="flex justify-center items-center space-x-2 my-8 select-none">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${buttonBaseClasses} ${
          currentPage === 1 ? disabledButtonClasses : inactiveButtonClasses
        }`}
        aria-label="Previous page"
      >
        <span className="sr-only">Previous</span>
        <span aria-hidden="true">←</span>
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`${buttonBaseClasses} ${inactiveButtonClasses}`}
            aria-label="Go to first page"
          >
            1
          </button>
          {startPage > 2 && (
            <span className="px-2 text-gray-500" aria-hidden="true">
              ...
            </span>
          )}
        </>
      )}

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`${buttonBaseClasses} ${
            currentPage === number ? activeButtonClasses : inactiveButtonClasses
          }`}
          aria-label={`Go to page ${number}`}
          aria-current={currentPage === number ? "page" : undefined}
        >
          {number}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-2 text-gray-500" aria-hidden="true">
              ...
            </span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`${buttonBaseClasses} ${inactiveButtonClasses}`}
            aria-label="Go to last page"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${buttonBaseClasses} ${
          currentPage === totalPages ? disabledButtonClasses : inactiveButtonClasses
        }`}
        aria-label="Next page"
      >
        <span className="sr-only">Next</span>
        <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
}