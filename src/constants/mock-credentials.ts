import type { MockCredential } from '@/types/auth';

export const MOCK_CREDENTIALS: MockCredential[] = [
  {
    name: 'Admin User',
    email: 'admin@lamina.com',
    password: 'admin@123',
    stage: 'ADMIN',
    stageName: 'Administrator',
  },
  {
    name: 'Rajan Mehta',
    email: 'melting@lamina.com',
    password: 'melting@123',
    stage: 'MELTING',
    stageName: 'Melting',
  },
  {
    name: 'Suresh Pillai',
    email: 'shotblast@lamina.com',
    password: 'shotblast@123',
    stage: 'SHOT_BLAST',
    stageName: 'Shot Blast',
  },
  {
    name: 'Kavitha Reddy',
    email: 'proof@lamina.com',
    password: 'proof@123',
    stage: 'PROOF_MACHINES',
    stageName: 'Proof Machines',
  },
  {
    name: 'Dinesh Kumar',
    email: 'cnc@lamina.com',
    password: 'cnc@123',
    stage: 'CNC',
    stageName: 'CNC',
  },
  {
    name: 'Meena Sundaram',
    email: 'hardness@lamina.com',
    password: 'hardness@123',
    stage: 'HARDNESS_INSPECTION',
    stageName: 'Inspection',
  },
  {
    name: 'Vijay Krishnan',
    email: 'balancing@lamina.com',
    password: 'balance@123',
    stage: 'BALANCING',
    stageName: 'Balancing',
  },
  {
    name: 'Ramesh Babu',
    email: 'packing@lamina.com',
    password: 'pack@123',
    stage: 'PACKAGING',
    stageName: 'Packaging',
  },
];
