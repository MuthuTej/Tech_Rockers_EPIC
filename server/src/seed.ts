import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Block } from './models/Block';
import { User } from './models/User';

dotenv.config({ path: path.join(__dirname, '../../.env') });

// Real emails — assignedTo must match user.id (= email) for filters to work
const MGR1 = 'prieyanmn@gmail.com';
const MGR2 = 'muthu1410raj@gmail.com';   // second manager
const E1   = 'lokithk93@gmail.com';       // Lokith — real engineer account
const E2   = 'priya.nair@layoutiq.com';
const E3   = 'karthik.rajan@layoutiq.com';
const E4   = 'divya.suresh@layoutiq.com';
const E5   = 'sneha.patel@layoutiq.com';

const users = [
  { id: MGR1, email: MGR1, name: 'Vikram Iyer',   initials: 'VI', role: 'manager',  picture: '', maxHours: 0   },
  { id: MGR2, email: MGR2, name: 'Muthuraj T',    initials: 'MT', role: 'manager',  picture: '', maxHours: 0   },
  { id: E1,   email: E1,   name: 'Lokith K',      initials: 'LK', role: 'engineer', picture: '', maxHours: 120 },
  { id: E2,   email: E2,   name: 'Priya Nair',    initials: 'PN', role: 'engineer', picture: '', maxHours: 120 },
  { id: E3,   email: E3,   name: 'Karthik Rajan', initials: 'KR', role: 'engineer', picture: '', maxHours: 120 },
  { id: E4,   email: E4,   name: 'Divya Suresh',  initials: 'DS', role: 'engineer', picture: '', maxHours: 120 },
  { id: E5,   email: E5,   name: 'Sneha Patel',   initials: 'SP', role: 'engineer', picture: '', maxHours: 120 },
];

const blocks = [
  // ── COMPLETED ──────────────────────────────────────────────────────────────
  {
    id: 'BLK001', name: 'Inverter Cell', type: 'Inverter', techNode: '28nm', complexity: 'Simple',
    estHours: 20, actualHours: 18, area: '45µm²', assignedTo: E1, stage: 'COMPLETED',
    description: 'Standard CMOS inverter cell for digital interface buffers and clock tree distribution.',
    createdAt: '2026-04-01T09:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-01T09:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-02T10:00:00Z', actor: 'Lokith K' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-03T11:00:00Z', actor: 'Lokith K' },
      { stage: 'DRC',         timestamp: '2026-04-05T14:00:00Z', actor: 'Lokith K' },
      { stage: 'LVS',         timestamp: '2026-04-07T09:00:00Z', actor: 'Lokith K' },
      { stage: 'REVIEW',      timestamp: '2026-04-08T11:00:00Z', actor: 'Lokith K' },
      { stage: 'COMPLETED',   timestamp: '2026-04-09T15:00:00Z', actor: 'Vikram Iyer' },
    ],
  },
  {
    id: 'BLK002', name: 'NAND Gate 2-Input', type: 'Inverter', techNode: '28nm', complexity: 'Simple',
    estHours: 20, actualHours: 17, area: '52µm²', assignedTo: E2, stage: 'COMPLETED',
    description: '2-input NAND gate cell with balanced PMOS/NMOS sizing for standard cell library.',
    createdAt: '2026-04-01T10:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-01T10:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-02T09:00:00Z', actor: 'Priya Nair' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-03T10:00:00Z', actor: 'Priya Nair' },
      { stage: 'DRC',         timestamp: '2026-04-05T11:00:00Z', actor: 'Priya Nair' },
      { stage: 'LVS',         timestamp: '2026-04-06T14:00:00Z', actor: 'Priya Nair' },
      { stage: 'REVIEW',      timestamp: '2026-04-07T10:00:00Z', actor: 'Priya Nair' },
      { stage: 'COMPLETED',   timestamp: '2026-04-08T14:00:00Z', actor: 'Vikram Iyer' },
    ],
  },
  {
    id: 'BLK012', name: 'Level Shifter', type: 'Diff Pair', techNode: '28nm', complexity: 'Medium',
    estHours: 30, actualHours: 28, area: '165µm²', assignedTo: E3, stage: 'COMPLETED',
    description: 'Voltage level shifter for cross-domain signal interface between 1.2V and 1.8V domains.',
    createdAt: '2026-04-03T11:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-03T11:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-04T10:00:00Z', actor: 'Karthik Rajan' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-05T09:00:00Z', actor: 'Karthik Rajan' },
      { stage: 'DRC',         timestamp: '2026-04-08T14:00:00Z', actor: 'Karthik Rajan' },
      { stage: 'LVS',         timestamp: '2026-04-10T10:00:00Z', actor: 'Karthik Rajan' },
      { stage: 'REVIEW',      timestamp: '2026-04-11T09:00:00Z', actor: 'Karthik Rajan' },
      { stage: 'COMPLETED',   timestamp: '2026-04-12T11:00:00Z', actor: 'Vikram Iyer' },
    ],
  },
  {
    id: 'BLK020', name: 'D Flip-Flop', type: 'Inverter', techNode: '65nm', complexity: 'Medium',
    estHours: 30, actualHours: 26, area: '110µm²', assignedTo: E4, stage: 'COMPLETED',
    description: 'Master-slave D flip-flop with asynchronous reset for scan chain integration.',
    createdAt: '2026-04-02T08:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-02T08:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-03T09:00:00Z', actor: 'Divya Suresh' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-04T10:00:00Z', actor: 'Divya Suresh' },
      { stage: 'DRC',         timestamp: '2026-04-07T13:00:00Z', actor: 'Divya Suresh' },
      { stage: 'LVS',         timestamp: '2026-04-09T10:00:00Z', actor: 'Divya Suresh' },
      { stage: 'REVIEW',      timestamp: '2026-04-10T09:00:00Z', actor: 'Divya Suresh' },
      { stage: 'COMPLETED',   timestamp: '2026-04-11T14:00:00Z', actor: 'Vikram Iyer' },
    ],
  },
  {
    id: 'BLK025', name: 'Transmission Gate', type: 'Inverter', techNode: '40nm', complexity: 'Simple',
    estHours: 20, actualHours: 19, area: '48µm²', assignedTo: E5, stage: 'COMPLETED',
    description: 'CMOS transmission gate with complementary control for low Ron across full 1.2V swing.',
    createdAt: '2026-04-02T11:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-02T11:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-03T10:00:00Z', actor: 'Sneha Patel' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-04T09:00:00Z', actor: 'Sneha Patel' },
      { stage: 'DRC',         timestamp: '2026-04-06T14:00:00Z', actor: 'Sneha Patel' },
      { stage: 'LVS',         timestamp: '2026-04-08T10:00:00Z', actor: 'Sneha Patel' },
      { stage: 'REVIEW',      timestamp: '2026-04-09T09:00:00Z', actor: 'Sneha Patel' },
      { stage: 'COMPLETED',   timestamp: '2026-04-10T13:00:00Z', actor: 'Vikram Iyer' },
    ],
  },

  // ── REVIEW (pending manager approval) ─────────────────────────────────────
  {
    id: 'BLK004', name: 'Bandgap Reference', type: 'Bandgap', techNode: '28nm', complexity: 'Critical',
    estHours: 80, actualHours: 85, area: '350µm²', assignedTo: E1, stage: 'REVIEW',
    description: 'Temperature-stable bandgap reference 1.2V, PTAT+CTAT composite, <5ppm/°C drift target.',
    createdAt: '2026-04-01T11:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-01T11:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-02T14:00:00Z', actor: 'Lokith K' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-04T09:00:00Z', actor: 'Lokith K' },
      { stage: 'DRC',         timestamp: '2026-04-07T10:00:00Z', actor: 'Lokith K' },
      { stage: 'LVS',         timestamp: '2026-04-09T11:00:00Z', actor: 'Lokith K' },
      { stage: 'REVIEW',      timestamp: '2026-04-12T09:00:00Z', actor: 'Lokith K' },
    ],
  },
  {
    id: 'BLK015', name: 'Phase Frequency Detector', type: 'OTA', techNode: '65nm', complexity: 'Complex',
    estHours: 50, actualHours: 52, area: '280µm²', assignedTo: E3, stage: 'REVIEW',
    description: 'PFD with dead-zone elimination for PLL loop. Rail-to-rail UP/DN output pulses.',
    createdAt: '2026-04-04T08:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-04T08:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-05T09:00:00Z', actor: 'Karthik Rajan' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-07T10:00:00Z', actor: 'Karthik Rajan' },
      { stage: 'DRC',         timestamp: '2026-04-11T14:00:00Z', actor: 'Karthik Rajan' },
      { stage: 'LVS',         timestamp: '2026-04-14T10:00:00Z', actor: 'Karthik Rajan' },
      { stage: 'REVIEW',      timestamp: '2026-04-16T09:00:00Z', actor: 'Karthik Rajan' },
    ],
  },
  {
    id: 'BLK022', name: 'SAR ADC 10-bit', type: 'OTA', techNode: '40nm', complexity: 'Critical',
    estHours: 80, actualHours: 92, area: '640µm²', assignedTo: E4, stage: 'REVIEW',
    description: '10-bit 50MSPS successive-approximation ADC with split-capacitor DAC and bootstrapped switches.',
    createdAt: '2026-04-01T13:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-01T13:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-03T10:00:00Z', actor: 'Divya Suresh' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-05T09:00:00Z', actor: 'Divya Suresh' },
      { stage: 'DRC',         timestamp: '2026-04-10T14:00:00Z', actor: 'Divya Suresh' },
      { stage: 'LVS',         timestamp: '2026-04-13T10:00:00Z', actor: 'Divya Suresh' },
      { stage: 'REVIEW',      timestamp: '2026-04-15T09:00:00Z', actor: 'Divya Suresh' },
    ],
  },

  // ── REJECTED ───────────────────────────────────────────────────────────────
  {
    id: 'BLK006', name: 'LDO Regulator', type: 'LDO', techNode: '180nm', complexity: 'Critical',
    estHours: 80, actualHours: 55, area: '380µm²', assignedTo: E2, stage: 'REJECTED',
    description: 'Low-dropout linear regulator 1.8V/200mA, PSRR > 60dB at 1MHz.',
    rejectionComment: 'LVS mismatch on pass transistor M1 — drawn W=48µm vs schematic W=36µm. Fix sizing and re-run LVS clean before resubmitting.',
    rejectedBy: 'Vikram Iyer', rejectedAt: '2026-04-13T16:00:00Z',
    createdAt: '2026-04-04T09:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-04T09:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-05T10:00:00Z', actor: 'Priya Nair' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-06T11:00:00Z', actor: 'Priya Nair' },
      { stage: 'DRC',         timestamp: '2026-04-09T09:00:00Z', actor: 'Priya Nair' },
      { stage: 'LVS',         timestamp: '2026-04-11T10:00:00Z', actor: 'Priya Nair' },
      { stage: 'REVIEW',      timestamp: '2026-04-12T14:00:00Z', actor: 'Priya Nair' },
      { stage: 'REJECTED',    timestamp: '2026-04-13T16:00:00Z', actor: 'Vikram Iyer' },
    ],
  },
  {
    id: 'BLK018', name: 'Ring VCO 2.4GHz', type: 'OTA', techNode: '40nm', complexity: 'Critical',
    estHours: 80, actualHours: 70, area: '310µm²', assignedTo: E5, stage: 'REJECTED',
    description: '7-stage differential ring VCO targeting 2.4GHz at 1.1V supply.',
    rejectionComment: 'DRC violations in metal-3 routing (14 min-spacing errors). Phase noise also -85dBc/Hz at 1MHz vs -90dBc/Hz target. Both must be resolved.',
    rejectedBy: 'Vikram Iyer', rejectedAt: '2026-04-14T11:00:00Z',
    createdAt: '2026-04-03T10:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-03T10:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-04T11:00:00Z', actor: 'Sneha Patel' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-06T09:00:00Z', actor: 'Sneha Patel' },
      { stage: 'DRC',         timestamp: '2026-04-10T10:00:00Z', actor: 'Sneha Patel' },
      { stage: 'LVS',         timestamp: '2026-04-12T14:00:00Z', actor: 'Sneha Patel' },
      { stage: 'REVIEW',      timestamp: '2026-04-13T09:00:00Z', actor: 'Sneha Patel' },
      { stage: 'REJECTED',    timestamp: '2026-04-14T11:00:00Z', actor: 'Vikram Iyer' },
    ],
  },

  // ── LVS ────────────────────────────────────────────────────────────────────
  {
    id: 'BLK003', name: 'Widlar Current Mirror', type: 'Current Mirror', techNode: '180nm', complexity: 'Medium',
    estHours: 30, actualHours: 35, area: '120µm²', assignedTo: E2, stage: 'LVS',
    description: 'High-accuracy Widlar current mirror 10µA output, 0.1% matching, low-headroom design.',
    createdAt: '2026-04-02T10:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-02T10:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-03T09:00:00Z', actor: 'Priya Nair' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-04T10:00:00Z', actor: 'Priya Nair' },
      { stage: 'DRC',         timestamp: '2026-04-08T11:00:00Z', actor: 'Priya Nair' },
      { stage: 'LVS',         timestamp: '2026-04-10T09:00:00Z', actor: 'Priya Nair' },
    ],
  },
  {
    id: 'BLK016', name: 'PLL Loop Filter', type: 'LDO', techNode: '65nm', complexity: 'Complex',
    estHours: 50, actualHours: 44, area: '420µm²', assignedTo: E5, stage: 'LVS',
    description: 'Second-order passive RC loop filter for 2.4GHz PLL, settling time < 10µs.',
    createdAt: '2026-04-05T09:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-05T09:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-06T10:00:00Z', actor: 'Sneha Patel' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-08T09:00:00Z', actor: 'Sneha Patel' },
      { stage: 'DRC',         timestamp: '2026-04-12T11:00:00Z', actor: 'Sneha Patel' },
      { stage: 'LVS',         timestamp: '2026-04-15T10:00:00Z', actor: 'Sneha Patel' },
    ],
  },
  {
    id: 'BLK023', name: 'StrongARM Comparator', type: 'Diff Pair', techNode: '28nm', complexity: 'Complex',
    estHours: 50, actualHours: 48, area: '195µm²', assignedTo: E4, stage: 'LVS',
    description: 'StrongARM latch comparator for ADC: offset < 2mV, delay < 200ps at 1GHz.',
    createdAt: '2026-04-04T10:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-04T10:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-05T09:00:00Z', actor: 'Divya Suresh' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-07T10:00:00Z', actor: 'Divya Suresh' },
      { stage: 'DRC',         timestamp: '2026-04-11T14:00:00Z', actor: 'Divya Suresh' },
      { stage: 'LVS',         timestamp: '2026-04-14T10:00:00Z', actor: 'Divya Suresh' },
    ],
  },

  // ── DRC ────────────────────────────────────────────────────────────────────
  {
    id: 'BLK005', name: 'Differential Pair', type: 'Diff Pair', techNode: '65nm', complexity: 'Complex',
    estHours: 50, actualHours: 48, area: '200µm²', assignedTo: E1, stage: 'DRC',
    description: 'Low-noise differential input pair for OTA front-end, CMRR > 80dB target.',
    createdAt: '2026-04-03T09:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-03T09:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-04T11:00:00Z', actor: 'Lokith K' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-05T10:00:00Z', actor: 'Lokith K' },
      { stage: 'DRC',         timestamp: '2026-04-10T14:00:00Z', actor: 'Lokith K' },
    ],
  },
  {
    id: 'BLK011', name: 'Ring Oscillator', type: 'Inverter', techNode: '180nm', complexity: 'Medium',
    estHours: 30, actualHours: 32, area: '140µm²', assignedTo: E1, stage: 'DRC',
    description: '5-stage ring oscillator for on-chip clock generation and process corner monitoring.',
    createdAt: '2026-04-06T09:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-06T09:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-07T11:00:00Z', actor: 'Lokith K' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-08T10:00:00Z', actor: 'Lokith K' },
      { stage: 'DRC',         timestamp: '2026-04-12T09:00:00Z', actor: 'Lokith K' },
    ],
  },
  {
    id: 'BLK019', name: 'Charge Pump', type: 'Current Mirror', techNode: '40nm', complexity: 'Complex',
    estHours: 50, actualHours: 46, area: '305µm²', assignedTo: E3, stage: 'DRC',
    description: 'Differential charge pump for PLL: matched UP/DN ±50µA, < 0.5% current mismatch.',
    createdAt: '2026-04-05T11:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-05T11:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-06T10:00:00Z', actor: 'Karthik Rajan' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-08T09:00:00Z', actor: 'Karthik Rajan' },
      { stage: 'DRC',         timestamp: '2026-04-13T10:00:00Z', actor: 'Karthik Rajan' },
    ],
  },
  {
    id: 'BLK027', name: 'Regulated Cascode Mirror', type: 'Current Mirror', techNode: '65nm', complexity: 'Complex',
    estHours: 50, actualHours: 42, area: '215µm²', assignedTo: E1, stage: 'DRC',
    description: 'High-output-impedance regulated cascode mirror. Ro > 10MΩ for precision analog biasing.',
    createdAt: '2026-04-07T10:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-07T10:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-08T09:00:00Z', actor: 'Lokith K' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-10T10:00:00Z', actor: 'Lokith K' },
      { stage: 'DRC',         timestamp: '2026-04-14T09:00:00Z', actor: 'Lokith K' },
    ],
  },

  // ── IN PROGRESS ────────────────────────────────────────────────────────────
  {
    id: 'BLK013', name: 'Folded Cascode OTA', type: 'OTA', techNode: '40nm', complexity: 'Critical',
    estHours: 80, actualHours: 60, area: '420µm²', assignedTo: E1, stage: 'IN PROGRESS',
    description: 'High-gain folded cascode OTA with gain-boosting. DC gain > 100dB, GBW 200MHz target.',
    createdAt: '2026-04-05T10:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-05T10:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-06T09:00:00Z', actor: 'Lokith K' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-08T11:00:00Z', actor: 'Lokith K' },
    ],
  },
  {
    id: 'BLK017', name: 'Integer-N PLL Core', type: 'OTA', techNode: '28nm', complexity: 'Critical',
    estHours: 80, actualHours: 58, area: '780µm²', assignedTo: E2, stage: 'IN PROGRESS',
    description: 'Integer-N PLL: 2.4GHz VCO, 40MHz reference, programmable divider N=60, < 2ps rms jitter.',
    createdAt: '2026-04-04T09:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-04T09:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-06T10:00:00Z', actor: 'Priya Nair' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-09T09:00:00Z', actor: 'Priya Nair' },
    ],
  },
  {
    id: 'BLK024', name: 'Sample and Hold', type: 'OTA', techNode: '40nm', complexity: 'Complex',
    estHours: 50, actualHours: 30, area: '260µm²', assignedTo: E1, stage: 'IN PROGRESS',
    description: 'Track-and-hold for ADC front-end. Hold pedestal < 1mV, aperture jitter < 100fs.',
    createdAt: '2026-04-08T09:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-08T09:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-09T10:00:00Z', actor: 'Lokith K' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-11T09:00:00Z', actor: 'Lokith K' },
    ],
  },
  {
    id: 'BLK028', name: 'Bootstrap Switch', type: 'Inverter', techNode: '65nm', complexity: 'Medium',
    estHours: 30, actualHours: 18, area: '155µm²', assignedTo: E2, stage: 'IN PROGRESS',
    description: 'Bootstrapped NMOS switch for ADC input sampling. Ron < 50Ω across full 1.2V swing.',
    createdAt: '2026-04-09T10:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-09T10:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-10T09:00:00Z', actor: 'Priya Nair' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-12T11:00:00Z', actor: 'Priya Nair' },
    ],
  },
  {
    id: 'BLK009', name: 'Common Gate LNA Stage', type: 'OTA', techNode: '14nm', complexity: 'Critical',
    estHours: 80, actualHours: 55, area: '175µm²', assignedTo: E4, stage: 'IN PROGRESS',
    description: 'Common-gate LNA input stage for 2.4GHz receiver. Input match 50Ω, NF < 2dB target.',
    createdAt: '2026-04-07T10:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-07T10:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-08T09:00:00Z', actor: 'Divya Suresh' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-10T11:00:00Z', actor: 'Divya Suresh' },
    ],
  },
  {
    id: 'BLK030', name: 'Two-Stage Miller OTA', type: 'OTA', techNode: '180nm', complexity: 'Complex',
    estHours: 50, actualHours: 34, area: '310µm²', assignedTo: E5, stage: 'IN PROGRESS',
    description: 'Two-stage Miller-compensated OTA for general-purpose analog. Phase margin > 60°.',
    createdAt: '2026-04-09T09:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-09T09:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-10T10:00:00Z', actor: 'Sneha Patel' },
      { stage: 'IN PROGRESS', timestamp: '2026-04-13T09:00:00Z', actor: 'Sneha Patel' },
    ],
  },

  // ── FLOORPLAN ──────────────────────────────────────────────────────────────
  {
    id: 'BLK008', name: 'PMOS Active Load', type: 'Inverter', techNode: '28nm', complexity: 'Simple',
    estHours: 20, actualHours: 8, area: '55µm²', assignedTo: E1, stage: 'FLOORPLAN',
    description: 'PMOS active load for differential amplifier with symmetrical layout for optimal matching.',
    createdAt: '2026-04-08T11:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-08T11:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-10T10:00:00Z', actor: 'Lokith K' },
    ],
  },
  {
    id: 'BLK014', name: 'Reference Buffer', type: 'OTA', techNode: '180nm', complexity: 'Simple',
    estHours: 20, actualHours: 6, area: '98µm²', assignedTo: E2, stage: 'FLOORPLAN',
    description: 'Unity-gain buffer for Vref distribution. Output impedance < 1Ω, load regulation < 0.1%.',
    createdAt: '2026-04-10T09:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-10T09:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-12T10:00:00Z', actor: 'Priya Nair' },
    ],
  },
  {
    id: 'BLK021', name: 'Bias Generator', type: 'Current Mirror', techNode: '7nm', complexity: 'Complex',
    estHours: 50, actualHours: 12, area: '88µm²', assignedTo: E3, stage: 'FLOORPLAN',
    description: 'Self-biased bandgap-referenced bias generator for all analog sub-blocks on the chip.',
    createdAt: '2026-04-11T10:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-11T10:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-13T09:00:00Z', actor: 'Karthik Rajan' },
    ],
  },
  {
    id: 'BLK026', name: 'Wilson Current Mirror', type: 'Current Mirror', techNode: '28nm', complexity: 'Medium',
    estHours: 30, actualHours: 10, area: '145µm²', assignedTo: E5, stage: 'FLOORPLAN',
    description: 'Improved Wilson mirror with high output impedance for precision analog biasing.',
    createdAt: '2026-04-11T09:00:00Z',
    stageHistory: [
      { stage: 'NOT STARTED', timestamp: '2026-04-11T09:00:00Z', actor: 'Vikram Iyer' },
      { stage: 'FLOORPLAN',   timestamp: '2026-04-13T10:00:00Z', actor: 'Sneha Patel' },
    ],
  },

  // ── NOT STARTED (unassigned — manager can assign) ──────────────────────────
  {
    id: 'BLK007', name: 'NMOS Bias Current Source', type: 'Current Mirror', techNode: '65nm', complexity: 'Simple',
    estHours: 20, actualHours: 0, area: '60µm²', assignedTo: null, stage: 'NOT STARTED',
    description: 'Simple NMOS current source for bias network. 1µA precision with low headroom.',
    createdAt: '2026-04-10T09:00:00Z',
    stageHistory: [{ stage: 'NOT STARTED', timestamp: '2026-04-10T09:00:00Z', actor: 'Vikram Iyer' }],
  },
  {
    id: 'BLK010', name: 'Self-Biased Cascode', type: 'Current Mirror', techNode: '65nm', complexity: 'Complex',
    estHours: 50, actualHours: 0, area: '210µm²', assignedTo: null, stage: 'NOT STARTED',
    description: 'Supply-independent self-biased cascode mirror for robust PVT corner operation.',
    createdAt: '2026-04-11T09:00:00Z',
    stageHistory: [{ stage: 'NOT STARTED', timestamp: '2026-04-11T09:00:00Z', actor: 'Vikram Iyer' }],
  },
  {
    id: 'BLK029', name: 'R-2R Ladder DAC 8-bit', type: 'LDO', techNode: '40nm', complexity: 'Critical',
    estHours: 80, actualHours: 0, area: '520µm²', assignedTo: null, stage: 'NOT STARTED',
    description: '8-bit R-2R DAC for trim calibration. INL < 0.5 LSB, DNL < 0.5 LSB post-calibration.',
    createdAt: '2026-04-12T10:00:00Z',
    stageHistory: [{ stage: 'NOT STARTED', timestamp: '2026-04-12T10:00:00Z', actor: 'Vikram Iyer' }],
  },
  {
    id: 'BLK031', name: 'Sense Amplifier', type: 'Diff Pair', techNode: '14nm', complexity: 'Complex',
    estHours: 50, actualHours: 0, area: '180µm²', assignedTo: null, stage: 'NOT STARTED',
    description: 'Cross-coupled SRAM sense amplifier. Offset < 10mV, propagation delay < 300ps.',
    createdAt: '2026-04-12T14:00:00Z',
    stageHistory: [{ stage: 'NOT STARTED', timestamp: '2026-04-12T14:00:00Z', actor: 'Vikram Iyer' }],
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGOURI;
    if (!mongoUri) { console.error('MONGOURI not found in .env'); process.exit(1); }

    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');

    try { await Block.collection.drop(); } catch (_) {}
    try { await User.collection.drop();  } catch (_) {}

    await User.insertMany(users);
    await Block.insertMany(blocks);

    console.log(`✓ Seeded ${users.length} users and ${blocks.length} blocks.`);
    console.log(`  Managers: ${MGR1}, ${MGR2}`);
    console.log(`  Engineer (Lokith): ${E1} — ${blocks.filter(b => b.assignedTo === E1).length} blocks assigned`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDB();
