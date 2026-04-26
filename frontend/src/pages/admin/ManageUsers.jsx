import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import Sidebar from '../../components/common/Sidebar';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Create User Modal
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    if (!window.confirm(`Change role to ${newRole}?`)) return;

    try {
      await API.patch(`/users/${userId}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      setUsers(prev => prev.map(u =>
        u._id === userId ? { ...u, role: newRole } : u
      ));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;

    try {
      await API.delete(`/users/${userId}`);
      toast.success('User deleted');
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password) {
      return toast.error('All fields are required');
    }
    if (newUser.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setCreating(true);
    try {
      const { data } = await API.post('/users', newUser);
      toast.success(data.message);
      setUsers(prev => [data.user, ...prev]);
      setShowModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'student' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Sidebar />
      <div className="admin-layout">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Manage Users</h1>
            <p className="admin-page-subtitle">{users.length} registered users</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Create User
          </button>
        </div>

        {/* Search */}
        <div className="users-search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading-overlay" style={{ position: 'relative', minHeight: '40vh' }}>
            <div className="spinner-gradient" style={{ width: '48px', height: '48px' }}></div>
          </div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="admin-empty-text">No users found</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="users-table-user">
                          <div className="users-table-avatar">
                            {user.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <span className="users-table-name">{user.name}</span>
                        </div>
                      </td>
                      <td className="users-table-email">{user.email}</td>
                      <td>
                        <span className={`pill ${user.role === 'admin' ? 'pill-admin' : 'pill-student'}`}>
                          {user.role === 'admin' ? '🛡️ Admin' : '🎓 Student'}
                        </span>
                      </td>
                      <td className="users-table-date">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </td>
                      <td>
                        <div className="users-table-actions">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleRoleChange(user._id, user.role)}
                          >
                            Toggle Role
                          </button>
                          <button
                            className="btn btn-ghost btn-sm manage-delete-btn"
                            onClick={() => handleDelete(user._id, user.name)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="confirm-overlay" onClick={() => setShowModal(false)}>
          <div className="create-user-modal" onClick={e => e.stopPropagation()}>
            <h3 className="create-user-title">Create New User</h3>
            <p className="create-user-subtitle">Add a student or admin account</p>

            <form onSubmit={handleCreateUser} className="create-user-form">
              {/* Role selector */}
              <div className="create-user-roles">
                <button
                  type="button"
                  className={`create-role-chip ${newUser.role === 'student' ? 'active-student' : ''}`}
                  onClick={() => setNewUser(p => ({ ...p, role: 'student' }))}
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  className={`create-role-chip ${newUser.role === 'admin' ? 'active-admin' : ''}`}
                  onClick={() => setNewUser(p => ({ ...p, role: 'admin' }))}
                >
                  🛡️ Admin
                </button>
              </div>

              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={newUser.name}
                  onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={newUser.email}
                  onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))}
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newUser.password}
                  onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))}
                />
              </div>

              <div className="create-user-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : `Create ${newUser.role === 'admin' ? 'Admin' : 'Student'}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageUsers;
