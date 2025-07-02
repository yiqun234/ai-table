import { File, FileText, RefreshCw, AlertCircle, Type, List, Tag, ToggleRight, CalendarDays, MousePointerClick, File as FileIcon, Globe, Plus } from "lucide-react";
import { TableRowData, PropertyType } from "./table-constants";
import { FC, ElementType } from 'react';

export function getStatusIcon(status: TableRowData['status']) {
    switch (status) {
        case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
        case 'processing': return <RefreshCw className="h-4 w-4 text-gray-400" />;
        default: return null;
    }
}

export function getFileIcon(fileName?: string) {
    if (!fileName) return <File className="h-4 w-4 text-gray-500" />;
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
        case 'docx': return <FileText className="h-4 w-4 text-blue-500" />;
        case 'pptx': return <FileText className="h-4 w-4 text-orange-500" />;
        default: return <File className="h-4 w-4 text-gray-500" />;
    }
}

const propertyIconMap: Record<PropertyType, ElementType> = {
  'text': Type,
  'bulleted-list': List,
  'tag': Tag,
  'yes-no': ToggleRight,
  'date': CalendarDays,
  'verbatim': FileText,
  'manual-input': MousePointerClick,
};

export function getPropertyIcon(type: PropertyType): ElementType {
  return propertyIconMap[type] || Type;
}

interface ContextIconProps {
    type: 'file' | 'url';
    className?: string;
}
  
export const ContextIcon: FC<ContextIconProps> = ({ type, className }) => {
    const Icon = type === 'file' ? FileIcon : Globe;
    return <Icon className={className} />;
};

export { Plus }; 