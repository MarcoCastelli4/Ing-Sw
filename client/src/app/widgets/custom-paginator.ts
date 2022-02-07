import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";


export function CustomPaginator() {
    const customPaginatorIntl = new MatPaginatorIntl();

    customPaginatorIntl.itemsPerPageLabel = 'Righe per pagina:';
    customPaginatorIntl.nextPageLabel = 'Prossima pagina';
    customPaginatorIntl.previousPageLabel = 'Pagina precedente';

    customPaginatorIntl.getRangeLabel = function (page, pageSize, length) {
        if (length === 0 || pageSize === 0) {
            return '0 su ' + length;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;
        return startIndex + 1 + ' - ' + endIndex + ' su ' + length;
    };

    return customPaginatorIntl;
}