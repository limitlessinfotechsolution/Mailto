import { useState, useEffect, useCallback } from 'react';
import { getAdminUsers, createAdminUser, getAdminDomains, createAdminDomain, getAdminStats } from '../api';
import { FiUsers, FiGlobe, FiPlus, FiServer, FiActivity, FiSearch, FiRefreshCw } from 'react-icons/fi';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, users, domains
  const [stats, setStats] = useState({ users: 0, domains: 0, messages: 0 });
  const [users, setUsers] = useState([]);
  const [domains, setDomains] = useState([]);
  
  // Forms
  const [newUser, setNewUser] = useState({ email: '', password: '', domainId: '', role: 'user' });
  const [newDomain, setNewDomain] = useState({ name: '' });
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await getAdminStats();
        setStats(res.data);
      } else if (activeTab === 'users') {
        const [usersRes, domainsRes] = await Promise.all([getAdminUsers(), getAdminDomains()]);
        setUsers(usersRes.data);
        setDomains(domainsRes.data);
        if (domainsRes.data.length > 0 && !newUser.domainId) {
            setNewUser(prev => ({ ...prev, domainId: domainsRes.data[0]._id }));
        }
      } else if (activeTab === 'domains') {
        const res = await getAdminDomains();
        setDomains(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, newUser.domainId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createAdminUser(newUser);
      setNewUser({ email: '', password: '', domainId: domains[0]?._id || '', role: 'user' });
      loadData();
      alert('User created successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to create user');
    }
  };

  const handleCreateDomain = async (e) => {
    e.preventDefault();
    try {
      await createAdminDomain(newDomain);
      setNewDomain({ name: '' });
      loadData();
      alert('Domain created successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to create domain');
    }
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-gray-100">
      {/* Admin Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 font-bold text-gray-700 flex items-center gap-2">
          <FiServer className="text-blue-600" /> Admin Control
        </div>
        <nav className="flex-1 p-2 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <FiActivity /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <FiUsers /> Users
          </button>
          <button
            onClick={() => setActiveTab('domains')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'domains' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <FiGlobe /> Domains
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6 justify-between">
          <h2 className="text-lg font-bold text-gray-800 capitalize">{activeTab}</h2>
          <button onClick={loadData} className="text-gray-500 hover:text-gray-700" title="Refresh">
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-gray-500 text-sm font-medium uppercase">Total Users</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">{stats.users}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-gray-500 text-sm font-medium uppercase">Total Domains</div>
                <div className="text-3xl font-bold text-blue-600 mt-2">{stats.domains}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-gray-500 text-sm font-medium uppercase">Total Messages</div>
                <div className="text-3xl font-bold text-green-600 mt-2">{stats.messages}</div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Create User Form */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FiPlus /> Add User</h3>
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      value={newUser.email}
                      onChange={e => setNewUser({...newUser, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      value={newUser.password}
                      onChange={e => setNewUser({...newUser, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Domain</label>
                    <select
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      value={newUser.domainId}
                      onChange={e => setNewUser({...newUser, domainId: e.target.value})}
                      required
                    >
                      <option value="">Select Domain</option>
                      {domains.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                    <select
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      value={newUser.role}
                      onChange={e => setNewUser({...newUser, role: e.target.value})}
                    >
                      <option value="user">User</option>
                      <option value="domain_admin">Domain Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded text-sm hover:bg-blue-700">Create</button>
                  </div>
                </form>
              </div>

              {/* Users List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.domain?.name || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'domain_admin' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'domains' && (
            <div className="space-y-6">
              {/* Create Domain Form */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-xl">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FiPlus /> Add Domain</h3>
                <form onSubmit={handleCreateDomain} className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="example.com"
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      value={newDomain.name}
                      onChange={e => setNewDomain({...newDomain, name: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Add Domain</button>
                </form>
              </div>

              {/* Domains List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {domains.map(domain => (
                      <tr key={domain._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{domain.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(domain.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
