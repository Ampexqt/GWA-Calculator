import { useState } from 'react';
import { Calculator, ArrowRight, ArrowLeft, CheckCircle2, Calendar, Sun, Sparkles, GraduationCap, Percent, Star, Snowflake, LayoutGrid } from 'lucide-react';
import { Settings, SemesterData } from '../types';

interface OnboardingProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  semesters: SemesterData[];
  setSemesters: (semesters: SemesterData[]) => void;
}

export function Onboarding({ settings, setSettings, semesters, setSemesters }: OnboardingProps) {
  const [step, setStep] = useState(1);

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
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] flex items-center justify-center p-6 text-[#0F172A] font-sans selection:bg-[#CBD5E1]">
      <div className="bg-white/90 backdrop-blur-xl rounded-[28px] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] border border-white p-8 md:p-12 max-w-2xl w-full relative overflow-hidden transition-all duration-500">
        
        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-[#E2E8F0]">
              <div 
                className={`h-full bg-[#0F172A] transition-all duration-500 ease-out ${step >= i ? 'w-full' : 'w-0'}`} 
              />
            </div>
          ))}
        </div>

        <div className="mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#334155] flex items-center justify-center text-white shadow-lg mb-6">
            {step === 1 && <Calendar className="w-7 h-7" />}
            {step === 2 && <GraduationCap className="w-7 h-7" />}
            {step === 3 && <Sun className="w-7 h-7" />}
          </div>
          
          <h1 className="text-[28px] font-bold tracking-tight mb-3">
            {step === 1 && "Term Structure"}
            {step === 2 && "Grading System"}
            {step === 3 && "Summer Terms"}
          </h1>
          <p className="text-[#64748B] text-[16px] leading-relaxed">
            {step === 1 && "How does your university divide the academic year?"}
            {step === 2 && "Which grading scale does your university follow?"}
            {step === 3 && "Should summer grades affect your overall average?"}
          </p>
        </div>
        
        <div className="min-h-[220px]">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <button
                onClick={() => setSettings({ ...settings, systemType: 'semestral' })}
                className={`group relative p-6 rounded-2xl text-left transition-all duration-300 border-2 overflow-hidden ${
                  settings.systemType === 'semestral' 
                    ? 'border-[#0F172A] bg-[#F8FAFC] shadow-md' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/60'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl transition-colors ${settings.systemType === 'semestral' ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] group-hover:text-[#0F172A]'}`}>
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  {settings.systemType === 'semestral' && <CheckCircle2 className="w-6 h-6 text-[#0F172A]" />}
                </div>
                <h3 className="font-semibold text-[17px] text-[#0F172A] mb-1">Semestral System</h3>
                <p className="text-[14px] text-[#64748B]">2 major semesters per academic year</p>
              </button>
              
              <button
                onClick={() => setSettings({ ...settings, systemType: 'trimester' })}
                className={`group relative p-6 rounded-2xl text-left transition-all duration-300 border-2 overflow-hidden ${
                  settings.systemType === 'trimester' 
                    ? 'border-[#0F172A] bg-[#F8FAFC] shadow-md' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/60'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl transition-colors ${settings.systemType === 'trimester' ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] group-hover:text-[#0F172A]'}`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  {settings.systemType === 'trimester' && <CheckCircle2 className="w-6 h-6 text-[#0F172A]" />}
                </div>
                <h3 className="font-semibold text-[17px] text-[#0F172A] mb-1">Trimester Option</h3>
                <p className="text-[14px] text-[#64748B]">3 equivalent terms per academic year</p>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <button
                onClick={() => setSettings({ ...settings, gradingSystem: '1.0-5.0' })}
                className={`group relative p-5 rounded-2xl text-left transition-all duration-300 border-2 overflow-hidden flex flex-col justify-between ${
                  settings.gradingSystem === '1.0-5.0' 
                    ? 'border-[#0F172A] bg-[#F8FAFC] shadow-md' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/60'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl transition-colors ${settings.gradingSystem === '1.0-5.0' ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] group-hover:text-[#0F172A]'}`}>
                    <Star className="w-5 h-5" />
                  </div>
                  {settings.gradingSystem === '1.0-5.0' && <CheckCircle2 className="w-5 h-5 text-[#0F172A]" />}
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] text-[#0F172A] mb-1">Uno to Singko</h3>
                  <p className="text-[13px] text-[#64748B] leading-tight">1.0 (Highest) to 5.0 (Fail) System</p>
                </div>
              </button>

              <button
                onClick={() => setSettings({ ...settings, gradingSystem: '4.0-GPA' })}
                className={`group relative p-5 rounded-2xl text-left transition-all duration-300 border-2 overflow-hidden flex flex-col justify-between ${
                  settings.gradingSystem === '4.0-GPA' 
                    ? 'border-[#0F172A] bg-[#F8FAFC] shadow-md' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/60'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl transition-colors ${settings.gradingSystem === '4.0-GPA' ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] group-hover:text-[#0F172A]'}`}>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  {settings.gradingSystem === '4.0-GPA' && <CheckCircle2 className="w-5 h-5 text-[#0F172A]" />}
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] text-[#0F172A] mb-1">4.0 GPA</h3>
                  <p className="text-[13px] text-[#64748B] leading-tight">4.0 (Highest) to 0.0 (Fail) System</p>
                </div>
              </button>

              <button
                onClick={() => setSettings({ ...settings, gradingSystem: 'percentage' })}
                className={`group relative p-5 rounded-2xl text-left transition-all duration-300 border-2 overflow-hidden flex flex-col justify-between ${
                  settings.gradingSystem === 'percentage' 
                    ? 'border-[#0F172A] bg-[#F8FAFC] shadow-md' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/60'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl transition-colors ${settings.gradingSystem === 'percentage' ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] group-hover:text-[#0F172A]'}`}>
                    <Percent className="w-5 h-5" />
                  </div>
                  {settings.gradingSystem === 'percentage' && <CheckCircle2 className="w-5 h-5 text-[#0F172A]" />}
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] text-[#0F172A] mb-1">Percentage</h3>
                  <p className="text-[13px] text-[#64748B] leading-tight">100% (Highest) Base System</p>
                </div>
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <button
                onClick={() => setSettings({ ...settings, includeSummer: true })}
                className={`group relative p-6 rounded-2xl text-left transition-all duration-300 border-2 overflow-hidden ${
                  settings.includeSummer 
                    ? 'border-[#0F172A] bg-[#F8FAFC] shadow-md' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/60'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl transition-colors ${settings.includeSummer ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] group-hover:text-[#0F172A]'}`}>
                    <Sun className="w-5 h-5" />
                  </div>
                  {settings.includeSummer && <CheckCircle2 className="w-6 h-6 text-[#0F172A]" />}
                </div>
                <h3 className="font-semibold text-[17px] text-[#0F172A] mb-1">Include Summer</h3>
                <p className="text-[14px] text-[#64748B]">Factor summer terms into calculation</p>
              </button>

              <button
                onClick={() => setSettings({ ...settings, includeSummer: false })}
                className={`group relative p-6 rounded-2xl text-left transition-all duration-300 border-2 overflow-hidden ${
                  !settings.includeSummer 
                    ? 'border-[#0F172A] bg-[#F8FAFC] shadow-md' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]/60'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl transition-colors ${!settings.includeSummer ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] group-hover:text-[#0F172A]'}`}>
                    <Snowflake className="w-5 h-5" />
                  </div>
                  {!settings.includeSummer && <CheckCircle2 className="w-6 h-6 text-[#0F172A]" />}
                </div>
                <h3 className="font-semibold text-[17px] text-[#0F172A] mb-1">Exclude Summer</h3>
                <p className="text-[14px] text-[#64748B]">Ignore summer term grades completely</p>
              </button>
            </div>
          )}
        </div>

        <div className="mt-12 pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
              step === 1 
                ? 'opacity-0 pointer-events-none' 
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <button
            onClick={handleNext}
            className="bg-[#0F172A] text-white rounded-xl py-3 px-8 font-medium flex items-center gap-2 hover:bg-[#1E293B] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            {step === 3 ? (
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
