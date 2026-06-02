import React, { useState } from 'react';
import { User, ActivityLog } from '../../types';
import { UserPlus, Shield, UserX, Check, AlertCircle, Edit, Trash2 } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

interface UsersCMSProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUserRole: string;
  addActivityLog: (action: string, details: string) => void;
}

export default function UsersCMS({ users, setUsers, currentUserRole, addActivityLog }: UsersCMSProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Editor' as User['role'],
    status: 'active' as User['status']
  });
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) {
      setErrorMsg('Please enter both name and email.');
      return;
    }

    if (users.some(u => u.email.toLowerCase() === newUser.email.trim().toLowerCase())) {
      setErrorMsg('A user with this email already exists.');
      return;
    }

    const created: User = {
      id: `usr-${Date.now()}`,
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role,
      status: newUser.status
    };

    setUsers([created, ...users]);
    addActivityLog('Create User', `Registered user ${created.name} as ${created.role}`);
    setNewUser({ name: '', email: '', role: 'Editor', status: 'active' });
    setShowAddForm(false);
    setErrorMsg('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editingUser.name.trim() || !editingUser.email.trim()) {
      setErrorMsg('Please enter both name and email.');
      return;
    }

    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    addActivityLog('Update User', `Modified user profile for ${editingUser.name}`);
    setEditingUser(null);
    setErrorMsg('');
  };

  const handleDeleteUser = (id: string, name: string) => {
    setUserToDelete({ id, name });
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;
    const { id, name } = userToDelete;
    setUsers(users.filter(u => u.id !== id));
    addActivityLog('Delete User', `Removed user ${name}`);
    setUserToDelete(null);
  };

  const getRoleBadgeColor = (role: User['role']) => {
    switch (role) {
      case 'Super Admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Admin': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Content Manager': return 'bg-teal-100 text-teal-800 border-[#C5A059]/20';
      default: return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const rolePermissions = {
    'Super Admin': { create: true, edit: true, delete: true, publish: true, users: true },
    'Admin': { create: true, edit: true, delete: true, publish: true, users: false },
    'Content Manager': { create: true, edit: true, delete: false, publish: true, users: false },
    'Editor': { create: true, edit: true, delete: false, publish: false, users: false },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xl font-serif text-maroon-950 font-bold">Administration & Roles Ledger</h4>
          <p className="text-xs text-stone-500">Configure team access control, permissions profiles, and security levels.</p>
        </div>
        
        {currentUserRole === 'Super Admin' && (
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingUser(null);
              setErrorMsg('');
            }}
            className="px-4 py-2 bg-maroon-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-maroon-950 shadow-md select-none cursor-pointer transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add User Account</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-100 text-red-900 border border-red-200 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* CREATE ACCOUNT FORM */}
      {showAddForm && (
        <form onSubmit={handleAddUser} className="bg-cream border border-beige p-5 rounded-xl space-y-4 shadow-sm animate-fade-in">
          <h5 className="font-serif text-maroon-950 font-bold text-sm">Add New Administrator Account</h5>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Sarah Khan"
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded focus:outline-none focus:ring-1 focus:ring-maroon-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="sarah@mitthosweets.com"
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded focus:outline-none focus:ring-1 focus:ring-maroon-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Assigned Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded focus:outline-none focus:ring-1 focus:ring-maroon-900"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Content Manager">Content Manager</option>
                <option value="Editor">Editor</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Initial Status</label>
              <select
                value={newUser.status}
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value as User['status'] })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded focus:outline-none focus:ring-1 focus:ring-maroon-900"
              >
                <option value="active">Active</option>
                <option value="inactive">Suspended</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 border border-beige text-stone-600 rounded text-xs px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-maroon-900 text-white rounded text-xs font-bold hover:bg-maroon-950"
            >
              Create Account
            </button>
          </div>
        </form>
      )}

      {/* EDIT ACCOUNT FORM */}
      {editingUser && (
        <form onSubmit={handleSaveEdit} className="bg-cream border border-gold-600/30 p-5 rounded-xl space-y-4 shadow-sm animate-fade-in bg-amber-50/15">
          <h5 className="font-serif text-maroon-950 font-bold text-sm">Edit Team Member Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded focus:outline-none focus:ring-1 focus:ring-maroon-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded focus:outline-none focus:ring-1 focus:ring-maroon-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Role Designation</label>
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as User['role'] })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded focus:outline-none focus:ring-1 focus:ring-maroon-900"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Content Manager">Content Manager</option>
                <option value="Editor">Editor</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Status Code</label>
              <select
                value={editingUser.status}
                onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as User['status'] })}
                className="w-full text-xs px-3 py-2 bg-cream-dark border border-beige rounded focus:outline-none focus:ring-1 focus:ring-maroon-900"
              >
                <option value="active">Active</option>
                <option value="inactive">Suspended</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="px-3.5 py-1.5 border border-beige text-stone-600 rounded text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-maroon-900 text-white rounded text-xs font-bold hover:bg-maroon-950"
            >
              Save Parameters
            </button>
          </div>
        </form>
      )}

      {/* TEAM LISTING TABLE */}
      <div className="bg-cream border border-beige rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-cream-dark text-stone-500 uppercase tracking-wider text-[10px] font-mono border-b border-beige">
                <th className="py-3 px-4 font-bold">Team Member</th>
                <th className="py-3 px-4 font-bold">Email</th>
                <th className="py-3 px-4 font-bold">Designation</th>
                <th className="py-3 px-4 font-bold text-center">Status</th>
                {currentUserRole === 'Super Admin' && <th className="py-3 px-4 text-center font-bold">Operations</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/55">
              {users.map((item) => (
                <tr key={item.id} className="hover:bg-beige/10 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-maroon-900/10 border border-maroon-900/10 text-maroon-900 flex items-center justify-center font-bold">
                        {item.name[0]}
                      </div>
                      <span className="font-semibold text-stone-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-stone-600">{item.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 border text-[10px] rounded-full font-semibold inline-block ${getRoleBadgeColor(item.role)}`}>
                      {item.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold inline-block font-mono ${
                      item.status === 'active' ? 'bg-green-150 text-green-800' : 'bg-red-150 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  {currentUserRole === 'Super Admin' && (
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingUser(item);
                            setShowAddForm(false);
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                          }}
                          className="p-1 px-2 border border-beige hover:border-maroon-900 text-stone-600 hover:text-maroon-900 rounded flex items-center gap-1 cursor-pointer select-none"
                          title="Edit Information"
                        >
                          <Edit className="w-3 h-3" />
                          <span className="text-[10px]">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(item.id, item.name)}
                          className="p-1 px-2.5 bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-1 cursor-pointer select-none shadow-sm transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span className="text-[10px]">Delete</span>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MATRIX OF ROLES & PERMISSIONS */}
      <div className="bg-cream border border-beige p-5 rounded-2xl">
        <h5 className="font-serif text-maroon-950 font-bold mb-3 flex items-center gap-1.5">
          <Shield className="w-5 h-5 text-gold-600" />
          <span>Workspace Access Matrix (Static Core Security)</span>
        </h5>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          {Object.entries(rolePermissions).map(([rTitle, perms]) => (
            <div key={rTitle} className="p-4 border border-beige rounded-xl space-y-2 bg-cream-dark/35">
              <span className={`text-[11px] font-bold uppercase tracking-wider block border-b border-beige pb-1 ${
                rTitle === 'Super Admin' ? 'text-purple-600' : rTitle === 'Admin' ? 'text-blue-600' : rTitle === 'Content Manager' ? 'text-teal-600' : 'text-stone-600'
              }`}>
                {rTitle}
              </span>
              <ul className="space-y-1 text-[11px] font-mono text-stone-500">
                <li className="flex items-center justify-between">
                  <span>Create Modules:</span>
                  <span className={perms.create ? 'text-green-600 font-bold' : 'text-red-500'}>{perms.create ? 'YES' : 'NO'}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Edit Pages:</span>
                  <span className={perms.edit ? 'text-green-600 font-bold' : 'text-red-500'}>{perms.edit ? 'YES' : 'NO'}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Delete items:</span>
                  <span className={perms.delete ? 'text-green-600 font-bold' : 'text-red-500'}>{perms.delete ? 'YES' : 'NO'}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Publish CMS:</span>
                  <span className={perms.publish ? 'text-green-600 font-bold' : 'text-red-500'}>{perms.publish ? 'YES' : 'NO'}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Manage Users:</span>
                  <span className={perms.users ? 'text-purple-600 font-bold' : 'text-stone-400'}>{perms.users ? 'YES' : 'NO'}</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
      {userToDelete && (
        <DeleteConfirmModal 
          isOpen={userToDelete !== null}
          onClose={() => setUserToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Operator Account?"
          message={`Are you sure you want to permanently delete and remove operator "${userToDelete.name}"? This will terminate their CMS access keys.`}
        />
      )}
    </div>
  );
}
