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
  status: 'pending' | 'scheduled' | 'in-progress' | 'done';
  source?: 'quality' | 'production';
  scheduledAt?: string;
}

export interface TechDataSheet {
  id: string;
  specCode: string;
  specName: string;
  gsm: number;
  /** Serial of the cutter roll this sheet was registered for (roll-level sheets). */
  rollSerial?: number;
  /** Number of plies carried over from the roll. */
  ply?: string;
  /** السماكة — sheet thickness. */
  thickness: number;
  brightnessPercent: number;
  /** شد طولي — machine-direction tensile. */
  tensileMd: number;
  /** شد عرضي — cross-direction tensile. */
  tensileCd: number;
  notes?: string;
}

export interface ProductionOrder {
  id: string;
  number: string;
  date: string;
  workOrderNumber: string;
  specCode: string;
  specName: string;
  mixType?: string;
  productName?: string;
  parentFamily?: string;
  ply?: string;
  color?: string;
  gsm?: number;
  widthMm?: number;
  quantityKg: number;
  producedKg: number;
  wastePercent: number;
  rollsTarget: number;
  rollsProduced: number;
  status: 'open' | 'in-progress' | 'completed' | 'late' | 'stopped';
  expectedFinish: string;
  /** Auto-created when stock did not cover a sales work order. */
  autoCreated: boolean;
  /** Where the order came from — local work order / export order / manual. */
  sourceType?: 'work-order' | 'export-order' | 'manual';
  /** Sales-originated orders wait for production approval before running. */
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  /** Schedule date captured when the order is approved. */
  scheduledDate?: string;
  /** Id of the linked sales work order / export order. */
  sourceId?: string;
  /** Request from Sales to move the loading date — decided here. */
  rescheduleDate?: string;
  rescheduleStatus?: 'pending' | 'approved' | 'rejected';
}
