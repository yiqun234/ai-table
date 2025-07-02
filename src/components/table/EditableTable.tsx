'use client';

import { useState, useRef, useCallback, MouseEvent as ReactMouseEvent, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, ChevronDown, FileText } from "lucide-react";
import { getPropertyIcon } from "./table-helpers";

import { 
    initialRows, 
    initialProperties, 
    initialColumnWidths,
    Property,
    TableRowData,
    ColumnWidths,
    PropertyType,
} from './table-constants';

import { ResizableHeader } from "./ResizableHeader";
import { DataTableRow } from "./DataTableRow";
import { PropertyTypeSelector } from "./PropertyTypeSelector";
import { PropertyMenu } from './PropertyMenu';

export interface EditableTableRef {
    runAll: () => void;
}

interface MenuState {
  isOpen: boolean;
  anchorPoint: { x: number; y: number } | null;
  property: Property | null;
}

interface AddPropertyMenuState {
    isOpen: boolean;
    anchorPoint: { x: number; y: number } | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface EditableTableProps {}

export const EditableTable = forwardRef<EditableTableRef, EditableTableProps>((props, ref) => {
    const [rows, setRows] = useState<TableRowData[]>(initialRows);
    const [properties, setProperties] = useState<Property[]>(initialProperties);
    const [columnWidths, setColumnWidths] = useState<ColumnWidths>(initialColumnWidths);
    const [rowContexts, setRowContexts] = useState<Record<number, string>>({});
    const [processingCells, setProcessingCells] = useState<Record<string, boolean>>({});
    const [propertyMenuState, setPropertyMenuState] = useState<MenuState>({ 
        isOpen: false, 
        anchorPoint: null,
        property: null,
    });
    const [addPropertyMenuState, setAddPropertyMenuState] = useState<AddPropertyMenuState>({
        isOpen: false,
        anchorPoint: null,
    });
    const isResizingRef = useRef<string | null>(null);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    useImperativeHandle(ref, () => ({
        runAll: async () => {
            console.log("Running all rows sequentially...");

            for (const row of rows) {
                const fileContent = rowContexts[row.id] || row.properties.source;

                if (fileContent) {
                    let rowHasError = false;
                    for (const prop of properties) {
                        if (prop.id === 'source') continue;

                        const cellId = `${row.id}-${prop.id}`;
                        
                        setProcessingCells(prev => ({ ...prev, [cellId]: true }));
                        setRows(prev => prev.map(r => r.id === row.id ? {
                            ...r,
                            properties: {...r.properties, [prop.id]: 'Processing...'}
                        } : r));

                        try {
                            const response = await fetch('/api/upload', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    fileContent: String(fileContent),
                                    propertyType: prop.type,
                                    propertyTitle: prop.title,
                                    customPrompt: prop.prompt,
                                }),
                            });

                            if (response.ok) {
                                const result = await response.json();
                                const newCellValue = result.result; 

                                setRows(prev => prev.map(r => r.id === row.id ? {
                                    ...r, 
                                    properties: {...r.properties, [prop.id]: newCellValue},
                                } : r));
                            } else {
                                rowHasError = true;
                                console.error(`API call failed for cell ${cellId} with status: ${response.status}`);
                                setRows(prev => prev.map(r => r.id === row.id ? {
                                    ...r, 
                                    properties: {...r.properties, [prop.id]: 'Error'},
                                } : r));
                            }
                        } catch (error) {
                            rowHasError = true;
                            console.error(`Error processing cell ${cellId}:`, error);
                            setRows(prev => prev.map(r => r.id === row.id ? {
                                ...r, 
                                properties: {...r.properties, [prop.id]: 'Error'},
                            } : r));
                        } finally {
                             setProcessingCells(prev => {
                                const newProcessing = {...prev};
                                delete newProcessing[cellId];
                                return newProcessing;
                            });
                            await sleep(100);
                        }
                    }
                    setRows(prev => prev.map(r => r.id === row.id ? {...r, status: rowHasError ? 'error' : 'completed'} : r));
                } else {
                    console.log(`Skipping row ${row.id} because it has no context or source.`);
                }
            }
        }
    }));

    const handleContextChange = (rowId: number, fileName: string, fileContent: string) => {
        setRows(prevRows => 
            prevRows.map(row => 
                row.id === rowId 
                    ? { ...row, context: fileName, fileName: fileName, status: 'completed' } 
                    : row
            )
        );
        setRowContexts(prevContexts => ({
            ...prevContexts,
            [rowId]: fileContent
        }));
    };

    const handleMouseDown = useCallback((columnId: string, e: ReactMouseEvent) => {
        e.preventDefault();
        isResizingRef.current = columnId;

        const startX = e.clientX;
        const startWidth = columnWidths[columnId];
        
        const handleMouseMove = (event: MouseEvent) => {
            if (!isResizingRef.current) return;
            
            let minWidth = 40;
            if (isResizingRef.current === 'context') minWidth = 120;
            if (isResizingRef.current === 'index') minWidth = 50;
            
            const newWidth = Math.max(minWidth, startWidth + event.clientX - startX);
            setColumnWidths(prev => ({ ...prev, [isResizingRef.current!]: newWidth }));
        };

        const handleMouseUp = () => {
            isResizingRef.current = null;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [columnWidths]);

    const openPropertyMenu = (e: ReactMouseEvent<HTMLElement>, property: Property) => {
        e.preventDefault();
        e.stopPropagation();
        setAddPropertyMenuState({ isOpen: false, anchorPoint: null });
        const rect = e.currentTarget.getBoundingClientRect();
        setPropertyMenuState({
            isOpen: true,
            anchorPoint: { x: rect.left, y: rect.bottom + 4 },
            property: property,
        });
    };

    const openAddPropertyMenu = (e: ReactMouseEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setPropertyMenuState({ isOpen: false, anchorPoint: null, property: null });
        const rect = e.currentTarget.getBoundingClientRect();
        setAddPropertyMenuState({
            isOpen: true,
            anchorPoint: { x: rect.left, y: rect.bottom + 4 },
        });
    };

    const handleCloseMenus = useCallback(() => {
        if (propertyMenuState.isOpen) {
            setPropertyMenuState({ isOpen: false, anchorPoint: null, property: null });
        }
        if (addPropertyMenuState.isOpen) {
            setAddPropertyMenuState({ isOpen: false, anchorPoint: null });
        }
    }, [propertyMenuState.isOpen, addPropertyMenuState.isOpen]);

    const handlePropertyTypeSelect = (propertyType: PropertyType) => {
        const newProperty: Property = {
            id: `prop_${Date.now()}`,
            title: "Untitled",
            type: propertyType,
        };
        setProperties(prev => [...prev, newProperty]);
        setColumnWidths(prev => ({ ...prev, [newProperty.id]: 200 }));
        handleCloseMenus();
    };

    function handleAddRow() {
        const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
        setRows([...rows, { 
            id: newId, 
            selected: false,
            context: 'Add Context', 
            status: 'processing',
            properties: properties.reduce((acc, p) => ({...acc, [p.id]: ''}), {})
        }]);
    }

    const addPropertyButton = (
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => openAddPropertyMenu(e)}
            className="h-8 text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-normal -ml-2"
        >
            <Plus className="h-4 w-4 mr-2" />
            Add Property
        </Button>
    )

    const contextProperty: Property = { id: 'context', title: 'Context', type: 'verbatim' };

    return (
        <div className="h-full flex flex-col bg-white" onClick={handleCloseMenus}>
            <div className="flex-1 overflow-auto">
                <table className="w-full table-fixed border-collapse border-gray-300 rounded-lg">
                    <thead className="bg-gray-50 border-b border-gray-300">
                        <tr>
                            <ResizableHeader id="checkbox" title={<div className="flex justify-center"><Checkbox/></div>} width={columnWidths.checkbox} onMouseDown={handleMouseDown} resizable={false} />
                            <ResizableHeader id="index" title="#" width={columnWidths.index} onMouseDown={handleMouseDown} />
                            <ResizableHeader 
                                id="context" 
                                title={
                                    <div 
                                        className="flex items-center justify-between w-full cursor-pointer"
                                        onClick={(e) => openPropertyMenu(e, contextProperty)}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <FileText className="w-4 h-4 text-gray-500" />
                                            <span className="truncate">Context</span>
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    </div>
                                } 
                                width={columnWidths.context} 
                                onMouseDown={handleMouseDown} 
                            />
                            
                            {properties.map(p => {
                                const PropertyIcon = getPropertyIcon(p.type);
                                return (
                                    <ResizableHeader 
                                        key={p.id} 
                                        id={p.id} 
                                        title={
                                            <div 
                                                className="flex items-center justify-between w-full cursor-pointer"
                                                onClick={(e) => openPropertyMenu(e, p)}
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    <PropertyIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                    <span className="truncate">{p.title}</span>
                                                </div>
                                                <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                            </div>
                                        } 
                                        width={columnWidths[p.id]} 
                                        onMouseDown={handleMouseDown}
                                    />
                                );
                            })}
                            
                            <ResizableHeader id="addProperty" title={addPropertyButton} width={columnWidths.addProperty} onMouseDown={handleMouseDown} resizable={false} />

                            <th className="w-full border-l border-gray-300"></th>
                        </tr>
                    </thead>
                    
                    <tbody className="bg-white divide-y divide-gray-300">
                        {rows.map((row) => (
                           <DataTableRow 
                                key={row.id} 
                                row={row} 
                                properties={properties} 
                                onContextChange={handleContextChange}
                                processingCells={processingCells}
                            />
                        ))}
                    </tbody>
                </table>
                <div className="p-2 border-t border-gray-200 bg-gray-50">
                    <Button variant="ghost" onClick={handleAddRow} className="text-gray-600 hover:text-gray-900 font-normal">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Row
                    </Button>
                </div>
                <PropertyTypeSelector 
                    isOpen={addPropertyMenuState.isOpen}
                    onClose={handleCloseMenus}
                    onSelect={handlePropertyTypeSelect}
                    anchorPoint={addPropertyMenuState.anchorPoint}
                />
                <PropertyMenu
                    isOpen={propertyMenuState.isOpen}
                    onClose={handleCloseMenus}
                    property={propertyMenuState.property}
                    anchorPoint={propertyMenuState.anchorPoint}
                />
            </div>
        </div>
    );
});

EditableTable.displayName = "EditableTable"; 