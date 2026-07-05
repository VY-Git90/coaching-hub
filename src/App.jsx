import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';  
import { BookOpen, Users, UserCheck, Key, LogOut, LayoutDashboard, Calendar } from 'lucide-react';

// Import Modular Layer Subcomponents
import Dashboard from './components/Dashboard';
import StudentManager from './components/StudentManager';
import FacultyManager from './components/FacultyManager';
import UserPermissions from './components/UserPermissions';
import BatchManager from './components/BatchManager';

export default function App() {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [currentMenu, setCurrentMenu] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // Form States for Auth
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Global Context Synchronized Collections
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [batches, setBatches] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserProfile(session.user.id);
      else setUserProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && userProfile) globalSyncDataHub();
  }, [session, userProfile]);

  async function fetchUserProfile(uid) {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single();
    setUserProfile(data);
  }

async function globalSyncDataHub() {
  const { data: b } = await supabase.from('batches').select('*'); setBatches(b || []);
  const { data: f } = await supabase.from('faculties').select('*'); setFaculties(f || []);
  const { data: p } = await supabase.from('profiles').select('*'); setSystemUsers(p || []);
  const { data: s } = await supabase.from('students').select(`*, batches(name, timing)`); setStudents(s || []);
  
  // ADD THIS LINE TO SYNC ACTIVE PAYMENT BALANCES FOR THE DASHBOARD
  const { data: pay } = await supabase.from('payments').select('*'); setPayments(pay || []);
}

  // Permission Verification Mapping Wrapper (RBAC)
  const permits = {
    viewFinance: () => userProfile?.role === 'Admin' || userProfile?.role === 'Staff',
    viewUsersTab: () => userProfile?.role === 'Admin',
    modifyData: () => userProfile?.role === 'Admin' || userProfile?.role === 'Staff'
  };

  // Global Shared Mutators Execution API
const handleAddStudent = async (formData, isEditing = false, editingId = null) => {
  if (isEditing) {
    const { error } = await supabase.from('students').update(formData).eq('id', editingId);
    if (error) alert(error.message);
  } else {
    const { error } = await supabase.from('students').insert([formData]);
    if (error) alert(error.message);
  }
  globalSyncDataHub();
};

  const handleDeleteStudent = async (id) => {
    await supabase.from('students').delete().eq('id', id);
    globalSyncDataHub();
  };

const handleUpdateFees = async () => {
  globalSyncDataHub(); // Instantly recalculates statements and payments table updates across views
};

const handleAddFaculty = async (formData, isEditing = false, editingId = null) => {
  if (isEditing) {
    const { error } = await supabase.from('faculties').update(formData).eq('id', editingId);
    if (error) alert(error.message);
  } else {
    const { error } = await supabase.from('faculties').insert([formData]);
    if (error) alert(error.message);
  }
  globalSyncDataHub();
};

  const handleDeleteFaculty = async (id) => {
    await supabase.from('faculties').delete().eq('id', id);
    globalSyncDataHub();
  };

  const handleChangeUserRole = async (userId, targetRole) => {
    await supabase.from('profiles').update({ role: targetRole }).eq('id', userId);
    globalSyncDataHub();
  };

  const directWhatsAppReminder = (student) => {
    const pendingAmount = student.total_fees - student.fees_paid;
    const msg = `Dear Parent/Student, this is a reminder regarding the outstanding balance of ₹${pendingAmount} due at coaching classes.`;
    window.open(`https://wa.me/${student.phone.startsWith('+91') ? student.phone : '+91' + student.phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword, options: { data: { full_name: authName } } });
      if (error) alert(error.message); else alert('Account created successfully!');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
      if (error) alert(error.message);
    }
    setLoading(false);
  };


  const handleAddBatch = async (formData) => {
  const { error } = await supabase.from('batches').insert([formData]);
  if (error) alert(error.message);
  globalSyncDataHub();
};

const handleUpdateBatch = async (id, formData) => {
  const { error } = await supabase.from('batches').update(formData).eq('id', id);
  if (error) alert(error.message);
  globalSyncDataHub();
};

const handleDeleteBatch = async (id) => {
  const confirmClean = window.confirm("Warning: Deleting this batch will drop relational references. Proceed?");
  if (!confirmClean) return;
  const { error } = await supabase.from('batches').delete().eq('id', id);
  if (error) alert(error.message);
  globalSyncDataHub();
};

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="p-3 bg-blue-600 text-white rounded-xl mb-2"><BookOpen size={32}/></div>
            <h2 className="text-2xl font-bold text-slate-800">Utkarsh Classes Hub</h2>
          </div>
          <form onSubmit={handleAuthAction} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Full Name</label>
                <input type="text" className="w-full border p-2.5 rounded-lg" value={authName} onChange={e=>setAuthName(e.target.value)} required />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Institutional Email</label>
              <input type="email" className="w-full border p-2.5 rounded-lg" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Password</label>
              <input type="password" className="w-full border p-2.5 rounded-lg" value={authPassword} onChange={e=>setAuthPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg font-medium transition">
              {loading ? 'Processing...' : isSignUp ? 'Register Workspace' : 'Secure Login'}
            </button>
          </form>
          <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-center text-xs text-blue-600 mt-4 hover:underline">
            {isSignUp ? 'Have an account? Login' : 'Register new account'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 font-sans">
      <aside className="w-full md:w-64 bg-slate-900 text-slate-200 p-4 flex flex-col justify-between shadow-inner">
        <div>
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
            <div className="p-2 bg-blue-600 text-white rounded-lg"><BookOpen size={20}/></div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">UTKARSH CLASSES HUB</h1>
              <span className="text-[10px] bg-slate-800 text-amber-400 font-mono px-2 py-0.5 rounded-full">{userProfile?.role} Account</span>
            </div>
          </div>
          <nav className="space-y-1.5">
            <button onClick={() => setCurrentMenu('dashboard')} className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition ${currentMenu === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}><LayoutDashboard size={18}/> Dashboard</button>
            <button onClick={() => setCurrentMenu('students')} className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition ${currentMenu === 'students' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}><Users size={18}/> Students</button>
            <button onClick={() => setCurrentMenu('faculties')} className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition ${currentMenu === 'faculties' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}><UserCheck size={18}/> Faculties</button>
            <button onClick={() => setCurrentMenu('batches')} className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition ${currentMenu === 'batches' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}><Calendar size={18}/> Batches Configuration</button>
            {permits.viewUsersTab() && (
              <button onClick={() => setCurrentMenu('users')} className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition ${currentMenu === 'users' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}><Key size={18}/> Access Control</button>
            )}
          </nav>
        </div>
        <div className="border-t border-slate-800 pt-4 mt-6">
          <p className="text-xs text-slate-300 font-bold truncate px-2 mb-3">{userProfile?.full_name}</p>
          <button onClick={() => supabase.auth.signOut()} className="w-full flex items-center gap-3 p-2 text-rose-400 hover:bg-rose-950/30 rounded-lg text-xs font-semibold transition"><LogOut size={16}/> Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
        {currentMenu === 'dashboard' && <Dashboard userProfile={userProfile} students={students} faculties={faculties} payments={payments} batches={batches} permits={permits} />}
        {currentMenu === 'students' && <StudentManager students={students} batches={batches} permits={permits} onAddStudent={handleAddStudent} onDeleteStudent={handleDeleteStudent} onUpdateFees={handleUpdateFees} directWhatsAppReminder={directWhatsAppReminder} />}
        {currentMenu === 'faculties' && <FacultyManager faculties={faculties} userProfile={userProfile} onAddFaculty={handleAddFaculty} onDeleteFaculty={handleDeleteFaculty} />}
        {currentMenu === 'users' && permits.viewUsersTab() && <UserPermissions systemUsers={systemUsers} session={session} onChangeUserRole={handleChangeUserRole} />}
        {currentMenu === 'batches' && <BatchManager batches={batches} permits={permits} onAddBatch={handleAddBatch} onUpdateBatch={handleUpdateBatch} onDeleteBatch={handleDeleteBatch} />}
      </main>
    </div>
  );
}