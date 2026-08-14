/** الجودة والإنتاج — Quality & Production domain. */

export interface DashtInspection {
  id: string;
  weighingSerial: number;
  date: string;
  supplierCode: string;
  supplierName: string;
  /** Classification decided by Quality after the first weighing. */
  gradeKey: string;
  /** Discount percent applied to the دشت price by Quality. */
  discountPercent: number;
  firstWeightKg: number;
  secondWeightKg?: number;
  netWeightKg?: number;
  accepted: boolean;
  inspector: string;
}

export interface MaterialInspection {
  id: string;
  date: string;
  materialKey: string;
  batchNo: string;
  result: 'accepted' | 'rejected';
  notes?: string;
}

export interface ChemicalBatchConsumption {
  id: string;
  date: string;
  tankId: string;
  chemicalName: string;
  quantityKg: number;
  costPerKg: number;
  totalCost: number;
}

export interface MaintenanceRecord {
  id: string;
  machineNameKey: string;
  date: string;
  typeKey: string;
  description: string;
  downtimeHours: number;
  status: 'scheduled' | 'in-progress' | 'done';
}

export interface ProductionOrder {
  id: string;
  number: string;
  date: string;
  workOrderNumber: string;
  specCode: string;
  specName: string;
  quantityKg: number;
  producedKg: number;
  wastePercent: number;
  rollsTarget: number;
  rollsProduced: number;
  status: 'open' | 'in-progress' | 'completed' | 'late' | 'stopped';
  expectedFinish: string;
  /** Auto-created when stock did not cover a sales work order. */
  autoCreated: boolean;
}
