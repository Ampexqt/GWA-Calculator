import { useState } from 'react';
import { Calculator, ArrowRight, ArrowLeft, CheckCircle2, Calendar, Sun, Sparkles, GraduationCap, Percent, Star, Snowflake, LayoutGrid, ClipboardList } from 'lucide-react';
import { Settings, SemesterData } from '../types';

interface OnboardingProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  semesters: SemesterData[];
  setSemesters: (semesters: SemesterData[]) => void;
}

export function Onboarding({ settings, setSettings, semesters, setSemesters }: OnboardingProps) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setSettings({ ...settings, setupCompleted: true });
      if (settings.systemType === 'trimester') {
        setSemesters(semesters.map(sem => {
          if (sem.semester === '1st Semester') return { ...sem, semester: '1st Trimester' };
          return sem;
        }));
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] flex items-center justify-center p-4 sm:p-6 text-[#0F172A] font-sans selection:bg-[#CBD5E1]">
      <div className="bg-white/90 backdrop-blur-xl rounded-[24px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white p-6 sm:p-8 max-w-[500px] w-full relative overflow-hidden transition-all duration-300">
        
        {/* Progress Bar (Hide on Step 0) */}
        {step > 0 && (
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-[#E2E8F0]">
                <div 
                  className={`h-full bg-[#0F172A] transition-all duration-500 ease-out ${step >= i ? 'w-full' : 'w-0'}`} 
                />
              </div>
            ))}
          </div>
        )}

        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#334155] flex items-center justify-center text-white shadow-md mb-5">
            {step === 0 && <ClipboardList className="w-6 h-6" />}
            {step === 1 && <Calendar className="w-6 h-6" />}
            {step === 2 && <GraduationCap className="w-6 h-6" />}
            {step === 3 && <Sun className="w-6 h-6" />}
          </div>
          
          <h1 className="text-[22px] sm:text-[24px] font-bold tracking-tight mb-2">
            {step === 0 && "Let's personalize your setup!"}
            {step === 1 && "Term Structure"}
            {step === 2 && "Grading System"}
            {step === 3 && "Summer Terms"}
          </h1>
          <p className="text-[#64748B] text-[14px] sm:text-[15px] leading-relaxed">
            {step === 0 && "Before we crunch the numbers, we just need to ask 3 quick questions about how your university computes grades to give you the most accurate results."}
            {step === 1 && "How does your university divide the academic year?"}
            {step === 2 && "Which grading scale does your university follow?"}
            {step === 3 && "Should summer grades affect your overall average?"}
          </p>
        </div>
        
        <div className="min-h-[160px] sm:min-h-[180px]">
          {step === 0 && (
            <div className="flex flex-col items-center justify-center py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-32 h-32 bg-[#F1F5F9] rounded-full flex items-center justify-center mb-4">
                 <Calculator className="w-12 h-12 text-[#94A3B8]" />
              </div>
              <p className="text-[13px] text-[#94A3B8] font-medium uppercase tracking-wider">Takes less than 30 seconds</p>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
              <button
                onClick={() => setSettings({ ...settings, systemType: 'semestral' })}
                className={`group relative p-4 rounded-xl text-left transition-all duration-300 border-2 overflow-hidden ${
                  settings.systemType === 'semestral' 
                    ? 'border-[#0F172A] bg-[#F8FAFC] shadow-sm' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/60'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg transition-colors ${settings.systemType === 'semestral' ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] group-hover:text-[#0F172A]'}`}>
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  {settings.systemType === 'semestral' && <CheckCircle2 className="w-5 h-5 text-[#0F172A]" />}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-[15px] text-[#0F172A]">Semestral</h3>
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Most Common</span>
                </div>
                <p className="text-[12px] text-[#64748B]">2 terms per year</p>
              </button>
              
              <button
                onClick={() => setSettings({ ...settings, systemType: 'trimester' })}
                className={`group relative p-4 rounded-xl text-left transition-all duration-300 border-2 overflow-hidden ${
                  settings.systemType === 'trimester' 
                    ? 'border-[#0F172A] bg-[#F8FAFC] shadow-sm' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/60'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg transition-colors ${settings.systemType === 'trimester' ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] group-hover:text-[#0F172A]'}`}>
                    <Calendar className="w-4 h-4" />
                  </div>
                  {settings.systemType === 'trimester' && <CheckCircle2 className="w-5 h-5 text-[#0F172A]" />}
                </div>
                <h3 className="font-semibold text-[15px] text-[#0F172A] mb-1">Trimester</h3>
                <p className="text-[12px] text-[#64748B]">3 terms per year</p>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
              <button
                onClick={() => setSettings({ ...settings, gradingSystem: '1.0-5.0' })}
                className={`group relative p-4 rounded-xl text-left transition-all duration-300 border-2 overflow-hidden flex items-center gap-4 ${
                  settings.gradingSystem === '1.0-5.0' 
                    ? 'border-[#0F172A] bg-[#F8FAFC] shadow-sm' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/60'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 transition-colors ${settings.gradingSystem === '1.0-5.0' ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] group-hover:text-[#0F172A]'}`}>
                  <Star className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-[15px] text-[#0F172A]">Uno to Singko</h3>
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Most Common</span>
                  </div>
                  <p className="text-[12px] text-[#64748B]">1.0 (Highest) to 5.0 (Fail)</p>
                </div>
                {settings.gradingSystem === '1.0-5.0' && <CheckCircle2 className="w-5 h-5 text-[#0F172A]" />}
              </button>

              <button
                onClick={() => setSettings({ ...settings, gradingSystem: '4.0-GPA' })}
                className={`group relative p-4 rounded-xl text-left transition-all duration-300 border-2 overflow-hidden flex items-center gap-4 ${
                  settings.gradingSystem === '4.0-GPA' 
                    ? 'border-[#0F172A] bg-[#F8FAFC] shadow-sm' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/60'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 transition-colors ${settings.gradingSystem === '4.0-GPA' ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] group-hover:text-[#0F172A]'}`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[15px] text-[#0F172A]">4.0 GPA</h3>
                  <p className="text-[12px] text-[#64748B]">4.0 (Highest) to 0.0 (Fail)</p>
                </div>
                {settings.gradingSystem === '4.0-GPA' && <CheckCircle2 className="w-5 h-5 text-[#0F172A]" />}
              </button>

              <button
                onClick={() => setSettings({ ...settings, gradingSystem: 'percentage' })}
                className={`group relative p-4 rounded-xl text-left transition-all duration-300 border-2 overflow-hidden flex items-center gap-4 ${
                  settings.gradingSystem === 'percentage' 
                    ? 'border-[#0F172A] bg-[#F8FAFC] shadow-sm' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/60'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 transition-colors ${settings.gradingSystem === 'percentage' ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] group-hover:text-[#0F172A]'}`}>
                  <Percent className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[15px] text-[#0F172A]">Percentage</h3>
                  <p className="text-[12px] text-[#64748B]">100% Base System</p>
                </div>
                {settings.gradingSystem === 'percentage' && <CheckCircle2 className="w-5 h-5 text-[#0F172A]" />}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
              <button
                onClick={() => setSettings({ ...settings, includeSummer: true })}
                className={`group relative p-4 rounded-xl text-left transition-all duration-300 border-2 overflow-hidden ${
                  settings.includeSummer 
                    ? 'border-[#0F172A] bg-[#F8FAFC] shadow-sm' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/60'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg transition-colors ${settings.includeSummer ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] group-hover:text-[#0F172A]'}`}>
                    <Sun className="w-4 h-4" />
                  </div>
                  {settings.includeSummer && <CheckCircle2 className="w-5 h-5 text-[#0F172A]" />}
                </div>
                <h3 className="font-semibold text-[15px] text-[#0F172A] mb-1">Include</h3>
                <p className="text-[12px] text-[#64748B]">Factor summer terms</p>
              </button>

              <button
                onClick={() => setSettings({ ...settings, includeSummer: false })}
                className={`group relative p-4 rounded-xl text-left transition-all duration-300 border-2 overflow-hidden ${
                  !settings.includeSummer 
                    ? 'border-[#0F172A] bg-[#F8FAFC] shadow-sm' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/60'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg transition-colors ${!settings.includeSummer ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] group-hover:text-[#0F172A]'}`}>
                    <Snowflake className="w-4 h-4" />
                  </div>
                  {!settings.includeSummer && <CheckCircle2 className="w-5 h-5 text-[#0F172A]" />}
                </div>
                <h3 className="font-semibold text-[15px] text-[#0F172A] mb-1">Exclude</h3>
                <p className="text-[12px] text-[#64748B]">Ignore summer terms</p>
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
          <button
            onClick={handleBack}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-medium transition-all text-[14px] ${
              step === 0 
                ? 'opacity-0 pointer-events-none' 
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <button
            onClick={handleNext}
            className="bg-[#0F172A] text-white rounded-xl py-2.5 px-6 font-medium text-[14px] flex items-center gap-2 hover:bg-[#1E293B] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            {step === 0 ? (
              <>
                Let's start
                <ArrowRight className="w-4 h-4" />
              </>
            ) : step === 3 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Finish Setup
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
