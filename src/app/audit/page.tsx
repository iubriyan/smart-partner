'use client';
import { useState, useEffect } from 'react';
import { ShieldCheck, Clock } from 'lucide-react';

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('smart_audit') || '[]');
    setLogs(saved.reverse());
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Audit Trail & Activity Logs</h1>
            <p className="text-xs text-gray-500">Track who did what and when updates were made</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">User / Member</th>
                <th className="px-4 py-3">Action Details</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-center text-gray-400 text-xs">No activity logs recorded yet.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 font-medium text-indigo-600">{log.user}</td>
                    <td className="px-4 py-3 text-gray-800">{log.action}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs flex items-center space-x-1">
                      <Clock className="h-3 w-3 inline" />
                      <span>{log.time}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}