import { useState } from 'react';

export function useBlogNavigation(totalPages) {
  const [currentPage, setCurrentPage] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      scrollToTop();
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      scrollToTop();
    }
  };

  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      scrollToTop();
    }
  };

  return {
    currentPage,
    nextPage,
    prevPage,
    goToPage,
    canGoNext: currentPage < totalPages - 1,
    canGoPrev: currentPage > 0,
  };
}

