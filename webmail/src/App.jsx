import { useState, useEffect, useCallback } from 'react';
import Login from './Login';
import { getFolders, getMessages } from './api';
import Calendar from './components/Calendar';
import Contacts from './components/Contacts';
import Tasks from './components/Tasks';
import Campaigns from './components/Campaigns';
import Compose from './components/Compose';
import AdminPanel from './components/AdminPanel';
import Settings from './components/Settings';
import { 
  FiMail, FiCalendar, FiUsers, FiCheckSquare, FiFileText, 
  FiInbox, FiSend, FiTrash2, FiFolder, FiEdit, FiSearch, 
  FiRefreshCw, FiMoreHorizontal, FiMenu, FiStar, FiAlertCircle, 
  FiLogOut, FiChevronLeft, FiChevronRight, FiSettings, FiShield
} from 'react-icons/fi';
import { IoMdMegaphone } from 'react-icons/io';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('mail'); // mail, calendar, contacts, tasks, notes, campaigns, admin
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [composeMode, setComposeMode] = useState('new'); // new, reply, replyAll, forward (for future UI differentiation)
  const [composeInitialData, setComposeInitialData] = useState(null);

  const handleReply = () => {
    if (!selectedMessage) return;
    setComposeMode('reply');
    setComposeInitialData({
      to: selectedMessage.from.address,
      subject: selectedMessage.subject.startsWith('Re:') ? selectedMessage.subject : `Re: ${selectedMessage.subject}`,
      originalMessage: selectedMessage
    });
    setIsComposeOpen(true);
  };

  const handleReplyAll = () => {
    if (!selectedMessage) return;
    const recipients = [selectedMessage.from.address];
    if (selectedMessage.to) {
      selectedMessage.to.forEach(recipient => {
        if (recipient.address && recipient.address !== user.email) {
          recipients.push(recipient.address);
        }
      });
    }
    setComposeMode('replyAll');
    setComposeInitialData({
      to: recipients.join(', '),
      subject: selectedMessage.subject.startsWith('Re:') ? selectedMessage.subject : `Re: ${selectedMessage.subject}`,
      originalMessage: selectedMessage
    });
    setIsComposeOpen(true);
  };

  const handleForward = () => {
    if (!selectedMessage) return;
    setComposeMode('forward');
    setComposeInitialData({
      to: '',
      subject: selectedMessage.subject.startsWith('Fwd:') ? selectedMessage.subject : `Fwd: ${selectedMessage.subject}`,
      originalMessage: selectedMessage
    });
    setIsComposeOpen(true);
  };

  const handleNewEmail = () => {
    setComposeMode('new');
    setComposeInitialData(null);
    setIsComposeOpen(true);
  };

  const handleComposeClose = () => {
    setIsComposeOpen(false);
    setComposeMode('new');
    setComposeInitialData(null);
  };
  
  // Mail State
  const [folders, setFolders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const loadFolders = useCallback(async () => {
    try {
      const res = await getFolders();
      setFolders(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  }, []);

  const loadMessages = useCallback(async (folderId) => {
    if (!folderId) return;
    setLoadingMessages(true);
    try {
      const res = await getMessages(folderId);
      setMessages(res.data);
      setSelectedMessage(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (user && currentView === 'mail') {
      loadFolders().then(data => {
        if (data && data.length > 0) {
          setSelectedFolder(prev => {
            if (prev) return prev;
            const inbox = data.find(f => f.name.toLowerCase() === 'inbox');
            return inbox || data[0];
          });
        }
      });
    }
  }, [user, currentView, loadFolders]);

  useEffect(() => {
    if (selectedFolder && currentView === 'mail') {
      loadMessages(selectedFolder._id);
    }
  }, [selectedFolder, currentView, loadMessages]);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const getFolderIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower === 'inbox') return <FiInbox className="mr-2" />;
    if (lower === 'sent') return <FiSend className="mr-2" />;
    if (lower === 'trash') return <FiTrash2 className="mr-2" />;
    if (lower === 'drafts') return <FiFileText className="mr-2" />;
    if (lower === 'junk' || lower === 'spam') return <FiAlertCircle className="mr-2" />;
    return <FiFolder className="mr-2" />;
  };

  const renderContent = () => {
    switch (currentView) {
      case 'calendar': return <Calendar />;
      case 'contacts': return <Contacts />;
      case 'tasks': return <Tasks />;
      case 'notes': return <Notes />;
      case 'campaigns': return <Campaigns />;
      case 'admin': return <AdminPanel />;
      case 'settings': return <Settings />;
      case 'mail':
      default:
        return (
          <div className="flex flex-1 h-full overflow-hidden">
            {/* Mail Sidebar (Folders) */}
            <div className="w-56 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0">
              <div className="p-3 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Folders</span>
                <button className="text-gray-400 hover:text-gray-600"><FiRefreshCw size={12} onClick={loadFolders} /></button>
              </div>
              <nav className="flex-1 overflow-y-auto px-2 space-y-1">
                {folders.map(folder => (
                  <div
                    key={folder._id}
                    onClick={() => setSelectedFolder(folder)}
                    className={`cursor-pointer px-3 py-2 text-sm rounded-md flex items-center transition-colors ${
                      selectedFolder?._id === folder._id 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getFolderIcon(folder.name)}
                    <span className="truncate">{folder.name}</span>
                  </div>
                ))}
              </nav>
            </div>

            {/* Message List */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
              {/* Toolbar for Message List */}
              <div className="h-10 border-b border-gray-200 flex items-center px-3 bg-gray-50 justify-between">
                <span className="font-semibold text-gray-700 truncate">{selectedFolder?.name}</span>
                <div className="flex gap-2">
                   <button className="text-gray-500 hover:text-gray-700" title="Refresh" onClick={() => selectedFolder && loadMessages(selectedFolder._id)}>
                     <FiRefreshCw size={14} className={loadingMessages ? 'animate-spin' : ''} />
                   </button>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="p-2 border-b border-gray-200 bg-white">
                <div className="relative">
                  <FiSearch className="absolute left-2 top-2.5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loadingMessages ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
                ) : messages.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
                    <FiInbox size={24} />
                    No messages
                  </div>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg._id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${
                        selectedMessage?._id === msg._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                      } ${!msg.flags.read ? 'font-semibold' : ''}`}
                    >
                      <div className="flex justify-between mb-1 items-baseline">
                        <span className={`truncate w-32 text-sm ${!msg.flags.read ? 'text-gray-900' : 'text-gray-600'}`}>
                          {msg.from.name || msg.from.address}
                        </span>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className={`text-sm truncate ${!msg.flags.read ? 'text-gray-900' : 'text-gray-800'}`}>
                        {msg.subject || '(No Subject)'}
                      </div>
                      <div className="text-xs text-gray-500 truncate mt-1">{msg.snippet}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reading View */}
            <div className="flex-1 bg-white flex flex-col min-w-0">
              {/* Reading Pane Toolbar */}
              <div className="h-10 border-b border-gray-200 flex items-center px-4 bg-gray-50 gap-3">
                <button 
                  onClick={handleNewEmail}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <FiEdit size={16} /> New
                </button>
                <div className="h-4 w-px bg-gray-300 mx-1"></div>
                <button onClick={handleReply} className="text-gray-600 hover:text-gray-900" title="Reply" disabled={!selectedMessage}><FiChevronLeft size={18} /></button>
                <button onClick={handleReplyAll} className="text-gray-600 hover:text-gray-900" title="Reply All" disabled={!selectedMessage}><FiUsers size={18} /></button>
                <button onClick={handleForward} className="text-gray-600 hover:text-gray-900" title="Forward" disabled={!selectedMessage}><FiChevronRight size={18} /></button>
                <div className="h-4 w-px bg-gray-300 mx-1"></div>
                <button className="text-gray-600 hover:text-red-600" title="Delete" disabled={!selectedMessage}><FiTrash2 size={18} /></button>
                <div className="flex-1"></div>
                <button className="text-gray-600 hover:text-gray-900" title="More"><FiMoreHorizontal size={18} /></button>
              </div>

              {selectedMessage ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-gray-200 bg-white shadow-sm z-10">
                    <h1 className="text-xl font-bold text-gray-800 mb-4">{selectedMessage.subject}</h1>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                          {(selectedMessage.from.name || selectedMessage.from.address || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">
                            {selectedMessage.from.name} <span className="font-normal text-gray-500">&lt;{selectedMessage.from.address}&gt;</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            To: Me
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="p-8 text-gray-800 overflow-y-auto flex-1 bg-white">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{selectedMessage.text || selectedMessage.snippet}</p>
                      {/* Placeholder for HTML content if available */}
                      {selectedMessage.html && (
                         <div dangerouslySetInnerHTML={{ __html: selectedMessage.html }} />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                  <FiMail size={48} className="mb-4 text-gray-300" />
                  <p>Select a message to read</p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Main Navigation Sidebar */}
      <div className="w-16 bg-[#1a202c] flex flex-col items-center py-4 gap-2 z-20 shadow-lg">
        <div className="text-white font-bold text-2xl mb-6 tracking-tight">M</div>

        <NavButton icon={<FiMail />} label="Mail" active={currentView === 'mail'} onClick={() => setCurrentView('mail')} />
        <NavButton icon={<FiCalendar />} label="Calendar" active={currentView === 'calendar'} onClick={() => setCurrentView('calendar')} />
        <NavButton icon={<FiUsers />} label="Contacts" active={currentView === 'contacts'} onClick={() => setCurrentView('contacts')} />
        <NavButton icon={<FiCheckSquare />} label="Tasks" active={currentView === 'tasks'} onClick={() => setCurrentView('tasks')} />
        <NavButton icon={<FiFileText />} label="Notes" active={currentView === 'notes'} onClick={() => setCurrentView('notes')} />
        <NavButton icon={<IoMdMegaphone />} label="Campaigns" active={currentView === 'campaigns'} onClick={() => setCurrentView('campaigns')} />

        <div className="mt-auto flex flex-col gap-2">
           {/* Admin Link (Only for admins) */}
           {(user.role === 'super_admin' || user.role === 'domain_admin') && (
             <NavButton icon={<FiShield />} label="Admin" active={currentView === 'admin'} onClick={() => setCurrentView('admin')} />
           )}
           <NavButton icon={<FiSettings />} label="Settings" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />
           <button onClick={() => setUser(null)} className="w-10 h-10 rounded-xl flex items-center justify-center text-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all" title="Logout">
             <FiLogOut />
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 h-14 flex items-center px-6 justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-xl text-gray-800 capitalize flex items-center gap-2">
              {currentView}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsComposeOpen(true)}
               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 shadow-sm transition-all"
             >
               <FiEdit /> New Email
             </button>
             <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold border border-gray-300">
               {user.email[0].toUpperCase()}
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>
      </div>

      {isComposeOpen && (
        <Compose 
          onClose={handleComposeClose} 
          initialData={composeInitialData}
          onSendSuccess={() => {
             // Optionally refresh sent folder if we were viewing it
             if (selectedFolder?.name.toLowerCase() === 'sent') {
               loadMessages(selectedFolder._id);
             }
             handleComposeClose();
          }} 
        />
      )}
    </div>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-200 ${
        active 
          ? 'bg-blue-600 text-white shadow-lg scale-105' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
      title={label}
    >
      {icon}
    </button>
  );
}

export default App;

