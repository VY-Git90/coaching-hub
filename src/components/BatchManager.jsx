import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ShieldAlert, Search, X, Calendar, IndianRupee } from 'lucide-react';
import BatchForm from './BatchForm';

export default function BatchManager({ batches, permits, onAddBatch, onUpdateBatch, onDeleteBatch }) {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({ name: '', timing: '', fees: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (batch) => {
    setFormData({ name: batch.name, timing: batch.timing, fees: batch.fees });
    setEditingId(batch.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCreateClick = () => {
    setFormData({ name: '', timing: '', fees: '' });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      timing: formData.timing,
      fees: parseFloat(formData.fees || 0)
    };

    if (isEditing) {
      onUpdateBatch(editingId, payload);
    } else {
      onAddBatch(payload);
    }

    setFormData({ name: '', timing: '', fees: '' });
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const filteredBatches = batches.filter(b => 
    b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.timing?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 w-full">
      {showForm && (
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-slate-800">Batch Structure Modification</h3>
            <p className="text-xs text-slate-400">Configure program parameters across institutional databases.</p>
          </div>
          <button onClick={() => setShowForm(false)} className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium transition">
            <X size={14} /> Close
          </button>
        </div>
      )}

      {showForm ? (
        <BatchForm formData={formData} onChange={handleChange} onSubmit={handleFormSubmit} isEditing={isEditing} />
      ) : (
        <>
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border shadow-sm">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search active courses by batch track name or timeline shifts..." 
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {permits.modifyData() ? (
              <button onClick={handleCreateClick} className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition">
                <Plus size={16} /> Construct New Batch
              </button>
            ) : (
              <div className="text-xs bg-slate-50 text-slate-500 border px-3 py-2 rounded-xl flex items-center gap-1 font-medium italic">
                <ShieldAlert size={14}/> Modification Privileges Blocked
              </div>
            )}
          </div>

          {/* Core Table Grid Data Display Layout */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden max-w-4xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-xs font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-4">Track Information Mapping</th>
                  <th className="p-4">Assigned Time Allocation</th>
                  <th className="p-4">Baseline Fees Token</th>
                  {permits.modifyData() && <th className="p-4 text-right">Administrative Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {filteredBatches.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-slate-400 italic">No dynamic course batch registries discovered.</td></tr>
                ) : (
                  filteredBatches.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">
                          <Calendar size={16}/>
                        </div>
                        <p className="font-bold text-slate-800">{b.name}</p>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-600 font-semibold">{b.timing}</td>
                      <td className="p-4 font-bold text-slate-700 flex items-center gap-0.5 mt-2">
                        <IndianRupee size={12}/>{parseFloat(b.fees || 0).toLocaleString('en-IN')}
                      </td>
                      
                      {permits.modifyData() && (
                        <td className="p-4 text-right align-middle whitespace-nowrap space-x-1">
                          <button onClick={() => handleEditClick(b)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl border border-transparent transition inline-flex items-center">
                            <Edit2 size={14}/>
                          </button>
                          <button onClick={() => onDeleteBatch(b.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent transition inline-flex items-center">
                            <Trash2 size={14}/>
                          </button>
                        </td>
                      )}
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