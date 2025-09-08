import { FlexRow } from "../../styles/layout";
import { Page, Ellipsis } from "./styles";
import toast from "react-hot-toast";
import { errorParser } from "../../helpers/errorParser";
import { useMemo } from "react";

function Pagination({ currentPage, totalPages, setFilters, isLoading }) {
  const isLast = currentPage === totalPages - 1;
  const isFirst = currentPage <= 0;

  const pages = useMemo(() => {
    const totalNumbers = 5;
    
    if (totalPages <= totalNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const leftSiblingIndex = Math.max(currentPage - 1, 1);
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages - 2);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 0;
    const lastPageIndex = totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2; // First page + current + next + 2 more
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i);
      return [...leftRange, 'right-ellipsis', lastPageIndex];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2; // Last page + current + previous + 2 more
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - 1 - i
      ).reverse();
      return [firstPageIndex, 'left-ellipsis', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, 'left-ellipsis', ...middleRange, 'right-ellipsis', lastPageIndex];
    }

    return [];
  }, [totalPages, currentPage]);

  const nextPage = async () => {
    if( isLast || isLoading) return;

    try {
      setFilters((filters) => ({...filters, page: currentPage + 1}));
    }catch(error) {
      toast.error(errorParser(error.message));
    }
  }

  const prevPage = async () => {
    if(isFirst || isLoading) return;

    try {
      setFilters((filters) => ({...filters, page: currentPage - 1}));
    }catch(error) {
      toast.error(errorParser(error.message));
    }
  }

  const onPageClick = async (page) => {
    if(currentPage === page || isLoading) return;

    try {
      setFilters((filters) => ({...filters, page}));
    }catch(error) {
      toast.error(errorParser(error.message));
    }
  }

  return (
    <FlexRow 
      gap={0}
      width="100%"
      justify="space-between"
    >
      <Page 
        onClick={prevPage}
        disabled={isFirst}
        style={{
          cursor: isFirst ? 'not-allowed' : 'pointer',
          opacity: isFirst ? 0.5 : 1,
          marginRight: '8px'
        }}
      >
        Anterior
      </Page>
      <FlexRow>
        {pages.map((page, index) => {
          if (page === 'left-ellipsis' || page === 'right-ellipsis') {
            return <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>;
          }
          
          return (
            <Page
              key={page}
              isActive={page === currentPage}
              onClick={() => onPageClick(page)}
            >
              {page + 1}
            </Page>
          );
        })}
      </FlexRow>
      <Page 
        onClick={nextPage}
        disabled={isLast}
        style={{
          cursor: isLast ? 'not-allowed' : 'pointer',
          opacity: isLast ? 0.5 : 1,
          marginLeft: '8px'
        }}
      >
        Siguiente
      </Page>
    </FlexRow>
  );
}

export default Pagination;
