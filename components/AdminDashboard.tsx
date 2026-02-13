import React, { useState, useEffect } from 'react';
import { getAllRegistrations, UserRegistration } from '../services/crmService';
import { Users, Download, ShieldCheck, Search } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserRegistration[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setUsers(getAllRegistrations());
  }, []);

  const filteredUsers = users.filter(u => 
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    // Create CSV content
    const headers = "First Name,Last Name,DOB,Email,Registration Date\n";
    const rows = users.map(u => 
        `${u.firstName},${u.lastName},${u.dob},${u.email},${u.timestamp}`
    ).join("\n");
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "crypto50_leads_greenrope.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-indigo-600" />
                    Admin Dashboard
                </h1>
                <p className="text-slate-500">Manage registered members and export for GreenRope CRM.</p>
            </div>
            <button 
                onClick={handleExport}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95"
            >
                <Download className="w-5 h-5" /> Export CSV
            </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-slate-500 font-bold text-xs uppercase mb-2">Total Registrations</div>
                <div className="text-4xl font-bold text-indigo-600">{users.length}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-slate-500 font-bold text-xs uppercase mb-2">Beta Status</div>
                <div className="text-xl font-bold text-green-600 flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span> Active
                </div>
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    className="bg-transparent border-none outline-none w-full text-slate-700"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">DOB</th>
                            <th className="px-6 py-4">Registered</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((user, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-bold text-slate-800">
                                    {user.firstName} {user.lastName}
                                </td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.dob}</td>
                                <td className="px-6 py-4 font-mono text-xs">
                                    {new Date(user.timestamp).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};
