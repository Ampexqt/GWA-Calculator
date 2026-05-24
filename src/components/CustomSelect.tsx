import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  isError?: boolean;
}

export function CustomSelect({ value, onChange, options, isError }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-1 sm:gap-2 bg-[#F8FAFC] border ${
          isError ? 'border-amber-400 focus:border-amber-500' : 'border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#94A3B8]'
        } rounded-md px-2 sm:px-3 py-1.5 text-[13px] sm:text-[14px] text-[#0F172A] outline-none transition-all cursor-pointer font-medium w-full`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-max min-w-full bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-150">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-[13px] sm:text-[14px] transition-colors ${
                value === opt ? 'bg-[#F1F5F9] text-[#0F172A] font-medium' : 'text-[#475569] hover:bg-[#F8FAFC]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
