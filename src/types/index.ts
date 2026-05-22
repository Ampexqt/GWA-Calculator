export interface Subject {
  id: string;
  name: string;
  units: number | '';
  grade: number | '';
}

export interface SemesterData {
  id: string;
  year: string;
  semester: string;
  subjects: Subject[];
}

export interface Settings {
  systemType: 'semestral' | 'trimester';
  includeSummer: boolean;
  setupCompleted: boolean;
}
