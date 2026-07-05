import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { IndianRupee, CreditCard, Calendar, Plus, X } from 'lucide-react';

export default function PaymentManager({ student, onClose, onPaymentSuccess }) {
  const [history, setHistory] = useState([]);
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('UPI');
  const [ref, setRef] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPaymentHistory();
  }, [student]);

  async function fetchPaymentHistory() {
    const { data } = await supabase.from('payments').select('*').eq('student_id', student.id).order('created_at', { ascending: false });
    setHistory(data || []);
  }

  const handleCollectFees = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return alert('Enter valid currency configuration amount');
    setLoading(true);

    const { error } = await supabase.from('payments').insert([{
      student_id: student.id,
      amount_paid: parseFloat(amount),
      payment_mode: mode,
      transaction_ref: ref,
      remarks: remarks
    }]);

    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      setAmount(''); setRef(''); setRemarks('');
      fetchPaymentHistory();
      onPaymentSuccess(); // Signal updates up to parent roster index
    }
  };

  const totalCollectedHistory = history.reduce((acc, curr) => acc + parseFloat(curr.amount_paid), 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto overflow-hidden">
      <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
        <div>
          <h3 className="font-bold text-sm">Fee Statement: {student.name}</h3>
          <p className="text-xs text-slate-400">Total Committed: ₹{student.total_fees} | Outstanding Dues: <span className="text-rose-400 font-bold">₹{student.total_fees - totalCollectedHistory}</span></p>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition"><X size={18}/></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x border-b">
        {/* Left Side Input Block Form */}
        <form onSubmit={handleCollectFees} className="p-5 md:col-span-2 space-y-3 bg-slate-50/50">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1"><Plus size={14}/> Log New Installment</h4>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Amount Collected (₹)</label>
            <input type="number" className="w-full border rounded-lg p-2 text-sm bg-white font-bold" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="e.g., 5000" required />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Payment Instrument Mode</label>
            <select className="w-full border rounded-lg p-2 text-sm bg-white font-medium" value={mode} onChange={e=>setMode(e.target.value)}>
              <option value="UPI">UPI (GPay / PhonePe)</option>
              <option value="Cash">Liquid Cash</option>
              <option value="Net Banking">IMPS / Net Banking</option>
              <option value="Cheque">Bank Cheque</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Reference Id / UTR No.</label>
            <input type="text" className="w-full border rounded-lg p-2 text-sm bg-white" value={ref} onChange={e=>setRef(e.target.value)} placeholder="Txn Reference / Cheque No." />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Remarks Note</label>
            <input type="text" className="w-full border rounded-lg p-2 text-sm bg-white" value={remarks} onChange={e=>setRemarks(e.target.value)} placeholder="e.g., Part 2 payment" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold p-2.5 rounded-lg transition tracking-wide uppercase mt-2 shadow-sm">
            {loading ? 'Recording...' : 'Commit Transaction Receipt'}
          </button>
        </form>

        {/* Right Side Historic Transaction Logs Table */}
        <div className="p-5 md:col-span-3 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1"><Calendar size={14}/> Statement History Ledger</h4>
          <div className="overflow-y-auto max-h-[290px] border rounded-xl divide-y bg-white">
            {history.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-400 italic">No past historical payment installments found for this student account file index.</p>
            ) : (
              history.map(p => (
                <div key={p.id} className="p-3 flex justify-between items-center hover:bg-slate-50/80 text-xs transition">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600 font-mono">{p.payment_mode}</span>
                      <span>₹{p.amount_paid}</span>
                    </div>
                    {p.transaction_ref && <p className="text-[10px] text-slate-400 mt-0.5">Ref: {p.transaction_ref}</p>}
                    {p.remarks && <p className="text-[11px] text-slate-500 italic mt-0.5">"{p.remarks}"</p>}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{new Date(p.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}