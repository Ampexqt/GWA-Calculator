import { Subject, SemesterData, Settings } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  { id: '1', name: 'Data Structures and Algorithms', units: 3, grade: 1.25 },
  { id: '2', name: 'Object-Oriented Programming', units: 3, grade: 1.5 },
  { id: '3', name: '', units: 3, grade: '' }
];

export const INITIAL_SEMESTERS: SemesterData[] = [
  {
    id: 'sem-1',
    year: '1st Year',
    semester: '1st Semester',
    subjects: INITIAL_SUBJECTS
  }
];

export const DEFAULT_SETTINGS: Settings = {
  systemType: 'semestral',
  includeSummer: true,
  setupCompleted: false
};
