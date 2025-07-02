import { FC } from 'react';
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { TableRowData, Property } from './table-constants';
import { getFileIcon, getStatusIcon } from './table-helpers';

interface DataTableRowProps {
    row: TableRowData;
    properties: Property[];
}

export const DataTableRow: FC<DataTableRowProps> = ({ row, properties }) => {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="border-r border-gray-300 text-center">
                <div className="flex justify-center items-center h-full">
                    <Checkbox checked={row.selected} />
                </div>
            </td>
            <td className="border-r border-gray-300 text-center text-sm font-medium text-gray-500">{row.id}</td>
            <td className="border-r border-gray-300 px-3 py-2">
                <div className="flex items-center gap-2">
                     <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                        {getStatusIcon(row.status)}
                    </div>
                    <div className="flex-shrink-0">
                        {getFileIcon(row.fileName)}
                    </div>
                    <span className="text-sm truncate">{row.context}</span>
                </div>
            </td>
            {properties.map((property) => (
                <td key={property.id} className="border-r border-gray-300 px-3 py-2 overflow-hidden">
                    <span className={cn("text-sm block truncate", 
                        row.status === 'processing' && "text-blue-600"
                    )}>
                        {row.properties[property.id]}
                    </span>
                </td>
            ))}
            <td className="border-r border-gray-300"></td>
            <td className="w-full"></td>
        </tr>
    );
}; 