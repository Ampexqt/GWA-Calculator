import { X, FileSpreadsheet, Download } from 'lucide-react';
import { SemesterData, Settings } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  semesters: SemesterData[];
  settings: Settings;
  showToast?: (message: string) => void;
}

export function ExportModal({ isOpen, onClose, semesters, settings, showToast }: ExportModalProps) {
  if (!isOpen) return null;

  const handleExportCSV = () => {
    let csvContent = "Year,Term,Subject Name,Units,Grade,Weighted Score\n";
    
    semesters.forEach(sem => {
      if (!settings.includeSummer && sem.semester === 'Summer') return;
      
      sem.subjects.forEach(sub => {
        const units = Number(sub.units);
        const grade = Number(sub.grade);
        let weighted = "";
        if (!isNaN(units) && !isNaN(grade) && units > 0 && grade > 0) {
          weighted = (units * grade).toFixed(4);
        }
        
        // Escape quotes and commas
        const safeName = sub.name.replace(/"/g, '""');
        
        const row = [
          `"${sem.year}"`,
          `"${sem.semester}"`,
          `"${safeName || 'Unnamed Subject'}"`,
          `"${sub.units}"`,
          `"${sub.grade}"`,
          `"${weighted}"`
        ].join(",");
        csvContent += row + "\n";
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "GWA_Export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    onClose();
    if (showToast) {
      showToast("Spreadsheet exported successfully!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[400px] overflow-hidden border border-[#E2E8F0] animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-[#E2E8F0]">
          <h2 className="text-[18px] font-bold text-[#0F172A]">Export Data</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#F1F5F9] rounded-full text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-[14px] text-[#64748B] mb-6">
            Download your academic records as a CSV spreadsheet. You can open this file in Excel, Google Sheets, or Apple Numbers.
          </p>
          
          <button 
            onClick={handleExportCSV}
            className="w-full group relative p-4 rounded-xl text-left transition-all duration-300 border-2 border-[#0F172A] bg-white shadow-sm hover:bg-[#0F172A] hover:text-white overflow-hidden flex items-center gap-4"
          >
            <div className="p-2 rounded-lg shrink-0 bg-[#0F172A] text-white group-hover:bg-white group-hover:text-[#0F172A] transition-colors">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[15px] text-[#0F172A] group-hover:text-white transition-colors">Spreadsheet (CSV)</h3>
              <p className="text-[12px] text-[#64748B] group-hover:text-[#CBD5E1] transition-colors">Clean rows and columns</p>
            </div>
            <Download className="w-5 h-5 text-[#0F172A] group-hover:text-white transition-colors" />
          </button>
        </div>
        
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] text-center">
          <p className="text-[12px] text-[#94A3B8]">More export formats coming soon</p>
        </div>
      </div>
    </div>
  );
}
