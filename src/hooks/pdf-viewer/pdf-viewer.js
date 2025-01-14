import { useCallback, useRef, useState } from 'react';

import { useGetElementProperty } from '../get-element-property';

export const usePdfViewer = () => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
  }, []);

  const onClickNextPage = () => {
    if (pageNumber === numPages) return;
    setPageNumber((prev) => prev + 1);
  };

  const onClickPreviousPage = () => {
    if (pageNumber === 1) return;
    setPageNumber((prev) => prev - 1);
  };

  const targetRef = useRef(null);
  const { getElementProperty } = useGetElementProperty(targetRef);

  return {
    numPages,
    pageNumber,
    onDocumentLoadSuccess,
    onClickNextPage,
    onClickPreviousPage,
    targetRef,
    width: getElementProperty('width'),
  };
};