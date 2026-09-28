'use client';
import { useState, useEffect } from 'react';
import { UserPlus, Users, Trash2, ShieldAlert } from 'lucide-react';

export default function MembersPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('smart_members') || '[]');
    setMembers(saved);
  }, []);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember = { name, email, pass };
    const updated = [...members, newMember];
    localStorage.setItem('smart_members', JSON.stringify(updated));
    setMembers(updated);
    setName('');
    setEmail('');
    setPass('');
    setSuccess('New member added successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = (index: number) => {
    const updated = members.filter((_, i) => i !== index);
    localStorage.setItem('smart_members', JSON.stringify(updated));
    setMembers(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Add New Partner / Member</h1>
            <p className="text-xs text-gray-500">Create login credentials for authorized users</p>
          </div>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleAddMember} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Partner Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="partner@gmail.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg text-sm shadow transition duration-200"
            >
              Save Member
            </button>
          </div>
        </form>
      </div>

      {/* Member List */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Users className="h-5 w-5 text-indigo-600" />
          <span>Authorized Members List</span>
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="bg-indigo-50/50">
                <td className="px-4 py-3 font-medium">Iftekhar (Master Admin)</td>
                <td className="px-4 py-3 text-gray-600">iftekhar.riyan07@gmail.com</td>
                <td className="px-4 py-3 text-xs text-indigo-600 font-semibold">Protected Master</td>
              </tr>
              {members.map((m, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-gray-600">{m.email}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove Member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}