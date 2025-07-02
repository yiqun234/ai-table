export type PropertyType = 
  | 'text' 
  | 'bulleted-list' 
  | 'tag' 
  | 'yes-no' 
  | 'date' 
  | 'verbatim' 
  | 'manual-input';

export interface TableRowData {
  id: number;
  selected: boolean;
  context: string;
  status: 'processing' | 'completed' | 'error';
  fileName?: string;
  properties: Record<string, string | boolean | number>;
}

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
}

export type ColumnWidths = Record<string, number>;


// --- Initial Data ---
export const initialRows: TableRowData[] = [
    { id: 1, selected: false, context: 'Contract 01', status: 'completed', fileName: 'Contract 01.pdf', properties: {} },
    { id: 2, selected: false, context: 'Presentation_file', status: 'completed', fileName: 'Presentation_file.pdf', properties: {} },
    { id: 3, selected: false, context: 'Legal_contract', status: 'error', fileName: 'Legal_contract.pdf', properties: {} },
    { id: 4, selected: false, context: 'Legal_contract', status: 'completed', fileName: 'Legal_contract.pdf', properties: {} },
    { id: 5, selected: false, context: 'Add Context', status: 'processing', properties: {} },
];

export const initialProperties: Property[] = [];

export const initialColumnWidths: ColumnWidths = {
    checkbox: 40,
    index: 60,
    context: 250,
    addProperty: 150
}; 