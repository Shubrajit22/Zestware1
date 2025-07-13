'use client';

import { useEffect, useState } from 'react';
import { Shield, Save } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  isAdmin: boolean;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<Record<string, User>>({});

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleChange = (id: string, field: keyof User, value: string | boolean) => {
    setEditingUser(prev => ({
      ...prev,
      [id]: {
        ...users.find(user => user.id === id)!,
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (id: string) => {
    const updated = editingUser[id];
    const res = await fetch('/api/admin/update-user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      setUsers(users.map(u => (u.id === id ? updated : u)));
      const copy = { ...editingUser };
      delete copy[id];
      setEditingUser(copy);
    } else {
      alert('Failed to update user');
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Manage Users</h2>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Mobile</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Joined</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => {
              const edited = editingUser[user.id] ?? user;
              return (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <input
                      className="w-full border rounded px-2 py-1 text-sm text-gray-900"
                      value={edited.name}
                      onChange={e => handleChange(user.id, 'name', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      className="w-full border rounded px-2 py-1 text-sm text-gray-900"
                      value={edited.email}
                      onChange={e => handleChange(user.id, 'email', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      className="w-full border rounded px-2 py-1 text-sm text-gray-900"
                      value={edited.mobile}
                      onChange={e => handleChange(user.id, 'mobile', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <label className="flex items-center space-x-2 text-sm text-gray-900">
                      <input
                        type="checkbox"
                        checked={edited.isAdmin}
                        onChange={e => handleChange(user.id, 'isAdmin', e.target.checked)}
                      />
                      <span>{edited.isAdmin ? 'Admin' : 'Customer'}</span>
                    </label>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleSave(user.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Save size={14} /> Save
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
