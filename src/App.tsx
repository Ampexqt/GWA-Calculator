import { useMemo, useState, useEffect } from 'react';
import {
  Calculator,
  RotateCcw,
  Download,
  Plus,
  Trash2,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Circle
} from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  units: number | '';
  grade: number | '';
}

interface SemesterData {
  id: string;
  year: string;
  semester: string;
  subjects: Subject[];
}

interface Settings {
  systemType: 'semestral' | 'trimester';
  includeSummer: boolean;
  setupCompleted: boolean;
}

const INITIAL_SUBJECTS: Subject[] = [
  { id: '1', name: 'Data Structures and Algorithms', units: 3, grade: 1.25 },
  { id: '2', name: 'Object-Oriented Programming', units: 3, grade: 1.5 },
  { id: '3', name: '', units: 3, grade: '' }
];

const INITIAL_SEMESTERS: SemesterData[] = [
  {
    id: 'sem-1',
    year: '1st Year',
    semester: '1st Semester',
    subjects: INITIAL_SUBJECTS
  }
];

const DEFAULT_SETTINGS: Settings = {
  systemType: 'semestral',
  includeSummer: true,
  setupCompleted: false
};

export function App() {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('gwa-calculator-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.settings) return parsed.settings;
      } catch (e) { }
    }
    return DEFAULT_SETTINGS;
  });

  const [semesters, setSemesters] = useState<SemesterData[]>(() => {
    const saved = localStorage.getItem('gwa-calculator-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const now = new Date().getTime();
        if (now - parsed.timestamp < 10800000) {
          // Migration from old flat structure
          if (parsed.data && !Array.isArray(parsed.data)) {
            if (parsed.data.subjects) {
              return [{
                id: crypto.randomUUID(),
                year: parsed.data.year || '1st Year',
                semester: parsed.data.semester || '1st Semester',
                subjects: parsed.data.subjects
              }];
            }
          }
          // New multiple-semester structure
          if (Array.isArray(parsed.data) && parsed.data.length > 0 && parsed.data[0].subjects) {
            return parsed.data;
          }
        } else {
          localStorage.removeItem('gwa-calculator-data');
        }
      } catch (e) {
        return INITIAL_SEMESTERS;
      }
    }
    return INITIAL_SEMESTERS;
  });

  useEffect(() => {
    const dataToSave = {
      data: semesters,
      settings: settings,
      timestamp: new Date().getTime()
    };
    localStorage.setItem('gwa-calculator-data', JSON.stringify(dataToSave));
  }, [semesters, settings]);

  const addSemester = () => {
    let nextYear = '1st Year';
    let nextSemester = settings.systemType === 'trimester' ? '1st Trimester' : '1st Semester';

    if (semesters.length > 0) {
      const lastSem = semesters[semesters.length - 1];
      nextYear = lastSem.year;

      if (settings.systemType === 'trimester') {
        if (lastSem.semester === '1st Trimester') {
          nextSemester = '2nd Trimester';
        } else if (lastSem.semester === '2nd Trimester') {
          nextSemester = '3rd Trimester';
        } else {
          nextSemester = '1st Trimester';
          const yearMatch = lastSem.year.match(/^(\d)/);
          if (yearMatch) {
            const nextYearNum = parseInt(yearMatch[1], 10) + 1;
            if (nextYearNum === 2) nextYear = '2nd Year';
            else if (nextYearNum === 3) nextYear = '3rd Year';
            else if (nextYearNum === 4) nextYear = '4th Year';
            else if (nextYearNum >= 5) nextYear = '5th Year';
          }
        }
      } else {
        if (lastSem.semester === '1st Semester') {
          nextSemester = '2nd Semester';
        } else {
          nextSemester = '1st Semester';
          const yearMatch = lastSem.year.match(/^(\d)/);
          if (yearMatch) {
            const nextYearNum = parseInt(yearMatch[1], 10) + 1;
            if (nextYearNum === 2) nextYear = '2nd Year';
            else if (nextYearNum === 3) nextYear = '3rd Year';
            else if (nextYearNum === 4) nextYear = '4th Year';
            else if (nextYearNum >= 5) nextYear = '5th Year';
          }
        }
      }
    }

    setSemesters([
      ...semesters,
      {
        id: crypto.randomUUID(),
        year: nextYear,
        semester: nextSemester,
        subjects: [{ id: crypto.randomUUID(), name: '', units: 3, grade: '' }]
      }
    ]);
  };

  const removeSemester = (semesterId: string) => {
    setSemesters(semesters.filter(s => s.id !== semesterId));
  };

  const updateSemesterDetails = (semesterId: string, field: 'year' | 'semester', value: string) => {
    setSemesters(semesters.map(s => s.id === semesterId ? { ...s, [field]: value } : s));
  };

  const addSubject = (semesterId: string) => {
    setSemesters(semesters.map(s => {
      if (s.id === semesterId) {
        return { ...s, subjects: [...s.subjects, { id: crypto.randomUUID(), name: '', units: 3, grade: '' }] };
      }
      return s;
    }));
  };

  const updateSubject = (semesterId: string, subjectId: string, field: keyof Subject, value: string | number) => {
    setSemesters(semesters.map(s => {
      if (s.id === semesterId) {
        return {
          ...s,
          subjects: s.subjects.map(sub => sub.id === subjectId ? { ...sub, [field]: value } : sub)
        };
      }
      return s;
    }));
  };

  const removeSubject = (semesterId: string, subjectId: string) => {
    setSemesters(semesters.map(s => {
      if (s.id === semesterId) {
        return { ...s, subjects: s.subjects.filter(sub => sub.id !== subjectId) };
      }
      return s;
    }));
  };

  const resetCalculator = () => {
    setSemesters([
      {
        id: crypto.randomUUID(),
        year: '1st Year',
        semester: settings.systemType === 'trimester' ? '1st Trimester' : '1st Semester',
        subjects: [{ id: crypto.randomUUID(), name: '', units: 3, grade: '' }]
      }
    ]);
  };

  const { gwa, totalUnits, totalSubjects } = useMemo(() => {
    let totalWeightedGrade = 0;
    let validUnits = 0;
    let validSubjectsCount = 0;

    semesters.forEach(sem => {
      if (!settings.includeSummer && sem.semester === 'Summer') return;

      sem.subjects.forEach((sub) => {
        const units = Number(sub.units);
        const grade = Number(sub.grade);
        if (!isNaN(units) && units > 0 && !isNaN(grade) && grade > 0) {
          totalWeightedGrade += units * grade;
          validUnits += units;
          validSubjectsCount += 1;
        }
      });
    });

    const computedGwa = validUnits > 0 ? totalWeightedGrade / validUnits : 0;
    return {
      gwa: computedGwa.toFixed(4),
      totalUnits: validUnits,
      totalSubjects: validSubjectsCount
    };
  }, [semesters, settings.includeSummer]);

  const duplicateSubjects = useMemo(() => {
    const counts: Record<string, number> = {};
    semesters.forEach(sem => {
      sem.subjects.forEach(sub => {
        const name = sub.name.trim().toLowerCase();
        if (name) {
          counts[name] = (counts[name] || 0) + 1;
        }
      });
    });
    return counts;
  }, [semesters]);

  const duplicateSemesters = useMemo(() => {
    const counts: Record<string, number> = {};
    semesters.forEach(sem => {
      const key = `${sem.year} - ${sem.semester}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [semesters]);

  if (!settings.setupCompleted) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 text-[#0F172A] font-sans">
        <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E2E8F0] p-8 md:p-10 max-w-xl w-full">
          <div className="w-12 h-12 rounded-xl bg-[#111827] flex items-center justify-center text-white shadow-md mb-6">
            <Calculator className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">Welcome to GWA Calculator</h1>
          <p className="text-[#64748B] mb-8 text-[15px]">Before we begin, let's set up your university's grading system template.</p>

          <div className="space-y-8">
            <div>
              <label className="block text-[14px] font-medium text-[#0F172A] mb-3">1. Which term system does your university use?</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => setSettings({ ...settings, systemType: 'semestral' })}
                  className={`flex items-center p-4 border rounded-xl text-left transition-all ${settings.systemType === 'semestral' ? 'border-[#0F172A] bg-[#F8FAFC] shadow-sm' : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/50'}`}
                >
                  <div className="flex-1">
                    <div className="font-medium text-[14px] text-[#0F172A]">Semestral System</div>
                    <div className="text-[13px] text-[#64748B] mt-0.5">2 semesters per year</div>
                  </div>
                  {settings.systemType === 'semestral' ? <CheckCircle2 className="w-5 h-5 text-[#0F172A]" /> : <Circle className="w-5 h-5 text-[#94A3B8]" />}
                </button>
                <button
                  onClick={() => setSettings({ ...settings, systemType: 'trimester' })}
                  className={`flex items-center p-4 border rounded-xl text-left transition-all ${settings.systemType === 'trimester' ? 'border-[#0F172A] bg-[#F8FAFC] shadow-sm' : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/50'}`}
                >
                  <div className="flex-1">
                    <div className="font-medium text-[14px] text-[#0F172A]">Trimester Option</div>
                    <div className="text-[13px] text-[#64748B] mt-0.5">3 terms per year</div>
                  </div>
                  {settings.systemType === 'trimester' ? <CheckCircle2 className="w-5 h-5 text-[#0F172A]" /> : <Circle className="w-5 h-5 text-[#94A3B8]" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#0F172A] mb-3">2. Should the Summer Term be included in your Cumulative GWA?</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => setSettings({ ...settings, includeSummer: true })}
                  className={`flex items-center p-4 border rounded-xl text-left transition-all ${settings.includeSummer ? 'border-[#0F172A] bg-[#F8FAFC] shadow-sm' : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/50'}`}
                >
                  <div className="flex-1">
                    <div className="font-medium text-[14px] text-[#0F172A]">Yes, include it</div>
                    <div className="text-[13px] text-[#64748B] mt-0.5">Factor summer grades</div>
                  </div>
                  {settings.includeSummer ? <CheckCircle2 className="w-5 h-5 text-[#0F172A]" /> : <Circle className="w-5 h-5 text-[#94A3B8]" />}
                </button>
                <button
                  onClick={() => setSettings({ ...settings, includeSummer: false })}
                  className={`flex items-center p-4 border rounded-xl text-left transition-all ${!settings.includeSummer ? 'border-[#0F172A] bg-[#F8FAFC] shadow-sm' : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/50'}`}
                >
                  <div className="flex-1">
                    <div className="font-medium text-[14px] text-[#0F172A]">No, exclude it</div>
                    <div className="text-[13px] text-[#64748B] mt-0.5">Ignore summer grades</div>
                  </div>
                  {!settings.includeSummer ? <CheckCircle2 className="w-5 h-5 text-[#0F172A]" /> : <Circle className="w-5 h-5 text-[#94A3B8]" />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setSettings({ ...settings, setupCompleted: true });
              // Ensure default semester name matches template if it's the first time
              if (settings.systemType === 'trimester') {
                setSemesters(semesters.map(sem => {
                  if (sem.semester === '1st Semester') return { ...sem, semester: '1st Trimester' };
                  return sem;
                }));
              }
            }}
            className="w-full mt-10 bg-[#0F172A] text-white rounded-xl py-3.5 px-4 font-medium flex items-center justify-center gap-2 hover:bg-[#1E293B] transition-colors shadow-sm"
          >
            Start Calculating
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] font-sans selection:bg-[#CBD5E1] selection:text-[#0F172A]">
      <header className="sticky top-0 z-10 bg-[#FAFAFA]/80 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-[#111827] flex items-center justify-center text-white shadow-sm">
              <Calculator className="w-4 h-4" />
            </div>
            <h1 className="font-semibold text-[15px] tracking-tight">
              GWA Calculator
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSettings({ ...settings, setupCompleted: false })}
              className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg transition-colors"
            >
              Settings
            </button>
            <button
              onClick={resetCalculator}
              className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-[#0F172A] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] shadow-sm rounded-lg transition-all">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        {!settings.includeSummer && semesters.some(s => s.semester === 'Summer') && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-[14px] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[14px] text-amber-800">
              <strong>Note:</strong> You have selected to exclude Summer Term grades from your Cumulative GWA. Summer units and grades are shown below but are not factored into the total calculation.
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          <div className="flex-1 w-full flex flex-col gap-6">
            {semesters.map((semesterData) => {
              let semWeightedGrade = 0;
              let semValidUnits = 0;
              semesterData.subjects.forEach(sub => {
                const units = Number(sub.units);
                const grade = Number(sub.grade);
                if (!isNaN(units) && units > 0 && !isNaN(grade) && grade > 0) {
                  semWeightedGrade += units * grade;
                  semValidUnits += units;
                }
              });
              const semGwa = semValidUnits > 0 ? (semWeightedGrade / semValidUnits).toFixed(4) : '0.0000';

              return (
                <div key={semesterData.id} className={`bg-[#FCFCFD] border rounded-[14px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] overflow-hidden ${!settings.includeSummer && semesterData.semester === 'Summer' ? 'border-amber-200' : 'border-[#E2E8F0]'}`}>
                  <div className={`flex items-center justify-between p-4 border-b bg-white ${!settings.includeSummer && semesterData.semester === 'Summer' ? 'border-amber-200' : 'border-[#E2E8F0]'}`}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-4">
                        <select
                          value={semesterData.year}
                          onChange={(e) => updateSemesterDetails(semesterData.id, 'year', e.target.value)}
                          className={`bg-[#F8FAFC] border ${duplicateSemesters[`${semesterData.year} - ${semesterData.semester}`] > 1
                            ? 'border-amber-400 focus:border-amber-500'
                            : 'border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#94A3B8]'
                            } rounded-md px-3 py-1.5 text-[14px] text-[#0F172A] outline-none transition-all cursor-pointer font-medium`}
                        >
                          <option>1st Year</option>
                          <option>2nd Year</option>
                          <option>3rd Year</option>
                          <option>4th Year</option>
                          <option>5th Year</option>
                        </select>
                        <span className="text-[#94A3B8]">—</span>
                        <select
                          value={semesterData.semester}
                          onChange={(e) => updateSemesterDetails(semesterData.id, 'semester', e.target.value)}
                          className={`bg-[#F8FAFC] border ${duplicateSemesters[`${semesterData.year} - ${semesterData.semester}`] > 1
                            ? 'border-amber-400 focus:border-amber-500'
                            : 'border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#94A3B8]'
                            } rounded-md px-3 py-1.5 text-[14px] text-[#0F172A] outline-none transition-all cursor-pointer font-medium`}
                        >
                          {settings.systemType === 'trimester' ? (
                            <>
                              <option>1st Trimester</option>
                              <option>2nd Trimester</option>
                              <option>3rd Trimester</option>
                              <option>Summer</option>
                            </>
                          ) : (
                            <>
                              <option>1st Semester</option>
                              <option>2nd Semester</option>
                              <option>Summer</option>
                            </>
                          )}
                        </select>
                      </div>
                      {duplicateSemesters[`${semesterData.year} - ${semesterData.semester}`] > 1 && (
                        <div className="flex items-center gap-1.5 text-[13px] font-medium text-amber-500 bg-amber-50 px-2 py-1 rounded-md" title="Duplicate semester detected">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="hidden sm:inline">Duplicate</span>
                        </div>
                      )}
                    </div>
                    {semesters.length > 1 && (
                      <button
                        onClick={() => removeSemester(semesterData.id)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-md transition-colors"
                        title="Remove Semester"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                          <th className="px-5 py-3.5 text-[12px] font-medium text-[#64748B] uppercase tracking-wider w-[50%]">
                            Subject
                          </th>
                          <th className="px-5 py-3.5 text-[12px] font-medium text-[#64748B] uppercase tracking-wider w-[20%]">
                            Units
                          </th>
                          <th className="px-5 py-3.5 text-[12px] font-medium text-[#64748B] uppercase tracking-wider w-[20%]">
                            Grade
                          </th>
                          <th className="px-5 py-3.5 text-[12px] font-medium text-[#64748B] uppercase tracking-wider w-[10%] text-center">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        {semesterData.subjects.map((subject) => (
                          <tr
                            key={subject.id}
                            className={`group hover:bg-[#F8FAFC]/50 transition-colors ${!settings.includeSummer && semesterData.semester === 'Summer' ? 'opacity-60 grayscale-[50%]' : ''}`}
                          >
                            <td className="px-5 py-3">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={subject.name}
                                  maxLength={100}
                                  onChange={(e) => {
                                    if (e.target.value.length <= 100) {
                                      updateSubject(semesterData.id, subject.id, 'name', e.target.value);
                                    }
                                  }}
                                  placeholder="e.g. The Contemporary World"
                                  className={`w-full bg-white border ${duplicateSubjects[subject.name.trim().toLowerCase()] > 1
                                    ? 'border-amber-400 focus:border-amber-500 pr-10'
                                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#94A3B8]'
                                    } rounded-md px-3 py-2 text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all shadow-sm`}
                                />
                                {duplicateSubjects[subject.name.trim().toLowerCase()] > 1 && (
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500" title="Duplicate subject detected">
                                    <AlertTriangle className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-3">
                              <input
                                type="number"
                                value={subject.units}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === '' || (Number(val) >= 0 && Number(val) <= 20)) {
                                    updateSubject(semesterData.id, subject.id, 'units', val);
                                  }
                                }}
                                placeholder="0"
                                min="0"
                                step="0.5"
                                className="w-full bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#94A3B8] rounded-md px-3 py-2 text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all shadow-sm"
                              />
                            </td>
                            <td className="px-5 py-3">
                              <input
                                type="number"
                                value={subject.grade}
                                onChange={(e) => {
                                  let val = e.target.value.replace(',', '.');
                                  val = val.replace(/[^\d.]/g, '');
                                  const parts = val.split('.');
                                  if (parts.length > 2) return;
                                  const digits = val.replace('.', '');
                                  if (digits.length > 3) return;
                                  if (!val.includes('.') && val.length >= 2) {
                                    val = val.substring(0, 1) + '.' + val.substring(1);
                                  }
                                  if (val !== '' && val !== '.') {
                                    if (Number(val) > 5) return;
                                  }
                                  updateSubject(semesterData.id, subject.id, 'grade', val);
                                }}
                                placeholder="0.00"
                                min="1.0"
                                max="5.0"
                                step="0.25"
                                className="w-full bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#94A3B8] rounded-md px-3 py-2 text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all shadow-sm"
                              />
                            </td>
                            <td className="px-5 py-3 text-center">
                              <button
                                onClick={() => removeSubject(semesterData.id, subject.id)}
                                className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#E2E8F0] rounded-md transition-colors mx-auto block"
                                aria-label="Remove subject"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className={`flex items-center justify-between p-4 border-t bg-[#FAFAFA] ${!settings.includeSummer && semesterData.semester === 'Summer' ? 'border-amber-200 bg-amber-50/50' : 'border-[#E2E8F0]'}`}>
                    <button
                      onClick={() => addSubject(semesterData.id)}
                      className="flex items-center gap-2 text-[13px] font-medium text-[#0F172A] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] shadow-sm rounded-lg px-4 py-2 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Subject
                    </button>
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Term GWA</span>
                      <span className="text-[18px] font-light text-[#0F172A]">{semGwa === '0.0000' ? '---' : semGwa}</span>
                    </div>
                  </div>
                </div>
              )
            })}

            <button
              onClick={addSemester}
              className="mt-2 flex items-center justify-center gap-2 w-full py-4 text-[14px] font-medium text-[#64748B] bg-transparent border-2 border-dashed border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A] rounded-[14px] transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Another Term
            </button>
          </div>

          <div className="w-full lg:w-[340px] shrink-0 lg:sticky lg:top-24">
            <div className="bg-[#FCFCFD] border border-[#E2E8F0] rounded-[14px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-6">
                <BookOpen className="w-5 h-5 text-[#0F172A]" />
              </div>
              <h2 className="text-[13px] font-medium text-[#64748B] uppercase tracking-wider mb-2">
                Cumulative GWA
              </h2>
              <div className="text-[64px] font-light tracking-tighter text-[#0F172A] leading-none mb-8">
                {gwa === '0.0000' ? '- - -' : gwa}
              </div>

              <div className="w-full h-px bg-[#E2E8F0] mb-8"></div>

              <div className="w-full flex justify-between items-center mb-4">
                <span className="text-[14px] text-[#64748B]">Valid Units</span>
                <span className="text-[15px] font-medium text-[#0F172A]">
                  {totalUnits}
                </span>
              </div>
              <div className="w-full flex justify-between items-center">
                <span className="text-[14px] text-[#64748B]">Counted Subjects</span>
                <span className="text-[15px] font-medium text-[#0F172A]">
                  {totalSubjects}
                </span>
              </div>
            </div>
            <p className="text-center text-[12px] text-[#64748B] mt-6">
              Calculated automatically across all active terms.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}