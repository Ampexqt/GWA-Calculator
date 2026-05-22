import { useMemo, useState, useEffect } from 'react';
import {
  Calculator,
  RotateCcw,
  Download,
  Plus,
  Trash2,
  BookOpen } from
'lucide-react';
interface Subject {
  id: string;
  name: string;
  units: number | '';
  grade: number | '';
}
const INITIAL_SUBJECTS: Subject[] = [
{
  id: '1',
  name: 'Data Structures and Algorithms',
  units: 3,
  grade: 1.25
},
{
  id: '2',
  name: 'Object-Oriented Programming',
  units: 3,
  grade: 1.5
},
{
  id: '3',
  name: 'Calculus 2',
  units: 4,
  grade: 2.0
},
{
  id: '4',
  name: 'Physics for Engineers',
  units: 4,
  grade: 1.75
},
{
  id: '5',
  name: 'Readings in Philippine History',
  units: 3,
  grade: 1.0
}];

export function App() {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('gwa-calculator-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const now = new Date().getTime();
        // Check if the data is less than 3 hours old (3 * 60 * 60 * 1000 ms = 10800000 ms)
        if (now - parsed.timestamp < 10800000) {
          return parsed.data;
        } else {
          localStorage.removeItem('gwa-calculator-data');
        }
      } catch (e) {
        return INITIAL_SUBJECTS;
      }
    }
    return INITIAL_SUBJECTS;
  });

  useEffect(() => {
    const dataToSave = {
      data: subjects,
      timestamp: new Date().getTime()
    };
    localStorage.setItem('gwa-calculator-data', JSON.stringify(dataToSave));
  }, [subjects]);
  const addSubject = () => {
    setSubjects([
    ...subjects,
    {
      id: crypto.randomUUID(),
      name: '',
      units: 3,
      grade: ''
    }]
    );
  };
  const updateSubject = (
  id: string,
  field: keyof Subject,
  value: string | number) =>
  {
    setSubjects(
      subjects.map((sub) =>
      sub.id === id ?
      {
        ...sub,
        [field]: value
      } :
      sub
      )
    );
  };
  const removeSubject = (id: string) => {
    setSubjects(subjects.filter((sub) => sub.id !== id));
  };
  const resetCalculator = () => {
    setSubjects([
    {
      id: crypto.randomUUID(),
      name: '',
      units: 3,
      grade: ''
    }]
    );
  };
  const { gwa, totalUnits, totalSubjects } = useMemo(() => {
    let totalWeightedGrade = 0;
    let validUnits = 0;
    let validSubjectsCount = 0;
    subjects.forEach((sub) => {
      const units = Number(sub.units);
      const grade = Number(sub.grade);
      if (!isNaN(units) && units > 0 && !isNaN(grade) && grade > 0) {
        totalWeightedGrade += units * grade;
        validUnits += units;
        validSubjectsCount += 1;
      }
    });
    const computedGwa = validUnits > 0 ? totalWeightedGrade / validUnits : 0;
    return {
      gwa: computedGwa.toFixed(4),
      totalUnits: validUnits,
      totalSubjects: validSubjectsCount
    };
  }, [subjects]);
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] font-sans selection:bg-[#CBD5E1] selection:text-[#0F172A]">
      {/* Header */}
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
              onClick={resetCalculator}
              className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg transition-colors">
              
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left Panel: Spreadsheet */}
          <div className="flex-1 w-full">
            <div className="bg-[#FCFCFD] border border-[#E2E8F0] rounded-[14px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] overflow-hidden">
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
                    {subjects.map((subject) =>
                    <tr
                      key={subject.id}
                      className="group hover:bg-[#F8FAFC]/50 transition-colors">
                      
                        <td className="px-5 py-3">
                          <input
                          type="text"
                          value={subject.name}
                          maxLength={100}
                          onChange={(e) => {
                            if (e.target.value.length <= 100) {
                              updateSubject(subject.id, 'name', e.target.value);
                            }
                          }}
                          placeholder="e.g. The Contemporary World"
                          className="w-full bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#94A3B8] rounded-md px-3 py-2 text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all shadow-sm" />
                        
                        </td>
                        <td className="px-5 py-3">
                          <input
                          type="number"
                          value={subject.units}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || (Number(val) >= 0 && Number(val) <= 20)) {
                              updateSubject(subject.id, 'units', val);
                            }
                          }}
                          placeholder="0"
                          min="0"
                          step="0.5"
                          className="w-full bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#94A3B8] rounded-md px-3 py-2 text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all shadow-sm" />
                        
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
                            updateSubject(subject.id, 'grade', val);
                          }}
                          placeholder="0.00"
                          min="1.0"
                          max="5.0"
                          step="0.25"
                          className="w-full bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#94A3B8] rounded-md px-3 py-2 text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all shadow-sm" />
                        
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button
                          onClick={() => removeSubject(subject.id)}
                          className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#E2E8F0] rounded-md transition-colors mx-auto block"
                          aria-label="Remove subject">
                          
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-[#E2E8F0] bg-[#FAFAFA]">
                <button
                  onClick={addSubject}
                  className="flex items-center gap-2 text-[13px] font-medium text-[#0F172A] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] shadow-sm rounded-lg px-4 py-2 transition-all">
                  
                  <Plus className="w-4 h-4" />
                  Add Subject
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Sticky Preview */}
          <div className="w-full lg:w-[340px] shrink-0 lg:sticky lg:top-24">
            <div className="bg-[#FCFCFD] border border-[#E2E8F0] rounded-[14px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-6">
                <BookOpen className="w-5 h-5 text-[#0F172A]" />
              </div>
              <h2 className="text-[13px] font-medium text-[#64748B] uppercase tracking-wider mb-2">
                Current GWA
              </h2>
              <div className="text-[64px] font-light tracking-tighter text-[#0F172A] leading-none mb-8">
                {gwa === '0.0000' ? '—' : gwa}
              </div>

              <div className="w-full h-px bg-[#E2E8F0] mb-8"></div>

              <div className="w-full flex justify-between items-center mb-4">
                <span className="text-[14px] text-[#64748B]">Total Units</span>
                <span className="text-[15px] font-medium text-[#0F172A]">
                  {totalUnits}
                </span>
              </div>
              <div className="w-full flex justify-between items-center">
                <span className="text-[14px] text-[#64748B]">Subjects</span>
                <span className="text-[15px] font-medium text-[#0F172A]">
                  {totalSubjects}
                </span>
              </div>
            </div>
            <p className="text-center text-[12px] text-[#64748B] mt-6">
              Calculated automatically as you type.
            </p>
          </div>
        </div>
      </main>
    </div>);

}