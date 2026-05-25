import { AlertTriangle, Trash2 } from 'lucide-react';
import { Subject, Settings } from '../types';

interface SubjectRowProps {
  subject: Subject;
  semesterId: string;
  semesterName: string;
  settings: Settings;
  isDuplicate: boolean;
  updateSubject: (semesterId: string, subjectId: string, field: keyof Subject, value: string | number) => void;
  removeSubject: (semesterId: string, subjectId: string) => void;
}

export function SubjectRow({ subject, semesterId, semesterName, settings, isDuplicate, updateSubject, removeSubject }: SubjectRowProps) {
  const isExcludedSummer = !settings.includeSummer && semesterName === 'Summer';

  return (
    <div className={`group flex flex-col sm:flex-row sm:items-center px-4 py-4 sm:px-5 sm:py-3 gap-3 sm:gap-0 hover:bg-[#F8FAFC]/50 transition-colors ${isExcludedSummer ? 'opacity-60 grayscale-[50%]' : ''}`}>
      <div className="w-full sm:w-[50%] sm:pr-5">
        <div className="relative">
          <input
            type="text"
            value={subject.name}
            maxLength={100}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
                updateSubject(semesterId, subject.id, 'name', e.target.value);
              }
            }}
            placeholder="e.g. The Contemporary World"
            className={`w-full bg-white border ${isDuplicate
              ? 'border-amber-400 focus:border-amber-500 pr-10'
              : 'border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#94A3B8]'
              } rounded-md px-3 py-2 text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all shadow-sm`}
          />
          {isDuplicate && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500" title="Duplicate subject detected">
              <AlertTriangle className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-start sm:items-center gap-3 w-full sm:w-[50%]">
        <div className="flex-1 min-w-0 sm:w-[40%] sm:flex-none sm:px-2">
          <label className="sm:hidden text-[11px] font-medium text-[#64748B] uppercase mb-1.5 block truncate">Units</label>
          <input
            type="number"
            value={subject.units}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || (Number(val) >= 0 && Number(val) <= 20)) {
                updateSubject(semesterId, subject.id, 'units', val);
              }
            }}
            placeholder="0"
            min="0"
            step="0.5"
            className="w-full min-w-0 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#94A3B8] rounded-md px-3 py-2 text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all shadow-sm sm:text-center"
          />
        </div>
        <div className="flex-1 min-w-0 sm:w-[40%] sm:flex-none sm:px-2">
          <label className="sm:hidden text-[11px] font-medium text-[#64748B] uppercase mb-1.5 block truncate">Grade</label>
          <input
            type="number"
            value={subject.grade}
            onChange={(e) => {
              let val = e.target.value.replace(',', '.');
              val = val.replace(/[^\d.]/g, '');
              const parts = val.split('.');
              if (parts.length > 2) return;
              
              if (settings.gradingSystem === 'percentage') {
                if (val !== '' && val !== '.') {
                  if (Number(val) > 100) return;
                }
                if (val.includes('.') && parts[1].length > 2) return;
              } else {
                const digits = val.replace('.', '');
                if (digits.length > 3) return;
                if (!val.includes('.') && val.length >= 2) {
                  val = val.substring(0, 1) + '.' + val.substring(1);
                }
                if (val !== '' && val !== '.') {
                  if (settings.gradingSystem === '4.0-GPA' && Number(val) > 4) return;
                  if (settings.gradingSystem === '1.0-5.0' && Number(val) > 5) return;
                }
              }
              updateSubject(semesterId, subject.id, 'grade', val);
            }}
            placeholder={settings.gradingSystem === 'percentage' ? "95" : (settings.gradingSystem === '4.0-GPA' ? "4.00" : "1.00")}
            min={settings.gradingSystem === 'percentage' ? "0" : (settings.gradingSystem === '4.0-GPA' ? "0.0" : "1.0")}
            max={settings.gradingSystem === 'percentage' ? "100" : (settings.gradingSystem === '4.0-GPA' ? "4.0" : "5.0")}
            step={settings.gradingSystem === 'percentage' ? "1" : "0.25"}
            className="w-full min-w-0 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#94A3B8] rounded-md px-3 py-2 text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all shadow-sm sm:text-center"
          />
        </div>
        <div className="w-auto sm:w-[20%] sm:flex-none flex justify-center pt-[22px] sm:pt-0 shrink-0">
          <button
            onClick={() => removeSubject(semesterId, subject.id)}
            className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#E2E8F0] rounded-md transition-colors mx-auto block"
            aria-label="Remove subject"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
