import { AlertTriangle, Trash2, Plus } from 'lucide-react';
import { SemesterData, Settings, Subject } from '../types';
import { SubjectRow } from './SubjectRow';
import { CustomSelect } from './CustomSelect';

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
      <div className={`flex items-center justify-between p-3 sm:p-4 border-b bg-white ${isExcludedSummer ? 'border-amber-200' : 'border-[#E2E8F0]'}`}>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-4">
            <CustomSelect
              value={semesterData.year}
              onChange={(val) => updateSemesterDetails(semesterData.id, 'year', val)}
              options={['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year']}
              isError={isDuplicateSemester}
            />
            <span className="text-[#94A3B8]">—</span>
            <CustomSelect
              value={semesterData.semester}
              onChange={(val) => updateSemesterDetails(semesterData.id, 'semester', val)}
              options={settings.systemType === 'trimester' 
                ? ['1st Trimester', '2nd Trimester', '3rd Trimester', 'Summer']
                : ['1st Semester', '2nd Semester', 'Summer']}
              isError={isDuplicateSemester}
            />
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
      <div className="flex flex-col">
        <div className="hidden sm:flex items-center border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3.5">
          <div className="w-[50%] text-[12px] font-medium text-[#64748B] uppercase tracking-wider pr-5">
            Subject
          </div>
          <div className="flex w-[50%]">
            <div className="w-[40%] text-[12px] font-medium text-[#64748B] uppercase tracking-wider text-center px-2">
              Units
            </div>
            <div className="w-[40%] text-[12px] font-medium text-[#64748B] uppercase tracking-wider text-center px-2">
              Grade
            </div>
            <div className="w-[20%] text-[12px] font-medium text-[#64748B] uppercase tracking-wider text-center">
              Action
            </div>
          </div>
        </div>
        <div className="divide-y divide-[#E2E8F0]">
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
        </div>
      </div>
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 gap-3 sm:gap-0 border-t bg-[#FAFAFA] ${isExcludedSummer ? 'border-amber-200 bg-amber-50/50' : 'border-[#E2E8F0]'}`}>
        <button
          onClick={() => addSubject(semesterData.id)}
          className="flex items-center gap-2 text-[13px] font-medium text-[#0F172A] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] shadow-sm rounded-lg px-4 py-2 transition-all w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <span className="text-[12px] font-medium text-[#64748B] uppercase tracking-wider">Term GWA</span>
          <span className="text-[18px] font-light text-[#0F172A]">{semGwa === '0.0000' ? '- - -' : semGwa}</span>
        </div>
      </div>
    </div>
  );
}
