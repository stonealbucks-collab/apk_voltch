export type WorkflowType = 'service' | 'assembly';

export type ExpedienteStatus =
  | 'recepcion'
  | 'reparacion'
  | 'diagnostico'
  | 'ensamblaje'
  | 'pruebas_banco'
  | 'homologado'
  | 'listo'
  | 'cuarentena'
  | 'liberado';

export type SeverityLevel = 'bueno' | 'regular' | 'malo' | 'critico';

export interface EvidencePhoto {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  observation: string;
  timestamp: string;
  technicianName: string;
  subsystemTag: string;
  severity: SeverityLevel;
  tagCode?: string;
  voltageReading?: string;
}

export interface SubsystemItem {
  id: string;
  name: string;
  icon: string;
  status: SeverityLevel;
  alertText: string;
  voiceNoteDuration?: string;
  photoCount: number;
  observationNote?: string;
}

export interface WorkOrder {
  id: string;
  code: string;
  title: string;
  status: 'en_proceso' | 'completado' | 'pendiente';
  estimatedHours: number;
  actualHours?: number;
  technician: string;
  certificateOk?: boolean;
  completionTime?: string;
  blockedBy?: string;
}

export interface SparePart {
  id: string;
  sku: string;
  name: string;
  bayStock: number;
  unit: string;
  unitPrice: number;
  quantity: number;
  category: 'HV' | 'Mecánico' | 'Químico' | 'Electrónico';
  icon: string;
}

export interface AssemblyComponent {
  id: string;
  stepNumber: string;
  name: string;
  serialCode: string;
  specs: string;
  isValidated: boolean;
}

export interface AssemblyStage {
  id: string;
  stepNumber: string;
  title: string;
  spec: string;
  toolUsed: string;
  structuralCheck: string;
  isVerified: boolean;
}

export interface Expediente {
  id: string;
  folio: string;
  type: WorkflowType;
  status: ExpedienteStatus;
  statusLabel: string;
  stepProgress: string; // e.g. "01 / 03"
  createdAt: string;
  vehicleModel: string;
  vehicleYear?: string;
  vehiclePlate: string;
  vin: string;
  clientName: string;
  clientRuc: string;
  clientPhone?: string;
  fleetName?: string;
  odometer: number;
  batterySoc: number;
  batterySpecs: string;
  bayId: string;
  technicianName: string;
  technicianRole: string;
  technicianCip: string;
  imageUrl?: string;
  highVoltageLive: boolean;
  isolationResistanceMOhm: number;
  isLotoActive: boolean;
  faultSummary?: string;
  clientReport?: string;
  obdDtcCode?: string;
  confirmedDiagnostic?: string;
  focTemp?: number;
  subsystems: SubsystemItem[];
  evidences: EvidencePhoto[];
  workOrders: WorkOrder[];
  spareParts: SparePart[];
  laborRatePerHour: number;
  assemblyComponents?: AssemblyComponent[];
  assemblyStages?: AssemblyStage[];
  carrierSignature?: string;
  engineerSignature?: string;
  clientSignature?: string;
  sha256Hash: string;
  warrantyPeriodMonths: number;
  warrantyKilometers: number;
}
