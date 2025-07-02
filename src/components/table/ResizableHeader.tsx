import { ReactNode, MouseEvent as ReactMouseEvent } from 'react';

interface ResizableHeaderProps {
    id: string;
    title: ReactNode;
    width: number;
    onMouseDown: (columnId: string, e: ReactMouseEvent) => void;
    resizable?: boolean;
}

export function ResizableHeader({
    id,
    title,
    width,
    onMouseDown,
    resizable = true,
}: ResizableHeaderProps) {
    return (
        <th
            className="relative border-l border-gray-300 select-none bg-gray-50 text-left"
            style={{ width: `${width}px`}}
        >
            <div className="px-3 py-2 flex items-center h-full text-sm font-semibold text-gray-700">
                {title}
            </div>
            {resizable && (
                <div
                    onMouseDown={(e) => onMouseDown(id, e)}
                    className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-300 transition-colors"
                    style={{ zIndex: 10 }}
                />
            )}
        </th>
    );
} 