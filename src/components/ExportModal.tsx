import { X, FileSpreadsheet, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); // #0F172A
    doc.text("GWA Calculator - Academic Record", 14, 22);

    // Global Info
    let cumulativeWeighted = 0;
    let cumulativeUnits = 0;

    semesters.forEach(sem => {
      if (!settings.includeSummer && sem.semester === 'Summer') return;
      sem.subjects.forEach(sub => {
        const units = Number(sub.units);
        const grade = Number(sub.grade);
        if (!isNaN(units) && !isNaN(grade) && units > 0 && grade > 0) {
          cumulativeWeighted += units * grade;
          cumulativeUnits += units;
        }
      });
    });

    const finalGwa = cumulativeUnits > 0 ? (cumulativeWeighted / cumulativeUnits).toFixed(4) : "0.0000";

    const gwaVal = parseFloat(finalGwa);
    let latinHonor = "";

    if (settings.gradingSystem === '1.0-5.0') {
      if (gwaVal >= 1.0 && gwaVal <= 1.20) latinHonor = "Summa Cum Laude";
      else if (gwaVal > 1.20 && gwaVal <= 1.45) latinHonor = "Magna Cum Laude";
      else if (gwaVal > 1.45 && gwaVal <= 1.75) latinHonor = "Cum Laude";
    } else if (settings.gradingSystem === '4.0') {
      if (gwaVal >= 3.80 && gwaVal <= 4.00) latinHonor = "Summa Cum Laude";
      else if (gwaVal >= 3.60 && gwaVal < 3.80) latinHonor = "Magna Cum Laude";
      else if (gwaVal >= 3.40 && gwaVal < 3.60) latinHonor = "Cum Laude";
    } else if (settings.gradingSystem === 'percentage') {
      if (gwaVal >= 98 && gwaVal <= 100) latinHonor = "Summa Cum Laude";
      else if (gwaVal >= 95 && gwaVal < 98) latinHonor = "Magna Cum Laude";
      else if (gwaVal >= 90 && gwaVal < 95) latinHonor = "Cum Laude";
    }

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // #64748B
    doc.text(`Grading System: ${settings.gradingSystem}`, 14, 32);
    doc.text(`Total Valid Units: ${cumulativeUnits}`, 14, 38);
    doc.setTextColor(15, 23, 42); // #0F172A
    doc.setFont("helvetica", 'bold');
    doc.text(`Cumulative GWA: ${finalGwa}`, 14, 44);

    let nextY = 50;
    if (latinHonor && cumulativeUnits > 0) {
      doc.setFont("helvetica", 'bold');
      doc.text(`Academic Standing: Candidate for ${latinHonor}`, 14, nextY);
      nextY += 8;
    }

    doc.setFont("helvetica", 'normal');

    let currentY = nextY + 4;

    // Generate summary data
    const summaryData: any[] = [];
    semesters.forEach(sem => {
      if (!settings.includeSummer && sem.semester === 'Summer') return;
      let semWeighted = 0;
      let semUnits = 0;
      sem.subjects.forEach(sub => {
        const units = Number(sub.units);
        const grade = Number(sub.grade);
        if (!isNaN(units) && !isNaN(grade) && units > 0 && grade > 0) {
          semWeighted += units * grade;
          semUnits += units;
        }
      });
      const semGwa = semUnits > 0 ? (semWeighted / semUnits).toFixed(4) : "0.0000";
      summaryData.push([`${sem.year} - ${sem.semester}`, semGwa]);
    });

    if (summaryData.length > 0) {
      doc.setFontSize(12);
      doc.setFont("helvetica", 'bold');
      doc.text("Term-by-Term Overview", 14, currentY);
      currentY += 6;

      autoTable(doc, {
        startY: currentY,
        head: [['Academic Term', 'Term GWA']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [248, 250, 252], textColor: [15, 23, 42], fontStyle: 'bold' },
        styles: { font: 'helvetica', fontSize: 9, cellPadding: 4, textColor: [15, 23, 42], lineColor: [226, 232, 240] },
        margin: { left: 14, right: 14 },
      });
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }

    semesters.forEach((sem) => {
      if (!settings.includeSummer && sem.semester === 'Summer') return;

      const title = `${sem.year} - ${sem.semester}`;
      
      const bodyData: any[] = sem.subjects.map(sub => {
        return [
          sub.name || '-',
          sub.units.toString(),
          sub.grade.toString()
        ];
      });

      // Calculate sem GWA
      let semWeighted = 0;
      let semUnits = 0;
      sem.subjects.forEach(sub => {
        const units = Number(sub.units);
        const grade = Number(sub.grade);
        if (!isNaN(units) && !isNaN(grade) && units > 0 && grade > 0) {
          semWeighted += units * grade;
          semUnits += units;
        }
      });
      const semGwa = semUnits > 0 ? (semWeighted / semUnits).toFixed(4) : "0.0000";

      // Add sem GWA footer
      bodyData.push([{ 
        content: `Term GWA: ${semGwa}`, 
        colSpan: 3, 
        styles: { halign: 'right', fontStyle: 'bold', fillColor: [248, 250, 252] } 
      }]);

      autoTable(doc, {
        startY: currentY,
        pageBreak: 'avoid',
        head: [
          [{ content: title, colSpan: 3, styles: { halign: 'left', fillColor: [15, 23, 42], textColor: 255 } }], 
          ['Subject Name', 'Units', 'Grade']
        ],
        body: bodyData,
        theme: 'grid',
        headStyles: {
          fillColor: [241, 245, 249],
          textColor: [15, 23, 42],
          fontStyle: 'bold'
        },
        styles: {
          font: 'helvetica',
          fontSize: 10,
          cellPadding: 6,
          textColor: [15, 23, 42],
          lineColor: [226, 232, 240],
        },
        margin: { left: 14, right: 14 }
      });

      // after table is drawn, get new Y
      currentY = (doc as any).lastAutoTable.finalY + 15;
    });

    // Add Calculation Breakdown Page
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", 'bold');
    doc.text("Calculation Breakdown", 14, 22);

    doc.setFontSize(10);
    doc.setFont("helvetica", 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text("A step-by-step explanation of how your Cumulative GWA was computed.", 14, 30);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text("Step 1: Get the Weighted Score for every subject", 14, 42);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text("Formula: (Subject Units) × (Subject Grade) = Weighted Score", 14, 48);
    doc.text("Example: A 3-unit subject with a grade of 1.50 gives a weighted score of 4.50.", 14, 54);

    doc.setFontSize(12);
    doc.setFont("helvetica", 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text("Step 2: Add everything together", 14, 66);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Total sum of all Weighted Scores: ${cumulativeWeighted.toFixed(4)}`, 14, 72);
    doc.text(`Total sum of all Valid Units: ${cumulativeUnits}`, 14, 78);

    doc.setFontSize(12);
    doc.setFont("helvetica", 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text("Step 3: Divide to find the final GWA", 14, 90);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text("Formula: (Total Weighted Score) ÷ (Total Valid Units) = Cumulative GWA", 14, 96);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${cumulativeWeighted.toFixed(4)} ÷ ${cumulativeUnits} = ${finalGwa}`, 14, 106);

    doc.save('GWA_Record.pdf');
    onClose();
    if (showToast) {
      showToast("PDF exported successfully!");
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
            onClick={handleExportPDF}
            className="w-full group relative p-4 mb-3 rounded-xl text-left transition-all duration-300 border-2 border-[#0F172A] bg-white shadow-sm hover:bg-[#0F172A] hover:text-white overflow-hidden flex items-center gap-4"
          >
            <div className="p-2 rounded-lg shrink-0 bg-[#0F172A] text-white group-hover:bg-white group-hover:text-[#0F172A] transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[15px] text-[#0F172A] group-hover:text-white transition-colors">PDF Document</h3>
              <p className="text-[12px] text-[#64748B] group-hover:text-[#CBD5E1] transition-colors">Clean tables and grades</p>
            </div>
            <Download className="w-5 h-5 text-[#0F172A] group-hover:text-white transition-colors" />
          </button>

          <button 
            onClick={handleExportCSV}
            className="w-full group relative p-4 rounded-xl text-left transition-all duration-300 border-2 border-[#E2E8F0] bg-white shadow-sm hover:border-[#0F172A] hover:bg-[#F8FAFC] overflow-hidden flex items-center gap-4"
          >
            <div className="p-2 rounded-lg shrink-0 bg-[#F1F5F9] text-[#0F172A] group-hover:bg-[#0F172A] group-hover:text-white transition-colors">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[15px] text-[#0F172A] transition-colors">Spreadsheet (CSV)</h3>
              <p className="text-[12px] text-[#64748B] transition-colors">Raw data columns</p>
            </div>
            <Download className="w-5 h-5 text-[#64748B] group-hover:text-[#0F172A] transition-colors" />
          </button>
        </div>
        
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] text-center">
          <p className="text-[12px] text-[#94A3B8]">Your data never leaves your device.</p>
        </div>
      </div>
    </div>
  );
}
