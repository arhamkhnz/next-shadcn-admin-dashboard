type PatientStatus = "alarm" | "stable";

export type CardiacRhythm =
  | "atrial-fibrillation"
  | "low-voltage"
  | "occasional-pvc"
  | "paced"
  | "sinus"
  | "sinus-bradycardia"
  | "sinus-tachycardia"
  | "st-depression";

interface SignalProfile {
  amplitude: number;
  phase: number;
  rhythm: CardiacRhythm;
}

interface PatientEvent {
  label: string;
  time: string;
}

export interface PatientRecord {
  age: number;
  alarm?: string;
  alarmDuration?: string;
  arterialMap: number;
  arterialPressure: string;
  bed: string;
  diagnosis: string;
  heartRate: number;
  id: string;
  map: number;
  name: string;
  nibp: string;
  recentEvents: PatientEvent[];
  respirationRate: number;
  sex: "F" | "M";
  signalProfile: SignalProfile;
  spo2: number;
  status: PatientStatus;
  temperature: string;
}

export const patients = [
  {
    age: 53,
    arterialMap: 92,
    arterialPressure: "124/76",
    bed: "C01",
    diagnosis: "Pós-CABG",
    heartRate: 72,
    id: "cardiac-01",
    map: 91,
    name: "Ethan Brooks",
    nibp: "122/76",
    recentEvents: [
      { label: "NIBP 122/76", time: "01:24" },
      { label: "Derivação II selecionada", time: "00:51" },
    ],
    respirationRate: 16,
    sex: "M",
    signalProfile: {
      amplitude: 0.96,
      phase: 0.08,
      rhythm: "sinus",
    },
    spo2: 98,
    status: "stable",
    temperature: "36.8",
  },
  {
    age: 48,
    arterialMap: 87,
    arterialPressure: "116/72",
    bed: "C02",
    diagnosis: "Fibrilação atrial",
    heartRate: 68,
    id: "cardiac-02",
    map: 86,
    name: "Olivia Rhye",
    nibp: "118/70",
    recentEvents: [
      { label: "Tira de ritmo salva", time: "01:09" },
      { label: "NIBP 118/70", time: "00:43" },
    ],
    respirationRate: 17,
    sex: "F",
    signalProfile: {
      amplitude: 0.86,
      phase: 0.31,
      rhythm: "atrial-fibrillation",
    },
    spo2: 96,
    status: "stable",
    temperature: "37.0",
  },
  {
    age: 70,
    arterialMap: 96,
    arterialPressure: "132/78",
    bed: "C03",
    diagnosis: "Angina instável",
    heartRate: 76,
    id: "cardiac-03",
    map: 94,
    name: "Nico Arendt",
    nibp: "128/77",
    recentEvents: [
      { label: "ECG de 12 derivações concluído", time: "01:15" },
      { label: "NIBP 128/77", time: "00:47" },
    ],
    respirationRate: 18,
    sex: "M",
    signalProfile: {
      amplitude: 1.02,
      phase: 0.54,
      rhythm: "st-depression",
    },
    spo2: 97,
    status: "stable",
    temperature: "36.9",
  },
  {
    age: 61,
    alarm: "FC ALTA 104 > 100 bpm",
    alarmDuration: "06:12",
    arterialMap: 88,
    arterialPressure: "121/70",
    bed: "C04",
    diagnosis: "Pós-ICP",
    heartRate: 104,
    id: "cardiac-04",
    map: 89,
    name: "Koray Okumus",
    nibp: "118/74",
    recentEvents: [
      { label: "FC > 100", time: "01:26" },
      { label: "NIBP 118/74", time: "01:18" },
      { label: "Sensor de SpO₂ verificado", time: "00:48" },
    ],
    respirationRate: 20,
    sex: "M",
    signalProfile: {
      amplitude: 0.94,
      phase: 0.78,
      rhythm: "sinus-tachycardia",
    },
    spo2: 94,
    status: "alarm",
    temperature: "37.1",
  },
  {
    age: 45,
    arterialMap: 84,
    arterialPressure: "112/69",
    bed: "C05",
    diagnosis: "Pós-ablação",
    heartRate: 64,
    id: "cardiac-05",
    map: 83,
    name: "Candice Wu",
    nibp: "110/70",
    recentEvents: [
      { label: "NIBP 110/70", time: "01:02" },
      { label: "Estimulação desativada", time: "00:36" },
    ],
    respirationRate: 15,
    sex: "F",
    signalProfile: {
      amplitude: 0.9,
      phase: 0.17,
      rhythm: "sinus-bradycardia",
    },
    spo2: 96,
    status: "stable",
    temperature: "36.7",
  },
  {
    age: 66,
    arterialMap: 91,
    arterialPressure: "126/73",
    bed: "C06",
    diagnosis: "Síndrome coronariana aguda",
    heartRate: 80,
    id: "cardiac-06",
    map: 90,
    name: "Noah Pierre",
    nibp: "124/72",
    recentEvents: [
      { label: "Revisão de ST concluída", time: "01:11" },
      { label: "NIBP 124/72", time: "00:40" },
    ],
    respirationRate: 19,
    sex: "M",
    signalProfile: {
      amplitude: 1.06,
      phase: 0.4,
      rhythm: "occasional-pvc",
    },
    spo2: 95,
    status: "stable",
    temperature: "37.2",
  },
  {
    age: 57,
    arterialMap: 86,
    arterialPressure: "118/68",
    bed: "C07",
    diagnosis: "Insuficiência cardíaca",
    heartRate: 71,
    id: "cardiac-07",
    map: 85,
    name: "Lana Steiner",
    nibp: "116/68",
    recentEvents: [
      { label: "NIBP 116/68", time: "01:21" },
      { label: "Balanço hídrico atualizado", time: "00:57" },
    ],
    respirationRate: 17,
    sex: "F",
    signalProfile: {
      amplitude: 0.68,
      phase: 0.64,
      rhythm: "low-voltage",
    },
    spo2: 98,
    status: "stable",
    temperature: "36.8",
  },
  {
    age: 52,
    arterialMap: 90,
    arterialPressure: "123/71",
    bed: "C08",
    diagnosis: "Pós-angiografia",
    heartRate: 88,
    id: "cardiac-08",
    map: 88,
    name: "Steven Tey",
    nibp: "120/72",
    recentEvents: [
      { label: "Local de acesso verificado", time: "01:16" },
      { label: "NIBP 120/72", time: "00:49" },
    ],
    respirationRate: 18,
    sex: "M",
    signalProfile: {
      amplitude: 1.08,
      phase: 0.89,
      rhythm: "sinus",
    },
    spo2: 97,
    status: "stable",
    temperature: "37.0",
  },
  {
    age: 59,
    arterialMap: 89,
    arterialPressure: "120/72",
    bed: "C09",
    diagnosis: "Pós-implante de marca-passo",
    heartRate: 74,
    id: "cardiac-09",
    map: 88,
    name: "Mia Romberg",
    nibp: "119/71",
    recentEvents: [
      { label: "Captação da estimulação verificada", time: "01:19" },
      { label: "NIBP 119/71", time: "00:45" },
    ],
    respirationRate: 16,
    sex: "F",
    signalProfile: {
      amplitude: 0.92,
      phase: 0.25,
      rhythm: "paced",
    },
    spo2: 97,
    status: "stable",
    temperature: "36.9",
  },
  {
    age: 63,
    arterialMap: 93,
    arterialPressure: "128/75",
    bed: "C10",
    diagnosis: "Observação NSTEMI",
    heartRate: 82,
    id: "cardiac-10",
    map: 92,
    name: "Alec Whitten",
    nibp: "126/74",
    recentEvents: [
      { label: "Enzimas cardíacas revisadas", time: "01:13" },
      { label: "NIBP 126/74", time: "00:41" },
    ],
    respirationRate: 18,
    sex: "M",
    signalProfile: {
      amplitude: 0.98,
      phase: 0.71,
      rhythm: "st-depression",
    },
    spo2: 96,
    status: "stable",
    temperature: "37.1",
  },
] satisfies PatientRecord[];
