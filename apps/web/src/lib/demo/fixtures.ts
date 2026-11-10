// Deterministic synthetic fixtures. NEVER real patient data.
import { addDays, differenceInDays, parseISO } from "date-fns";

export type Role = "PATIENT" | "DOCTOR" | "NURSE" | "MIDWIFE" | "ADMIN" | "SYSTEM";
export type RiskLevel = "LOW" | "MODERATE" | "HIGH";
export type Severity = "INFO" | "WARNING" | "CRITICAL";

export const DEMO_TODAY = parseISO("2026-11-04");

export interface Mother {
  id: string;
  opd: string;
  name: string;
  dob: string;
  phone: string;
  district: string;
  bloodGroup: string;
  risk: RiskLevel;
  midwife: string;
  clinic: string;
}

export interface Pregnancy {
  id: string;
  motherId: string;
  lmp: string;
  status: "ACTIVE" | "DELIVERED" | "CLOSED";
  gravida: number;
  para: number;
  risk: RiskLevel;
  riskFactors: string[];
}

export interface Observation {
  id: string;
  pregnancyId: string;
  date: string;
  type: string;
  value: string;
  unit: string;
  loinc: string;
  flag?: "HIGH" | "LOW";
  recordedBy: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  clinic: string;
  provider: string;
  status: "SCHEDULED" | "COMPLETED" | "MISSED" | "CANCELLED";
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dose: string;
  frequency: string;
  start: string;
  end: string;
  collected: boolean;
}

export interface Child {
  id: string;
  motherId: string;
  name: string;
  dob: string;
  sex: "F" | "M";
  birthWeightKg: number;
}

export interface Vaccination {
  id: string;
  childId: string;
  vaccine: string;
  dose: string;
  dueDate: string;
  givenDate?: string;
}

export interface GrowthPoint {
  childId: string;
  ageMonths: number;
  weightKg: number;
  heightCm: number;
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  severity: Severity;
  title: string;
  detail: string;
  date: string;
  acknowledged: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  clinic: string;
  status: "ACTIVE" | "SUSPENDED";
  lastLogin: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  role: Role;
  action: string;
  resource: string;
  outcome: "SUCCESS" | "DENIED";
}

export const mothers: Mother[] = [
  {
    id: "m1",
    opd: "OPD-2026-000001",
    name: "Kamala Perera",
    dob: "1994-06-15",
    phone: "+94 71 000 0001",
    district: "Colombo",
    bloodGroup: "O+",
    risk: "MODERATE",
    midwife: "Nirmala Silva",
    clinic: "Borella MOH Clinic",
  },
  {
    id: "m2",
    opd: "OPD-2026-000002",
    name: "Dilini Fernando",
    dob: "1991-02-03",
    phone: "+94 71 000 0002",
    district: "Gampaha",
    bloodGroup: "A+",
    risk: "HIGH",
    midwife: "Nirmala Silva",
    clinic: "Borella MOH Clinic",
  },
  {
    id: "m3",
    opd: "OPD-2026-000003",
    name: "Sanduni Jayasinghe",
    dob: "1998-09-21",
    phone: "+94 71 000 0003",
    district: "Kandy",
    bloodGroup: "B+",
    risk: "LOW",
    midwife: "Ramya Wickrama",
    clinic: "Peradeniya MOH Clinic",
  },
  {
    id: "m4",
    opd: "OPD-2026-000004",
    name: "Fathima Rizvi",
    dob: "1996-12-11",
    phone: "+94 71 000 0004",
    district: "Colombo",
    bloodGroup: "AB+",
    risk: "LOW",
    midwife: "Nirmala Silva",
    clinic: "Borella MOH Clinic",
  },
  {
    id: "m5",
    opd: "OPD-2026-000005",
    name: "Tharushi Bandara",
    dob: "1989-04-30",
    phone: "+94 71 000 0005",
    district: "Kurunegala",
    bloodGroup: "O-",
    risk: "HIGH",
    midwife: "Ramya Wickrama",
    clinic: "Kurunegala MOH Clinic",
  },
  {
    id: "m6",
    opd: "OPD-2026-000006",
    name: "Nadeesha Kumari",
    dob: "2000-07-08",
    phone: "+94 71 000 0006",
    district: "Galle",
    bloodGroup: "A-",
    risk: "MODERATE",
    midwife: "Chamari Gunasekara",
    clinic: "Galle MOH Clinic",
  },
];

export const pregnancies: Pregnancy[] = [
  {
    id: "p1",
    motherId: "m1",
    lmp: "2026-03-01",
    status: "ACTIVE",
    gravida: 2,
    para: 1,
    risk: "MODERATE",
    riskFactors: ["Mild anaemia"],
  },
  {
    id: "p2",
    motherId: "m2",
    lmp: "2026-02-10",
    status: "ACTIVE",
    gravida: 3,
    para: 2,
    risk: "HIGH",
    riskFactors: ["Gestational hypertension", "Previous C-section"],
  },
  {
    id: "p3",
    motherId: "m3",
    lmp: "2026-06-12",
    status: "ACTIVE",
    gravida: 1,
    para: 0,
    risk: "LOW",
    riskFactors: [],
  },
  {
    id: "p4",
    motherId: "m4",
    lmp: "2026-05-02",
    status: "ACTIVE",
    gravida: 1,
    para: 0,
    risk: "LOW",
    riskFactors: [],
  },
  {
    id: "p5",
    motherId: "m5",
    lmp: "2026-01-20",
    status: "ACTIVE",
    gravida: 4,
    para: 3,
    risk: "HIGH",
    riskFactors: ["Gestational diabetes", "Age > 35"],
  },
  {
    id: "p6",
    motherId: "m6",
    lmp: "2026-04-15",
    status: "ACTIVE",
    gravida: 1,
    para: 0,
    risk: "MODERATE",
    riskFactors: ["Low BMI"],
  },
];

export const observations: Observation[] = [
  {
    id: "o1",
    pregnancyId: "p1",
    date: "2026-05-10",
    type: "Blood pressure",
    value: "112/72",
    unit: "mmHg",
    loinc: "85354-9",
    recordedBy: "Nirmala Silva",
  },
  {
    id: "o2",
    pregnancyId: "p1",
    date: "2026-05-10",
    type: "Haemoglobin",
    value: "10.4",
    unit: "g/dL",
    loinc: "718-7",
    flag: "LOW",
    recordedBy: "Dr. Asela Ranasinghe",
  },
  {
    id: "o3",
    pregnancyId: "p1",
    date: "2026-07-12",
    type: "Blood pressure",
    value: "116/74",
    unit: "mmHg",
    loinc: "85354-9",
    recordedBy: "Nirmala Silva",
  },
  {
    id: "o4",
    pregnancyId: "p1",
    date: "2026-07-12",
    type: "Body weight",
    value: "61.2",
    unit: "kg",
    loinc: "29463-7",
    recordedBy: "Nirmala Silva",
  },
  {
    id: "o5",
    pregnancyId: "p1",
    date: "2026-09-14",
    type: "Haemoglobin",
    value: "11.2",
    unit: "g/dL",
    loinc: "718-7",
    recordedBy: "Dr. Asela Ranasinghe",
  },
  {
    id: "o6",
    pregnancyId: "p1",
    date: "2026-10-20",
    type: "Blood pressure",
    value: "118/76",
    unit: "mmHg",
    loinc: "85354-9",
    recordedBy: "Nirmala Silva",
  },
  {
    id: "o7",
    pregnancyId: "p1",
    date: "2026-10-20",
    type: "Fundal height",
    value: "31",
    unit: "cm",
    loinc: "11881-0",
    recordedBy: "Nirmala Silva",
  },
  {
    id: "o8",
    pregnancyId: "p2",
    date: "2026-10-28",
    type: "Blood pressure",
    value: "148/96",
    unit: "mmHg",
    loinc: "85354-9",
    flag: "HIGH",
    recordedBy: "Dr. Asela Ranasinghe",
  },
  {
    id: "o9",
    pregnancyId: "p5",
    date: "2026-10-30",
    type: "Fasting glucose",
    value: "132",
    unit: "mg/dL",
    loinc: "1558-6",
    flag: "HIGH",
    recordedBy: "Dr. Asela Ranasinghe",
  },
];

export const weightTrend = [
  { week: 10, weight: 54.8 },
  { week: 14, weight: 55.9 },
  { week: 18, weight: 57.6 },
  { week: 22, weight: 59.1 },
  { week: 26, weight: 61.2 },
  { week: 30, weight: 63.0 },
  { week: 33, weight: 64.1 },
];

export const appointments: Appointment[] = [
  {
    id: "a1",
    patientId: "m1",
    patientName: "Kamala Perera",
    date: "2026-11-10",
    time: "09:30",
    type: "Antenatal visit (34 wks)",
    clinic: "Borella MOH Clinic",
    provider: "Nirmala Silva",
    status: "SCHEDULED",
  },
  {
    id: "a2",
    patientId: "m1",
    patientName: "Kamala Perera",
    date: "2026-11-24",
    time: "10:00",
    type: "Growth scan",
    clinic: "Castle Street Hospital",
    provider: "Dr. Asela Ranasinghe",
    status: "SCHEDULED",
  },
  {
    id: "a3",
    patientId: "m2",
    patientName: "Dilini Fernando",
    date: "2026-11-04",
    time: "08:45",
    type: "BP review",
    clinic: "Borella MOH Clinic",
    provider: "Dr. Asela Ranasinghe",
    status: "SCHEDULED",
  },
  {
    id: "a4",
    patientId: "m4",
    patientName: "Fathima Rizvi",
    date: "2026-11-04",
    time: "10:15",
    type: "Antenatal visit (26 wks)",
    clinic: "Borella MOH Clinic",
    provider: "Nirmala Silva",
    status: "SCHEDULED",
  },
  {
    id: "a5",
    patientId: "m5",
    patientName: "Tharushi Bandara",
    date: "2026-11-04",
    time: "11:00",
    type: "GDM follow-up",
    clinic: "Kurunegala MOH Clinic",
    provider: "Dr. Asela Ranasinghe",
    status: "SCHEDULED",
  },
  {
    id: "a6",
    patientId: "m6",
    patientName: "Nadeesha Kumari",
    date: "2026-10-30",
    time: "09:00",
    type: "Antenatal visit",
    clinic: "Galle MOH Clinic",
    provider: "Chamari Gunasekara",
    status: "MISSED",
  },
  {
    id: "a7",
    patientId: "m1",
    patientName: "Kamala Perera",
    date: "2026-10-20",
    time: "09:30",
    type: "Antenatal visit (33 wks)",
    clinic: "Borella MOH Clinic",
    provider: "Nirmala Silva",
    status: "COMPLETED",
  },
];

export const medications: Medication[] = [
  {
    id: "med1",
    patientId: "m1",
    name: "Folic acid",
    dose: "400 mcg",
    frequency: "Once daily",
    start: "2026-03-15",
    end: "2026-12-10",
    collected: true,
  },
  {
    id: "med2",
    patientId: "m1",
    name: "Ferrous sulphate",
    dose: "200 mg",
    frequency: "Twice daily",
    start: "2026-05-10",
    end: "2026-12-10",
    collected: true,
  },
  {
    id: "med3",
    patientId: "m1",
    name: "Calcium carbonate",
    dose: "500 mg",
    frequency: "Once daily",
    start: "2026-06-01",
    end: "2026-12-10",
    collected: false,
  },
  {
    id: "med4",
    patientId: "m1",
    name: "Vitamin C",
    dose: "100 mg",
    frequency: "Once daily",
    start: "2026-05-10",
    end: "2026-12-10",
    collected: true,
  },
];

export const children: Child[] = [
  {
    id: "c1",
    motherId: "m1",
    name: "Senuli Perera",
    dob: "2024-08-02",
    sex: "F",
    birthWeightKg: 3.1,
  },
];

export const vaccinations: Vaccination[] = [
  {
    id: "v1",
    childId: "c1",
    vaccine: "BCG",
    dose: "Single",
    dueDate: "2024-08-02",
    givenDate: "2024-08-03",
  },
  {
    id: "v2",
    childId: "c1",
    vaccine: "Pentavalent + OPV",
    dose: "1st",
    dueDate: "2024-10-02",
    givenDate: "2024-10-03",
  },
  {
    id: "v3",
    childId: "c1",
    vaccine: "Pentavalent + OPV",
    dose: "2nd",
    dueDate: "2024-12-02",
    givenDate: "2024-12-04",
  },
  {
    id: "v4",
    childId: "c1",
    vaccine: "Pentavalent + OPV",
    dose: "3rd",
    dueDate: "2025-02-02",
    givenDate: "2025-02-05",
  },
  {
    id: "v5",
    childId: "c1",
    vaccine: "MMR",
    dose: "1st",
    dueDate: "2025-05-02",
    givenDate: "2025-05-06",
  },
  {
    id: "v6",
    childId: "c1",
    vaccine: "Live JE",
    dose: "Single",
    dueDate: "2025-08-02",
    givenDate: "2025-08-04",
  },
  {
    id: "v7",
    childId: "c1",
    vaccine: "DPT + OPV",
    dose: "4th",
    dueDate: "2026-02-02",
    givenDate: "2026-02-10",
  },
  { id: "v8", childId: "c1", vaccine: "MMR", dose: "2nd", dueDate: "2027-08-02" },
];

export const growth: GrowthPoint[] = [
  { childId: "c1", ageMonths: 0, weightKg: 3.1, heightCm: 49 },
  { childId: "c1", ageMonths: 2, weightKg: 5.0, heightCm: 57 },
  { childId: "c1", ageMonths: 4, weightKg: 6.4, heightCm: 62 },
  { childId: "c1", ageMonths: 6, weightKg: 7.3, heightCm: 66 },
  { childId: "c1", ageMonths: 9, weightKg: 8.2, heightCm: 70 },
  { childId: "c1", ageMonths: 12, weightKg: 8.9, heightCm: 74 },
  { childId: "c1", ageMonths: 18, weightKg: 10.1, heightCm: 80 },
  { childId: "c1", ageMonths: 24, weightKg: 11.3, heightCm: 85 },
  { childId: "c1", ageMonths: 27, weightKg: 11.8, heightCm: 87.5 },
];

export const alerts: Alert[] = [
  {
    id: "al1",
    patientId: "m2",
    patientName: "Dilini Fernando",
    severity: "CRITICAL",
    title: "Elevated blood pressure",
    detail: "148/96 mmHg at 37 weeks. Review for pre-eclampsia.",
    date: "2026-10-28",
    acknowledged: false,
  },
  {
    id: "al2",
    patientId: "m5",
    patientName: "Tharushi Bandara",
    severity: "WARNING",
    title: "Fasting glucose above target",
    detail: "132 mg/dL. Consider treatment adjustment.",
    date: "2026-10-30",
    acknowledged: false,
  },
  {
    id: "al3",
    patientId: "m6",
    patientName: "Nadeesha Kumari",
    severity: "WARNING",
    title: "Missed antenatal visit",
    detail: "Missed 30 Oct appointment. Follow-up call required.",
    date: "2026-10-30",
    acknowledged: false,
  },
  {
    id: "al4",
    patientId: "m1",
    patientName: "Kamala Perera",
    severity: "INFO",
    title: "Calcium supply not collected",
    detail: "Prescription ready at clinic pharmacy.",
    date: "2026-11-01",
    acknowledged: false,
  },
];

export const users: User[] = [
  {
    id: "u1",
    name: "Dr. Asela Ranasinghe",
    email: "asela.r@demo.adhya",
    role: "DOCTOR",
    clinic: "Borella MOH Clinic",
    status: "ACTIVE",
    lastLogin: "2026-11-04 08:12",
  },
  {
    id: "u2",
    name: "Nirmala Silva",
    email: "nirmala.s@demo.adhya",
    role: "MIDWIFE",
    clinic: "Borella MOH Clinic",
    status: "ACTIVE",
    lastLogin: "2026-11-04 07:55",
  },
  {
    id: "u3",
    name: "Ramya Wickrama",
    email: "ramya.w@demo.adhya",
    role: "MIDWIFE",
    clinic: "Peradeniya MOH Clinic",
    status: "ACTIVE",
    lastLogin: "2026-11-03 16:40",
  },
  {
    id: "u4",
    name: "Chamari Gunasekara",
    email: "chamari.g@demo.adhya",
    role: "NURSE",
    clinic: "Galle MOH Clinic",
    status: "ACTIVE",
    lastLogin: "2026-11-02 11:03",
  },
  {
    id: "u5",
    name: "Kamala Perera",
    email: "kamala.p@demo.adhya",
    role: "PATIENT",
    clinic: "Borella MOH Clinic",
    status: "ACTIVE",
    lastLogin: "2026-11-03 21:15",
  },
  {
    id: "u6",
    name: "Ruwan Dissanayake",
    email: "ruwan.d@demo.adhya",
    role: "ADMIN",
    clinic: "Regional office",
    status: "ACTIVE",
    lastLogin: "2026-11-04 09:01",
  },
  {
    id: "u7",
    name: "Integration bot",
    email: "fhir-sync@demo.adhya",
    role: "SYSTEM",
    clinic: "—",
    status: "ACTIVE",
    lastLogin: "2026-11-04 09:30",
  },
  {
    id: "u8",
    name: "Priya Mendis",
    email: "priya.m@demo.adhya",
    role: "NURSE",
    clinic: "Kurunegala MOH Clinic",
    status: "SUSPENDED",
    lastLogin: "2026-09-12 10:20",
  },
];

export const auditLog: AuditEntry[] = [
  {
    id: "l1",
    at: "2026-11-04 09:31",
    actor: "Dr. Asela Ranasinghe",
    role: "DOCTOR",
    action: "READ",
    resource: "Patient/m2",
    outcome: "SUCCESS",
  },
  {
    id: "l2",
    at: "2026-11-04 09:28",
    actor: "Nirmala Silva",
    role: "MIDWIFE",
    action: "CREATE",
    resource: "Observation/o9",
    outcome: "SUCCESS",
  },
  {
    id: "l3",
    at: "2026-11-04 09:12",
    actor: "Priya Mendis",
    role: "NURSE",
    action: "LOGIN",
    resource: "Session",
    outcome: "DENIED",
  },
  {
    id: "l4",
    at: "2026-11-04 08:55",
    actor: "Integration bot",
    role: "SYSTEM",
    action: "EXPORT",
    resource: "Bundle/fhir-daily",
    outcome: "SUCCESS",
  },
  {
    id: "l5",
    at: "2026-11-04 08:40",
    actor: "Kamala Perera",
    role: "PATIENT",
    action: "READ",
    resource: "Patient/m2",
    outcome: "DENIED",
  },
  {
    id: "l6",
    at: "2026-11-04 08:12",
    actor: "Dr. Asela Ranasinghe",
    role: "DOCTOR",
    action: "LOGIN",
    resource: "Session",
    outcome: "SUCCESS",
  },
  {
    id: "l7",
    at: "2026-11-03 17:02",
    actor: "Ruwan Dissanayake",
    role: "ADMIN",
    action: "UPDATE",
    resource: "User/u8 (suspended)",
    outcome: "SUCCESS",
  },
];

export const registrationsByMonth = [
  { month: "Jun", count: 38 },
  { month: "Jul", count: 44 },
  { month: "Aug", count: 41 },
  { month: "Sep", count: 52 },
  { month: "Oct", count: 57 },
  { month: "Nov", count: 12 },
];

// ---- derived helpers ----
export function gestationalAge(lmp: string, today = DEMO_TODAY) {
  const days = differenceInDays(today, parseISO(lmp));
  return { weeks: Math.floor(days / 7), days: days % 7, totalDays: days };
}
export function eddFromLmp(lmp: string) {
  return addDays(parseISO(lmp), 280);
}
export function trimester(weeks: number) {
  return weeks < 14 ? 1 : weeks < 28 ? 2 : 3;
}
export function ageYears(dob: string, today = DEMO_TODAY) {
  return Math.floor(differenceInDays(today, parseISO(dob)) / 365.25);
}
export function ageLabel(dob: string, today = DEMO_TODAY) {
  const months = Math.floor(differenceInDays(today, parseISO(dob)) / 30.44);
  return months < 24 ? `${months} months` : `${Math.floor(months / 12)} y ${months % 12} m`;
}
export function vaccinationStatus(v: Vaccination, today = DEMO_TODAY) {
  if (v.givenDate) return "GIVEN" as const;
  return parseISO(v.dueDate) < today ? ("OVERDUE" as const) : ("UPCOMING" as const);
}

export const getMother = (id: string) => mothers.find((m) => m.id === id);
export const pregnancyFor = (motherId: string) =>
  pregnancies.find((p) => p.motherId === motherId && p.status === "ACTIVE");
export const getChild = (id: string) => children.find((c) => c.id === id);

// ---- Ultrasound, delivery, postpartum ----
export interface Ultrasound {
  id: string;
  pregnancyId: string;
  date: string;
  gaWeeks: number;
  type: "Dating" | "Anomaly" | "Growth" | "Doppler";
  efwGrams?: number | undefined;
  presentation: string;
  placenta: string;
  liquor: string;
  heartRate: number;
  findings: string;
  sonographer: string;
  concern?: boolean;
}

export interface Delivery {
  pregnancyId: string;
  date: string;
  time: string;
  gaWeeks: number;
  facility: string;
  mode: "Spontaneous vaginal" | "Assisted vaginal" | "Elective C-section" | "Emergency C-section";
  attendant: string;
  bloodLossMl: number;
  complications: string[];
  baby: { sex: "F" | "M"; weightKg: number; apgar1: number; apgar5: number; childId?: string };
}

export interface PostpartumVisit {
  id: string;
  pregnancyId: string;
  date: string;
  dayAfterBirth: number;
  bp: string;
  temperatureC: number;
  uterus: string;
  lochia: string;
  breastfeeding: "Exclusive" | "Mixed" | "Not breastfeeding";
  epds: number; // Edinburgh Postnatal Depression Scale 0–30
  contraception?: string;
  provider: string;
}

pregnancies.push({
  id: "p0",
  motherId: "m1",
  lmp: "2023-10-27",
  status: "DELIVERED",
  gravida: 1,
  para: 0,
  risk: "LOW",
  riskFactors: [],
});

export const ultrasounds: Ultrasound[] = [
  {
    id: "us1",
    pregnancyId: "p1",
    date: "2026-05-24",
    gaWeeks: 12,
    type: "Dating",
    presentation: "—",
    placenta: "Posterior",
    liquor: "Normal",
    heartRate: 158,
    findings: "Single live intrauterine pregnancy. CRL consistent with LMP dates. NT 1.4 mm.",
    sonographer: "Dr. Asela Ranasinghe",
  },
  {
    id: "us2",
    pregnancyId: "p1",
    date: "2026-07-19",
    gaWeeks: 20,
    type: "Anomaly",
    efwGrams: 330,
    presentation: "Variable",
    placenta: "Posterior, upper segment",
    liquor: "Normal",
    heartRate: 148,
    findings: "No structural anomalies detected. Four-chamber heart normal.",
    sonographer: "Dr. Asela Ranasinghe",
  },
  {
    id: "us3",
    pregnancyId: "p1",
    date: "2026-10-04",
    gaWeeks: 31,
    type: "Growth",
    efwGrams: 1620,
    presentation: "Cephalic",
    placenta: "Posterior, upper segment",
    liquor: "AFI 14 cm",
    heartRate: 142,
    findings: "Growth along 45th centile.",
    sonographer: "Dr. Asela Ranasinghe",
  },
  {
    id: "us4",
    pregnancyId: "p2",
    date: "2026-10-28",
    gaWeeks: 37,
    type: "Doppler",
    efwGrams: 2650,
    presentation: "Cephalic",
    placenta: "Anterior",
    liquor: "AFI 7 cm (reduced)",
    heartRate: 138,
    findings: "Umbilical artery PI at upper limit. Reduced liquor.",
    sonographer: "Dr. Asela Ranasinghe",
    concern: true,
  },
];

export const deliveries: Delivery[] = [
  {
    pregnancyId: "p0",
    date: "2024-08-02",
    time: "04:42",
    gaWeeks: 39,
    facility: "Castle Street Hospital for Women",
    mode: "Spontaneous vaginal",
    attendant: "Dr. Asela Ranasinghe",
    bloodLossMl: 300,
    complications: [],
    baby: { sex: "F", weightKg: 3.1, apgar1: 8, apgar5: 9, childId: "c1" },
  },
];

export const postpartumVisits: PostpartumVisit[] = [
  {
    id: "pp1",
    pregnancyId: "p0",
    date: "2024-08-05",
    dayAfterBirth: 3,
    bp: "118/76",
    temperatureC: 36.8,
    uterus: "Firm, at umbilicus",
    lochia: "Rubra, normal",
    breastfeeding: "Exclusive",
    epds: 6,
    provider: "Nirmala Silva",
  },
  {
    id: "pp2",
    pregnancyId: "p0",
    date: "2024-08-12",
    dayAfterBirth: 10,
    bp: "114/72",
    temperatureC: 36.6,
    uterus: "Not palpable",
    lochia: "Serosa",
    breastfeeding: "Exclusive",
    epds: 9,
    provider: "Nirmala Silva",
  },
  {
    id: "pp3",
    pregnancyId: "p0",
    date: "2024-09-13",
    dayAfterBirth: 42,
    bp: "112/70",
    temperatureC: 36.7,
    uterus: "Involuted",
    lochia: "Ceased",
    breastfeeding: "Exclusive",
    epds: 5,
    contraception: "Progestogen-only pill",
    provider: "Dr. Asela Ranasinghe",
  },
];

/** WHO-recommended postnatal contacts (days after birth). */
export const POSTNATAL_SCHEDULE = [
  { day: 1, from: 0, to: 1, label: "Within 24 hours" },
  { day: 3, from: 2, to: 4, label: "Day 3" },
  { day: 10, from: 7, to: 14, label: "Days 7–14" },
  { day: 42, from: 35, to: 49, label: "6 weeks" },
];

/** EPDS ≥ 13 suggests probable depression; any score ≥ 10 warrants follow-up. */
export function epdsLevel(score: number) {
  if (score >= 13) return "HIGH" as const;
  if (score >= 10) return "MODERATE" as const;
  return "LOW" as const;
}

/** PPH = blood loss ≥ 500 mL (vaginal) or ≥ 1000 mL (caesarean). */
export function isPostpartumHaemorrhage(bloodLossMl: number, mode: Delivery["mode"]) {
  return bloodLossMl >= (mode.includes("C-section") ? 1000 : 500);
}

export const getPregnancy = (id: string) => pregnancies.find((p) => p.id === id);

// ---- Clinics (synthetic) ----
export interface Clinic {
  id: string;
  name: string;
  district: string;
  type: "MOH clinic" | "Hospital";
  address: string;
  phone: string;
  sessions: string[];
  lead: string;
}

export const clinics: Clinic[] = [
  {
    id: "c1",
    name: "Borella MOH Clinic",
    district: "Colombo",
    type: "MOH clinic",
    address: "12 Demo Road, Borella",
    phone: "+94 11 000 0101",
    sessions: ["Mon 08:30–12:00 Antenatal", "Wed 08:30–12:00 Postnatal & child"],
    lead: "Dr. Asela Ranasinghe",
  },
  {
    id: "c2",
    name: "Peradeniya MOH Clinic",
    district: "Kandy",
    type: "MOH clinic",
    address: "4 Sample Lane, Peradeniya",
    phone: "+94 81 000 0102",
    sessions: ["Tue 08:30–12:00 Antenatal"],
    lead: "Ramya Wickrama",
  },
  {
    id: "c3",
    name: "Kurunegala MOH Clinic",
    district: "Kurunegala",
    type: "MOH clinic",
    address: "77 Example St, Kurunegala",
    phone: "+94 37 000 0103",
    sessions: ["Thu 08:00–12:00 Antenatal & GDM"],
    lead: "Ramya Wickrama",
  },
  {
    id: "c4",
    name: "Galle MOH Clinic",
    district: "Galle",
    type: "MOH clinic",
    address: "9 Placeholder Rd, Galle",
    phone: "+94 91 000 0104",
    sessions: ["Fri 08:30–12:00 Antenatal"],
    lead: "Chamari Gunasekara",
  },
  {
    id: "c5",
    name: "Castle Street Hospital",
    district: "Colombo",
    type: "Hospital",
    address: "Demo Castle Street, Colombo 08",
    phone: "+94 11 000 0105",
    sessions: ["Daily scanning unit 08:00–16:00"],
    lead: "Dr. Asela Ranasinghe",
  },
];

export function clinicSummary(clinicName: string) {
  const ms = mothers.filter((m) => m.clinic === clinicName);
  const ids = new Set(ms.map((m) => m.id));
  return {
    mothers: ms.length,
    highRisk: ms.filter((m) => m.risk === "HIGH").length,
    upcoming: appointments.filter((a) => a.clinic === clinicName && a.status === "SCHEDULED")
      .length,
    missed: appointments.filter((a) => a.clinic === clinicName && a.status === "MISSED").length,
    patientIds: ids,
  };
}

export function riskBreakdown() {
  const active = pregnancies.filter((p) => p.status === "ACTIVE");
  return (["LOW", "MODERATE", "HIGH"] as const).map((r) => ({
    risk: r,
    count: active.filter((p) => p.risk === r).length,
  }));
}

export function attendanceRate() {
  const done = appointments.filter((a) => a.status === "COMPLETED").length;
  const missed = appointments.filter((a) => a.status === "MISSED").length;
  return done + missed === 0 ? 0 : Math.round((done / (done + missed)) * 100);
}
