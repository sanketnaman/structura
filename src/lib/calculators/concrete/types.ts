export interface ConcreteInputs {
  length: number;       // in feet or meters
  width: number;        // in feet or meters
  thickness: number;    // in inches or centimeters
  wastePercent: number; // 0 to 100
  isMetric: boolean;
  unitPrice?: number;   // Price per cubic yard or cubic meter
}

export interface ConcreteResult {
  // Base Net Dimensions
  length: number;
  width: number;
  thickness: number;
  isMetric: boolean;

  // Primary Imperial Units
  baseVolumeCuFt: number;
  baseVolumeYards: number;
  wastePercent: number;
  wasteVolumeCuFt: number;
  wasteVolumeYards: number;
  totalCuFt: number;
  totalCubicYards: number;

  // Primary Metric Units
  baseVolumeM3: number;
  wasteVolumeM3: number;
  totalVolumeM3: number;

  // Logistics & Packaging Breakdown
  bags80lb: number;
  bags60lb: number;
  truckLoads: number;

  // Step-by-Step Conversion Traces
  thicknessInFeet: number;
  thicknessInMeters: number;

  // Cost
  unitPrice: number;
  estimatedCost: number;
}
