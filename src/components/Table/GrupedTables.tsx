import React from "react";
import FlexibleTable from "./FlexibleTable";
import {HubData} from "../../models/HubsModels";


interface Column<T> {
    id: keyof T;
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface GroupedTablesProps<T> {
    columns: Column<HubData>[];
    groups: Record<string, T[]>;
}

const GroupedTables = <T extends object>({columns, groups}: GroupedTablesProps<T>) => {
    return (
        <>
            {Object.entries(groups).map(([groupName, groupData]: [string, HubData[]]) => (
                <div key={groupName}>
                    <h2>{groupName}</h2>
                    <FlexibleTable<HubData> columns={columns} data={groupData}/>
                </div>
            ))}
        </>
    );
};

export default GroupedTables;
