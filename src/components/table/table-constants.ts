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
  prompt?: string;
}

export type ColumnWidths = Record<string, number>;


// --- Initial Data ---
export const initialRows: TableRowData[] = [
    {
        id: 1,
        selected: false,
        context: 'Click to add context...',
        status: 'completed',
        properties: {
            'prop_1': '',
            'prop_2': '',
            'prop_3': '',
        }
    },
    {
        id: 2,
        selected: false,
        context: 'Click to add context...',
        status: 'completed',
        properties: {
            'prop_1': '',
            'prop_2': '',
            'prop_3': '',
        }
    }
];

export const initialProperties: Property[] = [
    { 
        id: 'prop_1', 
        title: 'Summary', 
        type: 'text',
        prompt: 'Analyze the file and create a high-level summary, followed by a more detailed summary.'
    },
    { 
        id: 'prop_2', 
        title: 'Category', 
        type: 'tag',
        prompt: 'Analyze the text and identify the single most relevant category. Return only the category name.'
    },
    { 
        id: 'prop_3', 
        title: 'Due Date', 
        type: 'date',
        prompt: 'Find the most relevant date in the text and return it in YYYY-MM-DD format. If no date is found, return N/A.'
    },
];

export const initialColumnWidths: ColumnWidths = {
    checkbox: 40,
    index: 50,
    context: 250,
    prop_1: 300,
    prop_2: 150,
    prop_3: 150,
    addProperty: 150
}; 