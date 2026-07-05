import React from 'react';
import { 
  Users, UserCheck, IndianRupee, ShieldAlert, 
  TrendingUp, Calendar, AlertCircle, CheckCircle2, LayoutGrid 
} from 'lucide-react';

export default function Dashboard({ userProfile, students, faculties, payments = [], batches = [], permits }) {
  
  // --- 1. CORE MATH & ANALYTICS PIPELINES ---
  const totalCommittedFees = students.reduce((acc, curr) => acc + parseFloat(curr.total_fees || 0), 0);
  const totalCollectedFees = payments.reduce((acc, curr) => acc + parseFloat(curr.amount_paid || 0), 0);
  const realOutstandingDues = totalCommittedFees - totalCollectedFees;
  
  // Calculate collection target performance percentage
  const collectionPercentage = totalCommittedFees > 0 ? Math.round((totalCollectedFees / totalCommittedFees) * 100) : 0;

  // Group student density by standard/class
  const classStats = students.reduce((acc, student) => {
    const std = student.standard || 'Other';
    acc[std] = (acc[std] || 0) + 1;
    return acc;
  }, {});

  // Generate automated operational alerts based on real data metrics
  const criticalDuesCount = students.filter(s => {
    const studentPayments = payments.filter(p => p.student_id === s.id);
    const paid = studentPayments.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0);
    return (s.total_fees - paid) > (s.total_fees * 0.5); // Has more than 50% fees pending
  }).length;

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-fade-in">
      
      {/* SECTION 1: HEADER CONTROLLER ZONE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Workspace Overview Command</h2>
          <p className="text-sm text-slate-500">Live operational reporting snapshot.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950 text-white px-4 py-2 rounded-xl text-xs font-mono tracking-wider shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          SYSTEM ONLINE: ACADEMIC YEAR 2026
        </div>
      </div>

      {/* SECTION 2: THE 3 CORE INSTITUTIONAL METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 flex items-center gap-4 shadow-sm hover:shadow-md transition duration-200">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={24}/></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Enrolled Candidates</p>
            <p className="text-2xl font-black text-slate-900">{students.length}</p>
            <span className="text-[10px] text-slate-400 block font-medium mt-0.5">Active registration keys linked</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 flex items-center gap-4 shadow-sm hover:shadow-md transition duration-200">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><UserCheck size={24}/></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Onboarded Faculty</p>
            <p className="text-2xl font-black text-slate-900">{faculties.length}</p>
            <span className="text-[10px] text-slate-400 block font-medium mt-0.5">Instructors handling domains</span>
          </div>
        </div>
        
        {permits.viewFinance() ? (
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 flex items-center gap-4 shadow-sm hover:shadow-md transition duration-200">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><IndianRupee size={24}/></div>
            <div className="w-full">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Outstanding Receivable Dues</p>
              <p className="text-2xl font-black text-rose-600">₹{realOutstandingDues.toLocaleString('en-IN')}</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden flex">
                <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${collectionPercentage}%` }}></div>
              </div>
              <span className="text-[10px] text-slate-400 flex justify-between font-medium mt-1">
                <span>Collected: {collectionPercentage}%</span>
                <span>Target: ₹{totalCommittedFees.toLocaleString('en-IN')}</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100 p-5 rounded-2xl border border-dashed flex items-center justify-center gap-3">
            <ShieldAlert className="text-slate-400" size={20}/>
            <p className="text-xs font-medium text-slate-400 italic">Financial tracking indices restricted via role mask policies.</p>
          </div>
        )}
      </div>

      {/* SECTION 3: ANALYTICS VISUALIZER LAYER (CHARTS GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* NATIVE CHART 1: BATCH UTILIZATION & ACADEMIC DENSITY INDEX */}
        <div className="bg-white p-5 rounded-2xl border lg:col-span-7 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-3 border-slate-100">
            <LayoutGrid size={16} className="text-blue-600" /> Grade-wise Registration Density
          </h3>
          
          <div className="space-y-4 pt-2">
            {Object.keys(classStats).length === 0 ? (
              <p className="text-xs text-slate-400 italic py-8 text-center">No registration indices data located.</p>
            ) : (
              Object.entries(classStats).map(([className, count]) => {
                const percentage = Math.round((count / students.length) * 100);
                return (
                  <div key={className} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">{className}</span>
                      <span className="text-slate-400 font-medium">{count} Students ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-lg transition-all" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* NATIVE CHART 2: RECENT SETTLED LEDGER FEED (COLLECTION HISTORY TIME RATIOS) */}
        <div className="bg-white p-5 rounded-2xl border lg:col-span-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-3 border-slate-100">
            <TrendingUp size={16} className="text-emerald-600" /> Real-time Billing Activity Stream
          </h3>
          
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {payments.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-10 text-center">Awaiting institutional fee transaction receipts...</p>
            ) : (
              payments.slice(0, 4).map((p, idx) => (
                <div key={p.id || idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800">₹{p.amount_paid.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Mode: {p.payment_mode} {p.transaction_ref ? `| ${p.transaction_ref}` : ''}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide">
                    Success
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* SECTION 4: SYSTEM OPERATIONS LIVE COUNSEL FEED */}
      <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-3 border-slate-100">
          <Calendar size={16} className="text-purple-600" /> Operations Guard Notification Feed
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Diagnostic Alert Box 1: Dues Alert */}
          {permits.viewFinance() && criticalDuesCount > 0 ? (
            <div className="flex gap-3 bg-rose-50 border border-rose-100 p-4 rounded-xl text-rose-900">
              <AlertCircle size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">High Default Delinquency Notice</h4>
                <p className="text-xs mt-1 text-rose-700/90 font-medium">There are <b className="font-bold">{criticalDuesCount} records</b> with over 50% committed dues outstanding. Use the Student Registrar tool to send direct WhatsApp balance reminders.</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-900">
              <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">Financial Risk Metric Clear</h4>
                <p className="text-xs mt-1 text-emerald-700/90 font-medium">Fee collections are tracking within regular boundaries across all batches. No critical cashflow deficits noted.</p>
              </div>
            </div>
          )}

          {/* Diagnostic Alert Box 2: Batches Configuration Status */}
          <div className="flex gap-3 bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-slate-800">
            <LayoutGrid size={20} className="text-slate-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">Structural Infrastructure Index</h4>
              <p className="text-xs mt-1 text-slate-600 font-medium">Currently operating <b className="font-bold">{batches.length} primary program tracks</b>. Ensure all upcoming high-volume entrance batches match specialized faculty time blocks.</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}