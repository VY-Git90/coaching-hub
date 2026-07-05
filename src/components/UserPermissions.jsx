import React from 'react';

export default function UserPermissions({ systemUsers, session, onChangeUserRole }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden max-w-3xl">
      <div className="p-4 bg-slate-50 border-b">
        <h3 className="font-bold text-slate-800 text-base">IAM Access Control Infrastructure</h3>
        <p className="text-xs text-slate-500">Manage fine-grained interface tracking, financial scopes, and write capabilities across your dashboard.</p>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 text-xs font-bold uppercase text-slate-500 border-b">
            <th className="p-3">Registered Users</th>
            <th className="p-3">Active Assigned Role</th>
          </tr>
        </thead>
        <tbody className="divide-y text-sm">
          {systemUsers.map(u => (
            <tr key={u.id} className="hover:bg-slate-50/80">
              <td className="p-3 font-medium">{u.full_name}<br/><span className="text-xs text-slate-400 font-mono font-normal">{u.email}</span></td>
              <td className="p-3">
                <select className="border rounded px-2 py-1 bg-white font-medium text-xs text-slate-700 focus:ring-1" value={u.role} onChange={e=>onChangeUserRole(u.id, e.target.value)} disabled={u.id === session.user.id}>
                  <option value="Admin">Admin</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Staff">Staff</option>
                </select>
                {u.id === session.user.id && <span className="text-[10px] ml-2 text-slate-400 italic">(Self Profile Locked)</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}