import { FC, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { TableRowData, Property } from './table-constants';
import { getFileIcon, getStatusIcon } from './table-helpers';

interface DataTableRowProps {
    row: TableRowData;
    properties: Property[];
    onContextChange: (rowId: number, fileName: string, fileContent: string) => void;
    processingCells: Record<string, boolean>;
}

export const DataTableRow: FC<DataTableRowProps> = ({ row, properties, onContextChange, processingCells }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleContextClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
            const content = await file.text();
            onContextChange(row.id, file.name, content);
        } else {
            alert("Please select a Markdown (.md) file.");
        }

        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="border-r border-gray-300 text-center">
                <div className="flex justify-center items-center h-full">
                    <Checkbox checked={row.selected} />
                </div>
            </td>
            <td className="border-r border-gray-300 text-center text-sm font-medium text-gray-500">{row.id}</td>
            <td className="border-r border-gray-300 px-3 py-2">
                <div className="flex items-center gap-2 cursor-pointer" onClick={handleContextClick}>
                     <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                        {getStatusIcon(row.status)}
                    </div>
                    <div className="flex-shrink-0">
                        {getFileIcon(row.fileName)}
                    </div>
                    <span className="text-sm truncate">{row.context}</span>
                    <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".md, text/markdown"
                    />
                </div>
            </td>
            {properties.map((property) => {
                const cellId = `${row.id}-${property.id}`;
                const isProcessing = processingCells[cellId];
                return (
                    <td key={property.id} className="border-r border-gray-300 px-3 py-2 overflow-hidden">
                        <span className={cn(
                            "text-sm block truncate",
                            isProcessing && "animate-shimmer"
                        )}>
                            {row.properties[property.id]}
                        </span>
                    </td>
                );
            })}
            <td className="border-r border-gray-300"></td>
            <td className="w-full"></td>
        </tr>
    );
}; 