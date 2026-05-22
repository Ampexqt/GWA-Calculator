import { BookOpen } from 'lucide-react';

interface CumulativeGwaCardProps {
  gwa: string;
  totalUnits: number;
  totalSubjects: number;
}

export function CumulativeGwaCard({ gwa, totalUnits, totalSubjects }: CumulativeGwaCardProps) {
  return (
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
  );
}
