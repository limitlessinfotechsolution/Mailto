import { useState, useEffect, useCallback } from 'react';
import { getContacts, createContact } from '../api';
import { FiUserPlus, FiTrash2, FiRefreshCw, FiMail, FiPhone, FiMapPin, FiSearch, FiUser } from 'react-icons/fi';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newContact, setNewContact] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getContacts();
      setContacts(res.data);
      if (res.data.length > 0 && !selectedContact && !isCreating) {
        setSelectedContact(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedContact, isCreating]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createContact(newContact);
      setContacts([...contacts, res.data]);
      setIsCreating(false);
      setSelectedContact(res.data);
      setNewContact({ firstName: '', lastName: '', email: '', phone: '', address: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to create contact');
    }
  };

  const startNewContact = () => {
    setSelectedContact(null);
    setIsCreating(true);
    setNewContact({ firstName: '', lastName: '', email: '', phone: '', address: '' });
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-white">
      {/* Sidebar List */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        {/* Toolbar */}
        <div className="h-10 border-b border-gray-200 flex items-center px-3 bg-gray-50 justify-between flex-shrink-0">
          <div className="font-semibold text-gray-700">Contacts</div>
          <button onClick={loadContacts} className="text-gray-500 hover:text-gray-700" title="Refresh">
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Search */}
        <div className="p-2 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="relative">
            <FiSearch className="absolute left-2 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search contacts..." 
              className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map(contact => (
            <div
              key={contact._id}
              onClick={() => { setSelectedContact(contact); setIsCreating(false); }}
              className={`p-3 border-b border-gray-100 cursor-pointer flex items-center gap-3 hover:bg-gray-50 ${
                selectedContact?._id === contact._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                {contact.firstName?.[0] || contact.email[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <div className="font-medium text-gray-900 truncate">
                  {contact.firstName} {contact.lastName}
                </div>
                <div className="text-xs text-gray-500 truncate">{contact.email}</div>
              </div>
            </div>
          ))}
          {contacts.length === 0 && !loading && (
            <div className="p-4 text-center text-gray-400 text-sm">No contacts found</div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        {/* Main Toolbar */}
        <div className="h-10 border-b border-gray-200 flex items-center px-4 bg-white gap-3 flex-shrink-0">
          <button 
            onClick={startNewContact}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <FiUserPlus size={16} /> New
          </button>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <button className="text-gray-600 hover:text-red-600" title="Delete" disabled={!selectedContact}><FiTrash2 size={18} /></button>
          <button className="text-gray-600 hover:text-blue-600" title="Email" disabled={!selectedContact}><FiMail size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {isCreating ? (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <FiUserPlus /> Create New Contact
              </h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newContact.firstName}
                      onChange={e => setNewContact({...newContact, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newContact.lastName}
                      onChange={e => setNewContact({...newContact, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded p-2 pl-10 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newContact.email}
                      onChange={e => setNewContact({...newContact, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    type="button" 
                    onClick={() => { setIsCreating(false); setSelectedContact(contacts[0]); }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm"
                  >
                    Save Contact
                  </button>
                </div>
              </form>
            </div>
          ) : selectedContact ? (
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <div className="px-8 pb-8">
                <div className="relative -mt-16 mb-6">
                  <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500">
                      {selectedContact.firstName?.[0] || selectedContact.email[0].toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {selectedContact.firstName} {selectedContact.lastName}
                </h1>
                <p className="text-gray-500 mb-8 flex items-center gap-2">
                  <FiMail size={14} /> {selectedContact.email}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-gray-400 shadow-sm"><FiMail /></div>
                        <span>{selectedContact.email}</span>
                      </div>
                      {selectedContact.phone && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-gray-400 shadow-sm"><FiPhone /></div>
                          <span>{selectedContact.phone}</span>
                        </div>
                      )}
                      {selectedContact.address && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-gray-400 shadow-sm"><FiMapPin /></div>
                          <span>{selectedContact.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <FiUser size={64} className="mb-4 text-gray-300" />
              <p className="text-lg">Select a contact to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
