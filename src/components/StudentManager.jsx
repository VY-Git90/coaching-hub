import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Phone, ShieldAlert, Search, X, Receipt } from 'lucide-react';
import StudentForm from './StudentForm';
import PaymentManager from './PaymentManager';

export default function StudentManager({ 
  students, 
  batches, 
  permits, 
  onAddStudent, 
  onDeleteStudent, 
  onUpdateFees, 
  directWhatsAppReminder 
}) {
  const [activeView, setActiveView] = useState('grid'); // 'grid' | 'form' | 'statement-ledger'
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [formData, setFormData] = useState({
    username: '', email: '', firstName: '', lastName: '', phone: '', avatar_url: '',
    standard: '', school_name: '', board: '', batch_id: '', total_fees: '', parent_name: '',
    alternate_phone: '', address: '', city: 'Mumbai', postalCode: '', aboutMe: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateClick = () => {
    setFormData({
      username: '', email: '', firstName: '', lastName: '', phone: '', avatar_url: '',
      standard: '', school_name: '', board: '', batch_id: '', total_fees: '', parent_name: '',
      alternate_phone: '', address: '', city: 'Mumbai', postalCode: '', aboutMe: ''
    });
    setIsEditing(false);
    setEditingId(null);
    setActiveView('form');
  };

  const handleEditClick = (s) => {
    setFormData({
      username: s.username || '',
      email: s.email || '',
      firstName: s.first_name || '',
      lastName: s.last_name || '',
      phone: s.phone || '',
      avatar_url: s.avatar_url || '',
      standard: s.standard || '',
      school_name: s.school_name || '',
      board: s.board || '',
      batch_id: s.batch_id || '',
      total_fees: s.total_fees || '',
      parent_name: s.parent_name || '',
      alternate_phone: s.alternate_phone || '',
      address: s.address || '',
      city: s.city || 'Mumbai',
      postalCode: s.postal_code || '',
      aboutMe: s.aboutMe || ''
    });
    setEditingId(s.id);
    setIsEditing(true);
    setActiveView('form');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const completePayload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      avatar_url: formData.avatar_url,
      standard: formData.standard,
      school_name: formData.school_name,
      board: formData.board,
      batch_id: formData.batch_id,
      total_fees: parseFloat(formData.total_fees || 0),
      parent_name: formData.parent_name,
      alternate_phone: formData.alternate_phone,
      address: formData.address,
      city: formData.city,
      postal_code: formData.postalCode
    };

    onAddStudent(completePayload, isEditing, editingId);
    setActiveView('grid');
  };

  const filteredStudents = students.filter(student => 
    `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.phone?.includes(searchQuery) ||
    student.standard?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 w-full">
      {activeView !== 'grid' && (
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase">
              {activeView === 'form' ? (isEditing ? "Modify Admission File" : "New Registration Profile") : "Financial Ledger Window"}
            </h3>
          </div>
          <button onClick={() => { setActiveView('grid'); onUpdateFees(); }} className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition"><X size={16} /> Return to Directory</button>
        </div>
      )}

      {activeView === 'form' && (
        <StudentForm formData={formData} onChange={handleChange} onSubmit={handleFormSubmit} batches={batches} />
      )}

      {activeView === 'statement-ledger' && selectedStudent && (
        <PaymentManager student={selectedStudent} onClose={() => { setActiveView('grid'); onUpdateFees(); }} onPaymentSuccess={onUpdateFees} />
      )}

      {activeView === 'grid' && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border shadow-sm">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input type="text" placeholder="Search records..." className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white transition" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            {permits.modifyData() ? (
              <button onClick={handleCreateClick} className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"><Plus size={16} /> Register New Student</button>
            ) : (
              <div className="text-xs bg-amber-50 text-amber-800 border px-3 py-2 rounded-xl flex items-center gap-1 font-medium"><ShieldAlert size={14}/> Read-Only Mode</div>
            )}
          </div>

          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-xs font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-4">Student Profile Details</th>
                  <th className="p-4">Academic Placement</th>
                  {permits.viewFinance() && <th className="p-4">Fees Summary Overview</th>}
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredStudents.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-slate-400 italic">No matching entries.</td></tr>
                ) : (
                  filteredStudents.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 border rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold">
                          {s.avatar_url ? <img src={s.avatar_url} alt="" className="w-full h-full object-cover"/> : s.first_name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{s.first_name} {s.last_name}</p>
                          <p className="text-[11px] text-slate-400">Parent: {s.parent_name} | {s.phone}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-bold rounded text-[11px] border border-purple-200">{s.standard}</span>
                        <p className="text-xs text-slate-500 mt-1">{s.batches?.name || 'Awaiting Batch'}</p>
                      </td>
                      {permits.viewFinance() && (
                        <td className="p-4">
                          <p className="text-xs text-slate-500">Committed: <b>₹{s.total_fees}</b></p>
                          <button onClick={() => { setSelectedStudent({ id: s.id, name: `${s.first_name} ${s.last_name}`, total_fees: s.total_fees }); setActiveView('statement-ledger'); }} className="text-[11px] text-blue-600 hover:underline font-bold flex items-center gap-0.5 mt-0.5"><Receipt size={12}/> Manage Statements</button>
                        </td>
                      )}
                      <td className="p-4 text-right space-x-1 whitespace-nowrap align-middle">
                        {permits.modifyData() && (
                          <>
                            <button onClick={() => handleEditClick(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition inline-flex items-center"><Edit2 size={14}/></button>
                            <button onClick={() => onDeleteStudent(s.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition inline-flex items-center"><Trash2 size={14}/></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}