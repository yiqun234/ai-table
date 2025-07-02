import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ChevronRight,
  Sparkles,
  Save,
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Pin,
  Trash2,
} from "lucide-react";
import { Property } from './table-constants';
import { getPropertyIcon } from './table-helpers';

interface PropertyMenuProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  anchorPoint: { x: number; y: number } | null;
}

export const PropertyMenu: FC<PropertyMenuProps> = ({ isOpen, onClose, property, anchorPoint }) => {
  console.log(onClose)
  if (!isOpen || !anchorPoint || !property) {
    return null;
  }

  const PropertyIcon = getPropertyIcon(property.type);

  return (
    <div
      style={{ top: anchorPoint.y, left: anchorPoint.x }}
      className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 w-80 flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
        <div className="p-4">
            <Input defaultValue={property.title} className="text-base font-semibold border-none -ml-2 focus-visible:ring-0" />
            <Separator className="my-2" />
            <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                    <span>Format</span>
                    <Button variant="ghost" className="h-8">
                        <PropertyIcon className="w-4 h-4 mr-2" />
                        <span>{property.type}</span>
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
                <div className="flex justify-between items-center">
                    <span>Model (LLM)</span>
                    <Button variant="ghost" className="h-8">
                        <Sparkles className="w-4 h-4 mr-2" />
                        <span>Select</span>
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
                <textarea
                    placeholder="Analyse the file and create a high level summary as well as a more detailed summary."
                    className="w-full h-24 p-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
            </div>
            <Button variant="ghost" className="w-full justify-center mt-2 h-8">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate fields
            </Button>
        </div>
        <Separator />
        <div className="p-2 text-sm">
            <Button variant="ghost" className="w-full justify-start h-8"><Save className="w-4 h-4 mr-2" />Save as template</Button>
            <Button variant="ghost" className="w-full justify-start h-8"><ArrowLeftFromLine className="w-4 h-4 mr-2" />Insert left</Button>
            <Button variant="ghost" className="w-full justify-start h-8"><ArrowRightFromLine className="w-4 h-4 mr-2" />Insert right</Button>
            <Button variant="ghost" className="w-full justify-start h-8"><Pin className="w-4 h-4 mr-2" />Pin Property</Button>
            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 h-8"><Trash2 className="w-4 h-4 mr-2" />Delete Property</Button>
        </div>
    </div>
  );
}; 