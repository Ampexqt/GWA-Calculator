import { Calculator, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import { Settings, SemesterData } from '../types';

interface OnboardingProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  semesters: SemesterData[];
  setSemesters: (semesters: SemesterData[]) => void;
}

export function Onboarding({ settings, setSettings, semesters, setSemesters }: OnboardingProps) {
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
