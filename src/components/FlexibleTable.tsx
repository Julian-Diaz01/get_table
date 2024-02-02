import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import React from "react";

interface Column<T> {
    id: keyof T;
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: T[keyof T]) => React.ReactNode;
}

interface FlexibleTableProps<T> {
    columns: Column<T>[];
    data: T[];
}

const FlexibleTable = <T extends object>({columns, data}: FlexibleTableProps<T>) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="flexible table">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={String(column.id)}
                                align={column.align || 'left'}
                                style={{minWidth: column.minWidth}}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => {
                        return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <TableCell key={String(column.id)} align={column.align}>
                                            {column.format ? column.format(value) : String(value)}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default FlexibleTable;
