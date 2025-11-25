import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../api';
import { FiX, FiMinus, FiMaximize2, FiPaperclip, FiImage, FiSmile, FiClock, FiCalendar } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

export default function Compose({ onClose, onSendSuccess, initialData = null, signature = '' }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);
  const fileInputRef = useRef(null);

  // Populate fields when initialData is provided (for reply/forward)
  useEffect(() => {
    if (initialData) {
      setTo(initialData.to || '');
      setSubject(initialData.subject || '');
      
      // Add quoted message for reply/forward
      if (initialData.originalMessage) {
        const original = initialData.originalMessage;
        const quotedText = `
          <br/><br/>
          <div style="border-left: 3px solid #ccc; padding-left: 10px; margin-left: 10px; color: #666;">
            <p><strong>From:</strong> ${original.from.name || original.from.address}</p>
            <p><strong>Date:</strong> ${new Date(original.createdAt).toLocaleString()}</p>
            <p><strong>Subject:</strong> ${original.subject}</p>
            <br/>
            ${original.html || `<p>${original.text || original.snippet}</p>`}
          </div>
        `;
        setBody(quotedText);
      }
    } else if (signature) {
      setBody(`<br/><br/>${signature}`);
    }
  }, [initialData, signature]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/attachments/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setAttachments([...attachments, ...response.data.files]);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload files');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await sendMessage({ 
        to, 
        subject, 
        text: body, 
        html: body,
        scheduledAt: scheduledAt || null,
        attachments: attachments.map(att => ({
          filename: att.filename,
          path: att.path
        }))
      });
      if (onSendSuccess) onSendSuccess(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-10 w-64 bg-white border border-gray-300 rounded-t-lg shadow-lg z-50 flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50" onClick={() => setIsMinimized(false)}>
        <span className="font-bold text-gray-700 truncate">{subject || 'New Message'}</span>
        <div className="flex gap-2">
           <button onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}><FiMaximize2 /></button>
           <button onClick={(e) => { e.stopPropagation(); onClose(); }}><FiX /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white w-full max-w-4xl h-[80vh] rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center flex-shrink-0">
          <h3 className="font-bold">New Message</h3>
          <div className="flex gap-3">
            <button onClick={() => setIsMinimized(true)} className="hover:text-gray-300"><FiMinus /></button>
            <button onClick={onClose} className="hover:text-gray-300"><FiX /></button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="flex-1 flex flex-col min-h-0">
          <div className="px-4 py-2 border-b border-gray-200 flex items-center gap-2">
            <span className="text-gray-500 w-16 text-sm font-medium">To</span>
            <input
              type="text"
              className="flex-1 outline-none text-gray-800"
              value={to}
              onChange={e => setTo(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="px-4 py-2 border-b border-gray-200 flex items-center gap-2">
            <span className="text-gray-500 w-16 text-sm font-medium">Subject</span>
            <input
              type="text"
              className="flex-1 outline-none text-gray-800 font-medium"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
            />
          </div>
          
          {/* Attachments Display */}
          {attachments.length > 0 && (
            <div className="px-4 py-2 border-b border-gray-200 flex flex-wrap gap-2">
              {attachments.map((att, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded text-sm">
                  <FiPaperclip size={14} />
                  <span className="truncate max-w-[200px]">{att.filename}</span>
                  <span className="text-gray-400">({(att.size / 1024).toFixed(1)} KB)</span>
                  <button type="button" onClick={() => removeAttachment(idx)} className="text-red-500 hover:text-red-700">
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Editor */}
          <div className="flex-1 flex flex-col min-h-0 relative">
            <ReactQuill 
              theme="snow"
              value={body}
              onChange={setBody}
              className="h-full flex flex-col"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                  ['link', 'image'],
                  ['clean']
                ],
              }}
            />
            {/* Custom CSS to make Quill fit the container */}
            <style>{`
              .quill { display: flex; flex-direction: column; height: 100%; }
              .ql-container { flex: 1; overflow-y: auto; font-size: 16px; font-family: sans-serif; }
              .ql-toolbar { border-top: none !important; border-left: none !important; border-right: none !important; background: #f9fafb; }
              .ql-container { border: none !important; }
            `}</style>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center flex-shrink-0">
            <div className="flex gap-4 text-gray-500 items-center">
               <input 
                 type="file" 
                 ref={fileInputRef}
                 onChange={handleFileSelect}
                 multiple
                 className="hidden"
               />
               <button 
                 type="button" 
                 onClick={() => fileInputRef.current?.click()}
                 disabled={uploading}
                 className="hover:text-gray-700 p-2 rounded hover:bg-gray-200 transition disabled:opacity-50"
                 title="Attach files"
               >
                 <FiPaperclip size={20} />
               </button>
               <button type="button" className="hover:text-gray-700 p-2 rounded hover:bg-gray-200 transition"><FiImage size={20} /></button>
               <button type="button" className="hover:text-gray-700 p-2 rounded hover:bg-gray-200 transition"><FiSmile size={20} /></button>
               
               <div className="h-6 w-px bg-gray-300 mx-2"></div>
               
               <div className="relative flex items-center">
                 <button 
                   type="button" 
                   onClick={() => setShowSchedule(!showSchedule)}
                   className={`p-2 rounded transition flex items-center gap-2 ${showSchedule || scheduledAt ? 'text-blue-600 bg-blue-50' : 'hover:text-gray-700 hover:bg-gray-200'}`}
                   title="Schedule Send"
                 >
                   <FiClock size={20} />
                   {scheduledAt && <span className="text-xs font-medium">{new Date(scheduledAt).toLocaleString()}</span>}
                 </button>
                 
                 {showSchedule && (
                    <div className="absolute bottom-12 left-0 bg-white shadow-xl border border-gray-200 p-3 rounded-lg z-50 w-72">
                      <h4 className="text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                        <FiCalendar /> Schedule Send
                      </h4>
                      <input 
                        type="datetime-local" 
                        className="w-full border border-gray-300 rounded p-2 text-sm mb-2"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                      <div className="flex justify-end gap-2">
                        <button 
                          type="button" 
                          onClick={() => { setScheduledAt(''); setShowSchedule(false); }}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Clear
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setShowSchedule(false)}
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                 )}
               </div>
            </div>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded font-medium"
              >
                Discard
              </button>
              <button 
                type="submit" 
                disabled={sending || uploading}
                className="px-6 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {sending ? 'Sending...' : uploading ? 'Uploading...' : scheduledAt ? 'Schedule Send' : 'Send'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
