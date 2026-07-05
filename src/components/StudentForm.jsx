import React from 'react';
import { User, GraduationCap, Users, MapPin } from 'lucide-react';
import ImageCropper from './ImageCropper';

export default function StudentForm({ formData, onChange, onSubmit, batches }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          
          {/* Section 1: Identity & Credentials */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5"><User size={14}/> Identity & Access</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={onChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={onChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Username</label>
                <input type="text" name="username" value={formData.username} onChange={onChange} placeholder="e.g., aman12" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Student Email</label>
                <input type="email" name="email" value={formData.email} onChange={onChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none" />
              </div>
              <div className="md:col-span-2">
                <ImageCropper 
                  currentImage={formData.avatar_url} 
                  onImageCropped={(base64) => onChange({ target: { name: 'avatar_url', value: base64 } })} 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Details */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5"><GraduationCap size={14}/> Academic Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Standard / Class</label>
                <input type="text" name="standard" value={formData.standard} onChange={onChange} placeholder="e.g., Class 10" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">School Name</label>
                <input type="text" name="school_name" value={formData.school_name} onChange={onChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Educational Board</label>
                <input type="text" name="board" value={formData.board} onChange={onChange} placeholder="e.g., CBSE, ICSE" className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Assigned Batch</label>
                <select name="batch_id" value={formData.batch_id} onChange={onChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white" required>
                  <option value="">Select Batch</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Parent/Guardian Details */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5"><Users size={14}/> Parent / Guardian Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Parent Name</label>
                <input type="text" name="parent_name" value={formData.parent_name} onChange={onChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Parent Mobile Contact</label>
                <input type="tel" name="phone" value={formData.phone} onChange={onChange} placeholder="Primary 10 Digit No." className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Alternate Contact No.</label>
                <input type="tel" name="alternate_phone" value={formData.alternate_phone} onChange={onChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none" />
              </div>
            </div>
          </div>

          {/* Section 4: Addressing & Fees */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5"><MapPin size={14}/> Address & Course Fees</h4>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Home Address</label>
                <input type="text" name="address" value={formData.address} onChange={onChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none" />
              </div>
              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Total Course Fee committed (₹)</label>
                <input type="number" name="total_fees" value={formData.total_fees} onChange={onChange} placeholder="45000" className="w-full border border-blue-200 bg-blue-50/30 rounded-lg p-2 text-sm font-bold text-blue-900 outline-none" required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">City</label>
                <input type="text" name="city" value={formData.city} onChange={onChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Postal Code</label>
                <input type="text" name="postalCode" value={formData.postalCode} onChange={onChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-6 py-2.5 rounded-xl transition shadow-sm">
              Commit Complete Student File
            </button>
          </div>
        </form>
      </div>

      {/* Right Column Profile Showcase Live Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit sticky top-6">
        <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900"></div>
        <div className="p-6 text-center">
          <div className="relative -mt-14 inline-flex items-center justify-center rounded-full border-4 border-white shadow-md mb-3 bg-blue-600 text-white overflow-hidden" style={{ width: '80px', height: '80px' }}>
            {formData.avatar_url ? (
              <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-xl uppercase">{formData.firstName ? formData.firstName[0] : 'S'}</span>
            )}
          </div>
          <h5 className="text-base font-bold text-slate-800">{formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}` : 'Student Name'}</h5>
          <p className="text-xs text-slate-400">@{formData.username || 'username'}</p>
          
          <div className="mt-4 border-t border-slate-100 pt-4 text-left space-y-2 text-xs text-slate-600">
            <p><b>Standard:</b> {formData.standard || '—'}</p>
            <p><b>Batch:</b> {batches.find(b => b.id === formData.batch_id)?.name || 'Unassigned'}</p>
            <p><b>Parent:</b> {formData.parent_name || '—'} ({formData.phone || '—'})</p>
            <p className="text-blue-700 font-bold"><b>Committed Fees:</b> ₹{formData.total_fees || '0'}</p>
          </div>
        </div>
      </div>

    </div>
  );
}