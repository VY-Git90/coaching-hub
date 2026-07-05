import React from 'react';
import { User, Award, IndianRupee, Briefcase } from 'lucide-react';
import ImageCropper from './ImageCropper';

export default function FacultyForm({ formData, onChange, onSubmit }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          
          {/* Section 1: Basic Bio Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-3 flex items-center gap-1.5">
              <User size={14}/> Instructor Profile Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={onChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-purple-500 outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={onChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-purple-500 outline-none" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="instructor@domain.com" className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Mobile Contact</label>
                <input type="tel" name="phone" value={formData.phone} onChange={onChange} placeholder="10 Digit Number" className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none" required />
              </div>
              <div className="md:col-span-3">
                <ImageCropper 
                  currentImage={formData.avatar_url} 
                  onImageCropped={(base64) => onChange({ target: { name: 'avatar_url', value: base64 } })} 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Domain Profiles */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-3 flex items-center gap-1.5">
              <Award size={14}/> Domain Specialization & Credentials
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Subject Specialization Domain</label>
                <input type="text" name="specialization" value={formData.specialization} onChange={onChange} placeholder="e.g., IIT-JEE Physics Expert" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:border-purple-500 outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Highest Academic Qualification</label>
                <input type="text" name="highest_qualification" value={formData.highest_qualification} onChange={onChange} placeholder="e.g., M.Sc. (Physics), B.Tech IIT-B" className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Teaching Experience (Years)</label>
                <input type="number" name="experience_years" value={formData.experience_years} onChange={onChange} placeholder="e.g., 6" className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none" required />
              </div>
            </div>
          </div>

          {/* Section 3: Internal Corporate Placement HR */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-3 flex items-center gap-1.5">
              <Briefcase size={14}/> Corporate HR & Compensation Metrics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Joining Timeline Date</label>
                <input type="date" name="joining_date" value={formData.joining_date} onChange={onChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Salary Component CTC (Annual ₹)</label>
                <input type="number" name="salary_ctc" value={formData.salary_ctc} onChange={onChange} placeholder="e.g., 800000" className="w-full border border-purple-200 bg-purple-50/20 rounded-lg p-2 text-sm font-bold text-purple-900 outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Active Employee Status</label>
                <select name="status" value={formData.status} onChange={onChange} className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white font-medium">
                  <option value="Active">Active Duty</option>
                  <option value="On Leave">Temporary Leave</option>
                  <option value="Resigned">Resigned / Former Staff</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm px-6 py-2.5 rounded-xl transition shadow-sm">
              Save Instructor Profile Node
            </button>
          </div>
        </form>
      </div>

      {/* Right Column Profile Showcase Live Card View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit sticky top-6">
        <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900"></div>
        <div className="p-6 text-center">
          <div className="relative -mt-14 inline-flex items-center justify-center rounded-full border-4 border-white shadow-md mb-3 bg-purple-600 text-white overflow-hidden" style={{ width: '80px', height: '80px' }}>
            {formData.avatar_url ? (
              <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-xl uppercase">{formData.firstName ? formData.firstName[0] : 'F'}</span>
            )}
          </div>
          <h5 className="text-base font-bold text-slate-800">
            {formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}` : 'Faculty Professional Name'}
          </h5>
          <p className="text-xs text-purple-600 font-semibold tracking-wide mt-0.5">{formData.specialization || 'Specialization Domain'}</p>
          
          <div className="mt-4 border-t border-slate-100 pt-4 text-left space-y-2 text-xs text-slate-600">
            <p><b>Qualification Tier:</b> {formData.highest_qualification || '—'}</p>
            <p><b>Experience Index:</b> {formData.experience_years ? `${formData.experience_years} Years Active` : '—'}</p>
            <p><b>Email:</b> {formData.email || '—'}</p>
            <p><b>Contact Node:</b> {formData.phone || '—'}</p>
            <p className="text-purple-700 font-bold flex items-center gap-0.5">
              <IndianRupee size={12}/> <b>Annual Package CTC:</b> ₹{parseFloat(formData.salary_ctc || 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}