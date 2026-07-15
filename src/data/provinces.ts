/**
 * Placeholder province cost multipliers (labor + material index vs. NCR baseline = 1.00).
 * TODO: replace with real Archiunite regional cost data via the admin panel.
 */
export interface ProvinceOption {
  name: string;
  region: string;
  multiplier: number;
  cities: string[];
}

export const PROVINCES: ProvinceOption[] = [
  { name: "Metro Manila", region: "NCR", multiplier: 1.0, cities: ["Quezon City", "Makati", "Taguig", "Manila", "Pasig", "Mandaluyong", "Parañaque"] },
  { name: "Cavite", region: "Region IV-A", multiplier: 0.88, cities: ["Bacoor", "Dasmariñas", "Imus", "Tagaytay", "General Trias"] },
  { name: "Laguna", region: "Region IV-A", multiplier: 0.89, cities: ["Santa Rosa", "Calamba", "San Pablo", "Biñan"] },
  { name: "Batangas", region: "Region IV-A", multiplier: 0.85, cities: ["Batangas City", "Lipa", "Tanauan"] },
  { name: "Rizal", region: "Region IV-A", multiplier: 0.9, cities: ["Antipolo", "Cainta", "Taytay"] },
  { name: "Bulacan", region: "Region III", multiplier: 0.87, cities: ["Malolos", "Meycauayan", "San Jose del Monte"] },
  { name: "Pampanga", region: "Region III", multiplier: 0.86, cities: ["San Fernando", "Angeles City", "Mabalacat"] },
  { name: "Cebu", region: "Region VII", multiplier: 0.92, cities: ["Cebu City", "Mandaue", "Lapu-Lapu", "Talisay"] },
  { name: "Davao del Sur", region: "Region XI", multiplier: 0.83, cities: ["Davao City", "Digos"] },
  { name: "Iloilo", region: "Region VI", multiplier: 0.8, cities: ["Iloilo City", "Oton", "Pavia"] },
  { name: "Benguet", region: "CAR", multiplier: 0.94, cities: ["Baguio City", "La Trinidad"] },
  { name: "Pangasinan", region: "Region I", multiplier: 0.78, cities: ["Dagupan", "San Carlos", "Urdaneta"] },
];
