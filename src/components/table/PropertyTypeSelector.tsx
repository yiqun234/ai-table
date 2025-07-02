import {
  Type,
  List,
  Tag,
  ToggleRight,
  CalendarDays,
  FileText,
  MousePointerClick,
} from "lucide-react";
import { FC } from "react";
import { PropertyType } from './table-constants';

interface PropertyMenuItem {
  id: string;
  icon: React.ElementType;
  label: string;
}

const propertyMenuGroups: PropertyMenuItem[] = [
    { id: "text", icon: Type, label: "Text" },
    { id: "bulleted-list", icon: List, label: "Bulleted list" },
    { id: "tag", icon: Tag, label: "Tag" },
    { id: "yes-no", icon: ToggleRight, label: "Yes/ No" },
    { id: "date", icon: CalendarDays, label: "Date" },
    { id: "verbatim", icon: FileText, label: "Verbatim" },
    { id: "manual-input", icon: MousePointerClick, label: "Manual input" },
];

interface PropertyMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (propertyType: PropertyType) => void;
  anchorPoint: { x: number; y: number } | null;
}

export const PropertyTypeSelector: FC<PropertyMenuProps> = ({ isOpen, onClose, onSelect, anchorPoint }) => {
  if (!isOpen || !anchorPoint) {
    return null;
  }

  return (
    <div
      className="absolute z-50 bg-white rounded-md shadow-lg border border-gray-200 p-1 w-48 text-sm"
      style={{ top: anchorPoint.y, left: anchorPoint.x }}
      onClick={(e) => e.stopPropagation()} 
    >
      {propertyMenuGroups.map((item) => (
        <div
          key={item.id}
          onClick={() => {
            onSelect(item.id as PropertyType);
            onClose();
          }}
          className="flex items-center px-2 py-1.5 rounded-sm hover:bg-gray-100 cursor-pointer"
        >
          <item.icon className="w-4 h-4 mr-2 text-gray-500" />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}; 