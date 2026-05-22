import { AlertTriangle, Trash2, Plus } from 'lucide-react';
import { SemesterData, Settings, Subject } from '../types';
import { SubjectRow } from './SubjectRow';

interface SemesterCardProps {
  semesterData: SemesterData;
  settings: Settings;
  isDuplicateSemester: boolean;
  duplicateSubjects: Record<string, number>;
  semGwa: string;
  canRemove: boolean;
  updateSemesterDetails: (semesterId: string, field: 'year' | 'semester', value: string) => void;
  removeSemester: (semesterId: string) => void;
  addSubject: (semesterId: string) => void;
  updateSubject: (semesterId: string, subjectId: string, field: keyof Subject, value: string | number) => void;
  removeSubject: (semesterId: string, subjectId: string) => void;
}

export function SemesterCard({
  semesterData,
  settings,
  isDuplicateSemester,
  duplicateSubjects,
  semGwa,
  canRemove,
  updateSemesterDetails,
  removeSemester,
  addSubject,
  updateSubject,
  removeSubject
}: SemesterCardProps) {
  const isExcludedSummer = !settings.includeSummer && semesterData.semester === 'Summer';

  return (
    <div className={`bg-[#FCFCFD] border rounded-[14px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] overflow-hidden ${isExcludedSummer ? 'border-amber-200' : 'border-[#E2E8F0]'}`}>
      <div className={`flex items-center justify-between p-4 border-b bg-white ${isExcludedSummer ? 'border-amber-200' : 'border-[#E2E8F0]'}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <select
              value={semesterData.year}
              onChange={(e) => updateSemesterDetails(semesterData.id, 'year', e.target.value)}
              className={`bg-[#F8FAFC] border ${isDuplicateSemester
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
              className={`bg-[#F8FAFC] border ${isDuplicateSemester
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
          {isDuplicateSemester && (
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-amber-500 bg-amber-50 px-2 py-1 rounded-md" title="Duplicate semester detected">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Duplicate</span>
            </div>
          )}
        </div>
        {canRemove && (
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
              <SubjectRow
                key={subject.id}
                subject={subject}
                semesterId={semesterData.id}
                semesterName={semesterData.semester}
                settings={settings}
                isDuplicate={duplicateSubjects[subject.name.trim().toLowerCase()] > 1}
                updateSubject={updateSubject}
                removeSubject={removeSubject}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className={`flex items-center justify-between p-4 border-t bg-[#FAFAFA] ${isExcludedSummer ? 'border-amber-200 bg-amber-50/50' : 'border-[#E2E8F0]'}`}>
        <button
          onClick={() => addSubject(semesterData.id)}
          className="flex items-center gap-2 text-[13px] font-medium text-[#0F172A] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] shadow-sm rounded-lg px-4 py-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Term GWA</span>
          <span className="text-[18px] font-light text-[#0F172A]">{semGwa === '0.0000' ? '- - -' : semGwa}</span>
        </div>
      </div>
    </div>
  );
}
