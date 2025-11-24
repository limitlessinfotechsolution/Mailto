import { useState, useEffect, useCallback } from 'react';
import { getCampaigns, createCampaign, sendCampaign } from '../api';
import { FiPlus, FiRefreshCw, FiSend, FiBarChart2, FiEdit, FiSearch, FiUsers, FiMail } from 'react-icons/fi';
import { IoMdMegaphone } from 'react-icons/io';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: '', subject: '', content: '', recipients: '' });
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCampaigns();
      setCampaigns(res.data);
      if (res.data.length > 0 && !selectedCampaign && !isCreating) {
        setSelectedCampaign(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCampaign, isCreating]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      // Split recipients by comma and trim
      const recipientList = newCampaign.recipients.split(',').map(r => r.trim());
      
      const res = await createCampaign({
        ...newCampaign,
        recipients: recipientList
      });
      
      setCampaigns([res.data, ...campaigns]);
      setNewCampaign({ name: '', subject: '', content: '', recipients: '' });
      setIsCreating(false);
      setSelectedCampaign(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to create campaign');
    } finally {
      setSending(false);
    }
  };

  const handleSend = async (id) => {
    if (!confirm('Are you sure you want to start sending this campaign?')) return;
    try {
      await sendCampaign(id);
      loadCampaigns();
      alert('Campaign scheduled!');
    } catch (err) {
      console.error(err);
      alert('Failed to send campaign');
    }
  };

  const startNewCampaign = () => {
    setSelectedCampaign(null);
    setIsCreating(true);
    setNewCampaign({ name: '', subject: '', content: '', recipients: '' });
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-white">
      {/* Sidebar List */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        {/* Toolbar */}
        <div className="h-10 border-b border-gray-200 flex items-center px-3 bg-gray-50 justify-between flex-shrink-0">
          <div className="font-semibold text-gray-700">Campaigns</div>
          <button onClick={loadCampaigns} className="text-gray-500 hover:text-gray-700" title="Refresh">
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Search */}
        <div className="p-2 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="relative">
            <FiSearch className="absolute left-2 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {campaigns.map(campaign => (
            <div
              key={campaign._id}
              onClick={() => { setSelectedCampaign(campaign); setIsCreating(false); }}
              className={`p-3 border-b border-gray-100 cursor-pointer flex flex-col gap-1 hover:bg-gray-50 ${
                selectedCampaign?._id === campaign._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium text-gray-900 truncate flex-1">{campaign.name}</div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                   campaign.status === 'completed' ? 'bg-green-100 text-green-700' :
                   campaign.status === 'sending' ? 'bg-blue-100 text-blue-700' :
                   campaign.status === 'failed' ? 'bg-red-100 text-red-700' :
                   'bg-gray-100 text-gray-600'
                }`}>
                  {campaign.status}
                </span>
              </div>
              <div className="text-xs text-gray-500 truncate">
                {campaign.subject}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(campaign.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
          {campaigns.length === 0 && !loading && (
            <div className="p-4 text-center text-gray-400 text-sm">No campaigns found</div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        {/* Main Toolbar */}
        <div className="h-10 border-b border-gray-200 flex items-center px-4 bg-white gap-3 flex-shrink-0">
          <button 
            onClick={startNewCampaign}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <FiPlus size={16} /> New Campaign
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {isCreating ? (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <IoMdMegaphone className="text-blue-600" /> Create New Campaign
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newCampaign.name}
                      onChange={e => setNewCampaign({...newCampaign, name: e.target.value})}
                      required
                      placeholder="e.g. Monthly Newsletter"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newCampaign.subject}
                      onChange={e => setNewCampaign({...newCampaign, subject: e.target.value})}
                      required
                      placeholder="e.g. Check out our new features!"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                  <div className="relative">
                    <FiUsers className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      className="w-full border border-gray-300 rounded p-2 pl-10 h-20 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      value={newCampaign.recipients}
                      onChange={e => setNewCampaign({...newCampaign, recipients: e.target.value})}
                      placeholder="Enter email addresses separated by commas..."
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Separate multiple emails with commas.</p>
                </div>

                <div className="flex flex-col h-96">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Content</label>
                  <ReactQuill
                    theme="snow"
                    value={newCampaign.content}
                    onChange={(content) => setNewCampaign({...newCampaign, content})}
                    className="flex-1 flex flex-col"
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, false] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{'list': 'ordered'}, {'list': 'bullet'}],
                        ['link', 'image'],
                        ['clean']
                      ],
                    }}
                  />
                  <style>{`
                    .quill { display: flex; flex-direction: column; height: 100%; }
                    .ql-container { flex: 1; overflow-y: auto; font-size: 16px; font-family: sans-serif; }
                  `}</style>
                </div>

                <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                  <button 
                    type="button" 
                    onClick={() => { setIsCreating(false); setSelectedCampaign(campaigns[0]); }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={sending}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm disabled:opacity-50"
                  >
                    {sending ? 'Creating...' : 'Create Draft'}
                  </button>
                </div>
              </form>
            </div>
          ) : selectedCampaign ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{selectedCampaign.name}</h1>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span className="font-medium text-gray-700">Subject:</span> {selectedCampaign.subject}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                       selectedCampaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                       selectedCampaign.status === 'sending' ? 'bg-blue-100 text-blue-800' :
                       selectedCampaign.status === 'failed' ? 'bg-red-100 text-red-800' :
                       'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedCampaign.status}
                    </span>
                    {selectedCampaign.status === 'draft' && (
                      <button
                        onClick={() => handleSend(selectedCampaign._id)}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow-sm hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        <FiSend /> Send Campaign
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-1">{selectedCampaign.recipients.length}</div>
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Recipients</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{selectedCampaign.stats?.sent || 0}</div>
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Sent</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{selectedCampaign.stats?.opened || 0}</div>
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Opened</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-1">{selectedCampaign.stats?.failed || 0}</div>
                  <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Failed</div>
                </div>
              </div>

              {/* Content Preview */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2 text-sm font-medium text-gray-600">
                  <FiMail /> Content Preview
                </div>
                <div className="p-6 bg-white prose max-w-none">
                   <div dangerouslySetInnerHTML={{ __html: selectedCampaign.content }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <IoMdMegaphone size={64} className="mb-4 text-gray-300" />
              <p className="text-lg">Select a campaign to view stats</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
