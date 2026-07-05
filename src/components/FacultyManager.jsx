import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ShieldAlert, Search, X, Award, IndianRupee } from 'lucide-react';
import FacultyForm from './FacultyForm';

export default function FacultyManager({ faculties, userProfile, onAddFaculty, onDeleteFaculty }) {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', avatar_url: '',
    specialization: '', highest_qualification: '', experience_years: '',
    joining_date: new Date().toISOString().split('T')[0], salary_ctc: '', status: 'Active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateClick = () => {
    setFormData({
      firstName: '', lastName: '', email: '', phone: '', avatar_url: '',
      specialization: '', highest_qualification: '', experience_years: '',
      joining_date: new Date().toISOString().split('T')[0], salary_ctc: '', status: 'Active'
    });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditClick = (f) => {
    setFormData({
      firstName: f.first_name || '',
      lastName: f.last_name || '',
      email: f.email || '',
      phone: f.phone || '',
      avatar_url: f.avatar_url || '',
      specialization: f.specialization || '',
      highest_qualification: f.highest_qualification || '',
      experience_years: f.experience_years || '',
      joining_date: f.joining_date || new Date().toISOString().split('T')[0],
      salary_ctc: f.salary_ctc || '',
      status: f.status || 'Active'
    });
    setEditingId(f.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const completePayload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      avatar_url: formData.avatar_url,
      specialization: formData.specialization,
      highest_qualification: formData.highest_qualification,
      experience_years: parseFloat(formData.experience_years || 0),
      joining_date: formData.joining_date,
      salary_ctc: parseFloat(formData.salary_ctc || 0),
      status: formData.status
    };

    onAddFaculty(completePayload, isEditing, editingId);
    setShowForm(false);
  };

  const filteredFaculties = faculties.filter(f => 
    `${f.first_name} ${f.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 w-full">
      {showForm && (
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase">
              {isEditing ? "Modify Instructor Record" : "Onboard New Faculty Track"}
            </h3>
          </div>
          <button onClick={() => setShowForm(false)} className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition"><X size={16} /> Close</button>
        </div>
      )}

      {showForm ? (
        <FacultyForm formData={formData} onChange={handleChange} onSubmit={handleFormSubmit} />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border shadow-sm">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input type="text" placeholder="Search instructors..." className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white transition" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            {userProfile?.role === 'Admin' ? (
              <button onClick={handleCreateClick} className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"><Plus size={16} /> Onboard New Faculty</button>
            ) : (
              <div className="text-xs bg-slate-50 text-slate-500 border px-3 py-2 rounded-xl flex items-center gap-1 font-medium italic"><ShieldAlert size={14}/> Administration Access Required</div>
            )}
          </div>

          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-xs font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-4">Faculty Staff Details</th>
                  <th className="p-4">Academic Credentials</th>
                  <th className="p-4">Status</th>
                  {userProfile?.role === 'Admin' && <th className="p-4 text-right">Compensation / Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredFaculties.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 text-purple-700 border rounded-full flex items-center justify-center font-bold">
                        {f.avatar_url ? <img src={f.avatar_url} alt="" className="w-full h-full object-cover"/> : f.first_name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{f.first_name} {f.last_name}</p>
                        <p className="text-[11px] text-slate-400">{f.email} | {f.phone}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-bold rounded text-[11px]">{f.specialization}</span>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Award size={12}/> {f.highest_qualification}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${f.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{f.status}</span>
                    </td>
                    {userProfile?.role === 'Admin' && (
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="inline-block text-left mr-4">
                          <p className="text-xs font-bold text-slate-700 flex items-center justify-end"><IndianRupee size={12}/>{parseFloat(f.salary_ctc).toLocaleString('en-IN')}</p>
                        </div>
                        <button onClick={() => handleEditClick(f)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition inline-flex items-center"><Edit2 size={14}/></button>
                        <button onClick={() => onDeleteFaculty(f.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition inline-flex items-center"><Trash2 size={14}/></button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}