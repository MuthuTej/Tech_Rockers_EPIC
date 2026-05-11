import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Block } from './models/Block';
import { User } from './models/User';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const engineers = [
  { id: 'E001', name: 'Arjun Mehta', initials: 'AM', role: 'engineer', email: 'arjun@layoutiq.com', maxHours: 100 },
  { id: 'E002', name: 'Priya Nair', initials: 'PN', role: 'engineer', email: 'priya@layoutiq.com', maxHours: 100 },
  { id: 'E003', name: 'Karthik Rajan', initials: 'KR', role: 'engineer', email: 'karthik@layoutiq.com', maxHours: 100 },
  { id: 'E004', name: 'Divya Suresh', initials: 'DS', role: 'engineer', email: 'divya@layoutiq.com', maxHours: 100 },
  { id: 'M001', name: 'Vikram Iyer', initials: 'VI', role: 'manager', email: 'vikram@layoutiq.com', maxHours: 0 },
];

const blocks = [
  {
    id: 'BLK001', name: 'Inverter Cell', type: 'Inverter', techNode: '28nm', complexity: 'Simple',
    estHours: 20, actualHours: 18, area: '45µm²', assignedTo: 'E001', stage: 'COMPLETED',
    description: 'Standard CMOS inverter cell for digital interface',
    createdAt: '2026-04-01T09:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-01T09:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN', timestamp: '2026-04-02T10:00:00Z', actor: 'Arjun Mehta' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-03T11:00:00Z', actor: 'Arjun Mehta' },
      { stage: 'DRC', timestamp: '2026-04-05T14:00:00Z', actor: 'Arjun Mehta' },
      { stage: 'LVS', timestamp: '2026-04-07T09:00:00Z', actor: 'Arjun Mehta' },
      { stage: 'REVIEW', timestamp: '2026-04-08T11:00:00Z', actor: 'Arjun Mehta' },
      { stage: 'COMPLETED', timestamp: '2026-04-09T15:00:00Z', actor: 'Vikram Iyer' },
    ]
  },
  {
    id: 'BLK002', name: 'Current Mirror', type: 'Current Mirror', techNode: '180nm', complexity: 'Medium',
    estHours: 30, actualHours: 35, area: '120µm²', assignedTo: 'E002', stage: 'LVS',
    description: 'High-accuracy current mirror for bias generation',
    createdAt: '2026-04-02T10:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-02T10:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN', timestamp: '2026-04-03T09:00:00Z', actor: 'Priya Nair' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-04T10:00:00Z', actor: 'Priya Nair' },
      { stage: 'DRC', timestamp: '2026-04-08T11:00:00Z', actor: 'Priya Nair' },
      { stage: 'LVS', timestamp: '2026-04-10T09:00:00Z', actor: 'Priya Nair' },
    ]
  },
  {
    id: 'BLK003', name: 'Differential Pair', type: 'Diff Pair', techNode: '65nm', complexity: 'Complex',
    estHours: 50, actualHours: 48, area: '200µm²', assignedTo: 'E003', stage: 'DRC',
    description: 'Low-noise differential input pair for OTA front-end',
    createdAt: '2026-04-03T09:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-03T09:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN', timestamp: '2026-04-04T11:00:00Z', actor: 'Karthik Rajan' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-05T10:00:00Z', actor: 'Karthik Rajan' },
      { stage: 'DRC', timestamp: '2026-04-10T14:00:00Z', actor: 'Karthik Rajan' },
    ]
  },
  {
    id: 'BLK004', name: 'Bandgap Reference', type: 'Bandgap', techNode: '28nm', complexity: 'Critical',
    estHours: 80, actualHours: 85, area: '350µm²', assignedTo: 'E001', stage: 'REVIEW',
    description: 'Temperature-stable bandgap voltage reference 1.2V',
    createdAt: '2026-04-01T11:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-01T11:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN', timestamp: '2026-04-02T14:00:00Z', actor: 'Arjun Mehta' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-04T09:00:00Z', actor: 'Arjun Mehta' },
      { stage: 'DRC', timestamp: '2026-04-07T10:00:00Z', actor: 'Arjun Mehta' },
      { stage: 'LVS', timestamp: '2026-04-09T11:00:00Z', actor: 'Arjun Mehta' },
      { stage: 'REVIEW', timestamp: '2026-04-12T09:00:00Z', actor: 'Arjun Mehta' },
    ]
  },
  {
    id: 'BLK005', name: 'OTA Folded Cascode', type: 'OTA', techNode: '40nm', complexity: 'Critical',
    estHours: 80, actualHours: 60, area: '420µm²', assignedTo: 'E004', stage: 'IN PROGRESS',
    description: 'High-gain folded cascode operational transconductance amp',
    createdAt: '2026-04-05T10:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-05T10:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN', timestamp: '2026-04-06T09:00:00Z', actor: 'Divya Suresh' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-08T11:00:00Z', actor: 'Divya Suresh' },
    ]
  },
  {
    id: 'BLK006', name: 'LDO Regulator', type: 'LDO', techNode: '180nm', complexity: 'Critical',
    estHours: 80, actualHours: 55, area: '380µm²', assignedTo: 'E002', stage: 'REJECTED',
    description: 'Low-dropout linear voltage regulator 1.8V output',
    rejectionComment: 'LVS mismatch on pass transistor sizing. Gate width inconsistent with schematic. Please re-check M1 dimensions.',
    rejectedBy: 'Vikram Iyer',
    rejectedAt: '2026-04-13T16:00:00Z',
    createdAt: '2026-04-04T09:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-04T09:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN', timestamp: '2026-04-05T10:00:00Z', actor: 'Priya Nair' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-06T11:00:00Z', actor: 'Priya Nair' },
      { stage: 'DRC', timestamp: '2026-04-09T09:00:00Z', actor: 'Priya Nair' },
      { stage: 'LVS', timestamp: '2026-04-11T10:00:00Z', actor: 'Priya Nair' },
      { stage: 'REVIEW', timestamp: '2026-04-12T14:00:00Z', actor: 'Priya Nair' },
      { stage: 'REJECTED', timestamp: '2026-04-13T16:00:00Z', actor: 'Vikram Iyer' },
    ]
  },
  {
    id: 'BLK007', name: 'NMOS Current Source', type: 'Current Mirror', techNode: '65nm', complexity: 'Simple',
    estHours: 20, actualHours: 0, area: '60µm²', assignedTo: null, stage: 'NOT STARTED',
    description: 'Simple NMOS current source for bias network',
    createdAt: '2026-04-10T09:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-10T09:00:00Z', actor: 'Vikram Iyer' },
    ]
  },
  {
    id: 'BLK008', name: 'PMOS Load', type: 'Inverter', techNode: '28nm', complexity: 'Simple',
    estHours: 20, actualHours: 8, area: '55µm²', assignedTo: 'E003', stage: 'FLOORPLAN',
    description: 'PMOS active load for differential amplifier',
    createdAt: '2026-04-08T11:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-08T11:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN', timestamp: '2026-04-10T10:00:00Z', actor: 'Karthik Rajan' },
    ]
  },
  {
    id: 'BLK009', name: 'Common Gate Amp', type: 'OTA', techNode: '40nm', complexity: 'Medium',
    estHours: 30, actualHours: 22, area: '175µm²', assignedTo: 'E004', stage: 'IN PROGRESS',
    description: 'Common gate amplifier stage for wideband signal path',
    createdAt: '2026-04-07T10:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-07T10:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN', timestamp: '2026-04-08T09:00:00Z', actor: 'Divya Suresh' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-10T11:00:00Z', actor: 'Divya Suresh' },
    ]
  },
  {
    id: 'BLK010', name: 'Cascode Mirror', type: 'Current Mirror', techNode: '65nm', complexity: 'Complex',
    estHours: 50, actualHours: 0, area: '210µm²', assignedTo: null, stage: 'NOT STARTED',
    description: 'High-output-impedance cascode current mirror',
    createdAt: '2026-04-11T09:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-11T09:00:00Z', actor: 'Vikram Iyer' },
    ]
  },
  {
    id: 'BLK011', name: 'Ring Oscillator', type: 'Inverter', techNode: '180nm', complexity: 'Medium',
    estHours: 30, actualHours: 32, area: '140µm²', assignedTo: 'E001', stage: 'DRC',
    description: '5-stage ring oscillator for on-chip clock generation',
    createdAt: '2026-04-06T09:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-06T09:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN', timestamp: '2026-04-07T11:00:00Z', actor: 'Arjun Mehta' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-08T10:00:00Z', actor: 'Arjun Mehta' },
      { stage: 'DRC', timestamp: '2026-04-12T09:00:00Z', actor: 'Arjun Mehta' },
    ]
  },
  {
    id: 'BLK012', name: 'Level Shifter', type: 'Diff Pair', techNode: '28nm', complexity: 'Medium',
    estHours: 30, actualHours: 28, area: '165µm²', assignedTo: 'E002', stage: 'COMPLETED',
    description: 'Voltage level shifter for cross-domain signal interface',
    createdAt: '2026-04-03T11:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-03T11:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN', timestamp: '2026-04-04T10:00:00Z', actor: 'Priya Nair' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-05T09:00:00Z', actor: 'Priya Nair' },
      { stage: 'DRC', timestamp: '2026-04-08T14:00:00Z', actor: 'Priya Nair' },
      { stage: 'LVS', timestamp: '2026-04-10T10:00:00Z', actor: 'Priya Nair' },
      { stage: 'REVIEW', timestamp: '2026-04-11T09:00:00Z', actor: 'Priya Nair' },
      { stage: 'COMPLETED', timestamp: '2026-04-12T11:00:00Z', actor: 'Vikram Iyer' },
    ]
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGOURI;
    if (!mongoUri) {
      console.error('MONGOURI not found');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Seeding');

    await Block.deleteMany();
    await User.deleteMany();
    try { await User.collection.drop(); } catch (e) {} // drop collection to remove old indexes
    try { await Block.collection.drop(); } catch (e) {}

    await Block.insertMany(blocks);
    await User.insertMany(engineers);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

seedDB();
