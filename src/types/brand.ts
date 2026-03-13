export interface BrandItem {
  id: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
  items: BrandItem[];
}

const PART_NAMES = [
  'Transmission Gear', 'Piston Ring', 'Valve Springs', 'Oil Pump', 'Water Pump',
  'Fuel Injector', 'Alternator', 'Starter Motor', 'Steering Rack', 'Tie Rod End',
  'Suspension Bushing', 'Brake Caliper', 'Brake Pad Set', 'Wheel Bearing', 'Axle Shaft',
  'Exhaust Manifold', 'Catalytic Converter', 'Muffler', 'Radiator', 'Condenser',
  'Compressor', 'V-Belt', 'Timing Chain', 'Tensioner', 'Spark Plug',
  'Ignition Coil', 'Oxygen Sensor', 'MAF Sensor', 'Throttle Body', 'EGR Valve'
];

const generateMockItems = (brandPrefix: string, startIdx: number, count: number): BrandItem[] => {
  return Array.from({ length: count }).map((_, i) => {
    const idx = startIdx + i;
    const partName = PART_NAMES[(idx * 7) % PART_NAMES.length];
    return {
      id: `${brandPrefix.toLowerCase()}-${idx}`,
      name: `${partName} Type ${String.fromCharCode(65 + (idx % 26))}`,
    };
  });
};

export const MOCK_BRANDS: Brand[] = [
  {
    id: '1',
    name: 'Ashok Leyland',
    items: [
      { id: '1a', name: 'Flywheel Ring Gear' },
      { id: '1b', name: 'Crankshaft Pulley' },
      ...generateMockItems('AL', 3, 18),
    ],
  },
  {
    id: '2',
    name: 'Tata Motors',
    items: [
      { id: '2a', name: 'Brake Drum' },
      { id: '2b', name: 'Clutch Housing' },
      ...generateMockItems('TM', 3, 18),
    ],
  },
  {
    id: '3',
    name: 'Mahindra',
    items: [
      { id: '3a', name: 'Camshaft Sprocket' },
      { id: '3b', name: 'Timing Cover' },
      ...generateMockItems('MH', 3, 18),
    ],
  },
  {
    id: '4',
    name: 'Force Motors',
    items: [
      { id: '4a', name: 'Differential Housing' },
      ...generateMockItems('FM', 2, 19),
    ],
  },
  {
    id: '5',
    name: 'Eicher Motors',
    items: [
      { id: '5a', name: 'Gear Shift Fork' },
      { id: '5b', name: 'Propeller Shaft' },
      ...generateMockItems('EM', 3, 18),
    ],
  },
  {
    id: '6',
    name: 'VECV',
    items: [
      { id: '6a', name: 'Torque Plate' },
      ...generateMockItems('VC', 2, 19),
    ],
  },
];
