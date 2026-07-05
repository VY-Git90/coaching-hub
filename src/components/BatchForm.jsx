import React from 'react';
import { BookOpen, Clock, IndianRupee } from 'lucide-react';

export default function BatchForm({ formData, onChange, onSubmit, isEditing }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-2xl">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          {isEditing ? "Modify Course Configuration" : "Initialize New Program Track"}
        </h4>
      </div>
      
      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1 flex items-center gap-1">
            <BookOpen size={12}/> Batch / Course Name
          </label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={onChange} 
            placeholder="e.g., JEE Advanced Droppers (Batch A)" 
            className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 transition" 
            required 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1 flex items-center gap-1">
              <Clock size={12}/> Timing Constraints
            </label>
            <input 
              type="text" 
              name="timing" 
              value={formData.timing} 
              onChange={onChange} 
              placeholder="e.g., 04:00 PM - 05:30 PM" 
              className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 transition" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1 flex items-center gap-1">
              <IndianRupee size={12}/> Base Standard Fees (₹)
            </label>
            <input 
              type="number" 
              name="fees" 
              value={formData.fees} 
              onChange={onChange} 
              placeholder="e.g., 45000" 
              className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 transition" 
              required 
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-xl transition shadow-sm">
            {isEditing ? "Update Batch Master" : "Commit Program Track"}
          </button>
        </div>
      </form>
    </div>
  );
}