import { BookType, OrderStatus } from '@prisma/client';
import { SortOrder } from './data';

export const formatCurrency = (amount: number, useSymbol = false) => {
  return (
    amount.toLocaleString('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }) + (useSymbol ? '₴' : ' грн')
  );
};

export const formatDateToLocal = (date: Date, locale: string = 'uk-UA') => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export function range(start: number, end: number, step = 1) {
  if (!Number.isInteger(start)) {
    throw new TypeError('start should be an integer, received: ' + start);
  }
  if (!Number.isInteger(end)) {
    throw new TypeError('end should be an integer, received: ' + end);
  }
  if (!Number.isInteger(step)) {
    throw new TypeError('step should be an integer, received: ' + step);
  }

  if (end < start) {
    throw new RangeError(
      'end should be greater than start, received: ' + end + ' < ' + start,
    );
  }
  if (step < 1) {
    throw new RangeError(
      'step should be a positive integer, received: ' + step,
    );
  }

  return Array.from(
    { length: (end - start) / step + 1 },
    (_, i) => start + i * step,
  );
}

export function sortOrderFromString(sortOrder: string | undefined | null) {
  if (!sortOrder) {
    return null;
  }

  switch (sortOrder) {
    case 'price_asc':
      return SortOrder.PriceAsc;
    case 'price_desc':
      return SortOrder.PriceDesc;
    case 'title_asc':
      return SortOrder.TitleAsc;
    case 'title_desc':
      return SortOrder.TitleDesc;
    default:
      return null;
  }
}

export function bookTypeFromString(bookType: string | undefined | null) {
  if (!bookType) {
    return null;
  }

  switch (bookType) {
    case 'ELECTRONIC':
      return BookType.ELECTRONIC;
    case 'PAPER':
      return BookType.PAPER;
    default:
      return null;
  }
}

export function orderStatusFromString(orderStatus: string | undefined | null) {
  if (!orderStatus) {
    return null;
  }

  switch (orderStatus) {
    case 'COMPLETED':
      return OrderStatus.COMPLETED;
    case 'SHIPPED':
      return OrderStatus.SHIPPED;
    case 'PROCESSING':
      return OrderStatus.PROCESSING;
    case 'CREATED':
      return OrderStatus.CREATED;
    case 'ACCEPTED':
      return OrderStatus.ACCEPTED;
    default:
      return null;
  }
}

export function generatePagination(
  curPage: number,
  numPages: number,
  numPagesAtEdges = 1,
  numPagesAroundCurrent = 1,
  glue = '…',
): (string | number)[] {
  const numItemsInSequence =
    1 + numPagesAroundCurrent * 2 + numPagesAtEdges * 2 + 2;
  const reworkedCurPage = Math.min(curPage, numPages);
  let finalSequence = [];

  if (numPages <= numItemsInSequence) {
    finalSequence = range(1, numPages);
  } else {
    const start = numPagesAtEdges > 0 ? 1 : reworkedCurPage;
    const sequence: {
      leftEdge: number[] | null;
      glueLeftCenter: (string | number)[] | null;
      centerPiece: (string | number)[] | null;
      glueCenterRight: (string | number)[] | null;
      rightEdge: number[] | null;
    } = {
      leftEdge: null,
      glueLeftCenter: null,
      centerPiece: null,
      glueCenterRight: null,
      rightEdge: null,
    };

    if (reworkedCurPage < numItemsInSequence / 2) {
      sequence.leftEdge = range(
        1,
        Math.ceil(numItemsInSequence / 2) + numPagesAroundCurrent,
      );
      sequence.centerPiece = [glue];
      if (numPagesAtEdges > 0)
        sequence.rightEdge = range(numPages - (numPagesAtEdges - 1), numPages);
    } else if (reworkedCurPage > numPages - numItemsInSequence / 2) {
      if (numPagesAtEdges > 0)
        sequence.leftEdge = range(start, numPagesAtEdges);
      sequence.centerPiece = [glue];
      sequence.rightEdge = range(
        Math.min(
          numPages - Math.floor(numItemsInSequence / 2) - numPagesAroundCurrent,
          reworkedCurPage - numPagesAroundCurrent,
        ),
        numPages,
      );
    } else {
      sequence.centerPiece = range(
        reworkedCurPage - numPagesAroundCurrent,
        reworkedCurPage + numPagesAroundCurrent,
      );

      if (numPagesAtEdges > 0)
        sequence.leftEdge = range(start, numPagesAtEdges);
      if (numPagesAtEdges > 0)
        sequence.rightEdge = range(numPages - (numPagesAtEdges - 1), numPages);

      sequence.glueLeftCenter =
        sequence.centerPiece[0] == numPagesAtEdges + 2
          ? [numPagesAtEdges + 1]
          : [glue];
      sequence.glueCenterRight = [glue];
    }

    finalSequence = Object.values(sequence)
      .filter((v) => v !== null)
      .flat() as (string | number)[];
  }

  return finalSequence;
}
