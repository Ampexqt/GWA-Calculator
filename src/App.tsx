import { useMemo, useState, useEffect, useRef } from 'react';
import { Calculator, RotateCcw, Download, Plus, AlertTriangle } from 'lucide-react';

import { SemesterData, Settings, Subject } from './types';
import { DEFAULT_SETTINGS, INITIAL_SEMESTERS } from './constants';

import { Onboarding } from './components/Onboarding';
import { SemesterCard } from './components/SemesterCard';
import { CumulativeGwaCard } from './components/CumulativeGwaCard';

export function App() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

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
    const timer = setTimeout(() => {
      const dataToSave = {
        data: semesters,
        settings: settings,
        timestamp: new Date().getTime()
      };
      localStorage.setItem('gwa-calculator-data', JSON.stringify(dataToSave));
    }, 500);
    
    return () => clearTimeout(timer);
  }, [semesters, settings]);

  const lastActionTime = useRef<number>(0);
  const checkThrottle = (delay = 200) => {
    const now = Date.now();
    if (now - lastActionTime.current < delay) return false;
    lastActionTime.current = now;
    return true;
  };

  const addSemester = () => {
    if (!checkThrottle(300)) return;
    
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
    if (!checkThrottle()) return;
    setSemesters(semesters.filter(s => s.id !== semesterId));
  };

  const updateSemesterDetails = (semesterId: string, field: 'year' | 'semester', value: string) => {
    setSemesters(semesters.map(s => s.id === semesterId ? { ...s, [field]: value } : s));
  };

  const addSubject = (semesterId: string) => {
    if (!checkThrottle(150)) return;
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
    if (!checkThrottle(150)) return;
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
      <Onboarding
        settings={settings}
        setSettings={setSettings}
        semesters={semesters}
        setSemesters={setSemesters}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] font-sans selection:bg-[#CBD5E1] selection:text-[#0F172A]">
      <header className="sticky top-0 z-10 bg-[#FAFAFA]/80 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-[#111827] flex items-center justify-center text-white shadow-sm shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <h1 className="font-semibold text-[14px] sm:text-[15px] tracking-tight truncate">
              GWA Calculator
            </h1>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => setSettings({ ...settings, setupCompleted: false })}
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg transition-colors"
            >
              Settings
            </button>
            <button
              onClick={resetCalculator}
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button 
              onClick={() => showToast("Export feature is coming soon!")}
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 text-[13px] font-medium text-[#0F172A] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] shadow-sm rounded-lg transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">
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
                <SemesterCard
                  key={semesterData.id}
                  semesterData={semesterData}
                  settings={settings}
                  isDuplicateSemester={duplicateSemesters[`${semesterData.year} - ${semesterData.semester}`] > 1}
                  duplicateSubjects={duplicateSubjects}
                  semGwa={semGwa}
                  canRemove={semesters.length > 1}
                  updateSemesterDetails={updateSemesterDetails}
                  removeSemester={removeSemester}
                  addSubject={addSubject}
                  updateSubject={updateSubject}
                  removeSubject={removeSubject}
                />
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

          <CumulativeGwaCard
            gwa={gwa}
            totalUnits={totalUnits}
            totalSubjects={totalSubjects}
          />
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white px-4 py-2.5 rounded-[10px] text-[13px] font-medium shadow-lg z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {toast}
        </div>
      )}
    </div>
  );
}