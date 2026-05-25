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
  gradingSystem: '1.0-5.0' | '4.0-GPA' | 'percentage';
  includeSummer: boolean;
  setupCompleted: boolean;
}
