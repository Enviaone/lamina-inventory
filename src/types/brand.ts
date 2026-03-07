export interface BrandItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  lowStockThreshold: number;
}

export interface Brand {
  id: string;
  name: string;
  code: string;
  color: string; // tailwind color token, e.g. 'blue', 'rose'
  items: BrandItem[];
}

export const MOCK_BRANDS: Brand[] = [
  {
    id: '1',
    name: 'Ashok Leyland',
    code: 'AL-001',
    color: 'blue',
    items: [
      { id: '1a', name: 'Flywheel Ring Gear', sku: 'AL-FRG-001', currentStock: 4488, lowStockThreshold: 1500 },
      { id: '1b', name: 'Crankshaft Pulley', sku: 'AL-CSP-002', currentStock: 672, lowStockThreshold: 500 },
    ],
  },
  {
    id: '2',
    name: 'Tata Motors',
    code: 'TM-001',
    color: 'rose',
    items: [
      { id: '2a', name: 'Brake Drum', sku: 'TM-BD-001', currentStock: 1956, lowStockThreshold: 1000 },
      { id: '2b', name: 'Clutch Housing', sku: 'TM-CH-002', currentStock: 56458, lowStockThreshold: 2000 },
    ],
  },
  {
    id: '3',
    name: 'Mahindra',
    code: 'MH-001',
    color: 'amber',
    items: [
      { id: '3a', name: 'Camshaft Sprocket', sku: 'MH-CS-001', currentStock: 76734, lowStockThreshold: 24000 },
      { id: '3b', name: 'Timing Cover', sku: 'MH-TC-002', currentStock: 3473, lowStockThreshold: 500 },
    ],
  },
  {
    id: '4',
    name: 'Force Motors',
    code: 'FM-001',
    color: 'violet',
    items: [
      { id: '4a', name: 'Differential Housing', sku: 'FM-DH-001', currentStock: 788, lowStockThreshold: 750 },
    ],
  },
  {
    id: '5',
    name: 'Eicher Motors',
    code: 'EM-001',
    color: 'green',
    items: [
      { id: '5a', name: 'Gear Shift Fork', sku: 'EM-GSF-001', currentStock: 4105, lowStockThreshold: 1000 },
      { id: '5b', name: 'Propeller Shaft', sku: 'EM-PS-002', currentStock: 1133, lowStockThreshold: 1000 },
    ],
  },
  {
    id: '6',
    name: 'VECV',
    code: 'VC-001',
    color: 'orange',
    items: [
      { id: '6a', name: 'Torque Plate', sku: 'VC-TP-001', currentStock: 2210, lowStockThreshold: 800 },
    ],
  },
];
