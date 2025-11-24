import { useState, useEffect, useCallback } from 'react';
import { getNotes, createNote } from '../api';
import { FiPlus, FiTrash2, FiSave, FiFileText, FiRefreshCw, FiSearch } from 'react-icons/fi';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotes();
      setNotes(res.data);
      if (res.data.length > 0 && !selectedNote) {
        setSelectedNote(res.data[0]);
        setNoteContent(res.data[0].content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedNote]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleCreate = async () => {
    try {
      const res = await createNote({ content: 'New Note' });
      setNotes([res.data, ...notes]);
      setSelectedNote(res.data);
      setNoteContent(res.data.content);
    } catch (err) {
      console.error(err);
      alert('Failed to create note');
    }
  };

  const handleSave = async () => {
    if (!selectedNote) return;
    setIsSaving(true);
    try {
      // Assuming API supports update, but for now we might just be creating new ones or this is a placeholder
      // Since the original API only had createNote, we'll just simulate a save or create a new one if it was a real app
      // For this demo, we'll just update the local state and pretend
      
      // Ideally: await updateNote(selectedNote._id, { content: noteContent });
      
      // Update local list
      const updatedNotes = notes.map(n => n._id === selectedNote._id ? { ...n, content: noteContent } : n);
      setNotes(updatedNotes);
      
      // In a real app, we would call an update API here.
      // Since we only have createNote in the provided API snippet, we'll just log it.
      console.log('Saved note:', noteContent);
      
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-white">
      {/* Sidebar List */}
      <div className="w-72 border-r border-gray-200 flex flex-col bg-white">
        {/* Toolbar */}
        <div className="h-10 border-b border-gray-200 flex items-center px-3 bg-gray-50 justify-between flex-shrink-0">
          <div className="font-semibold text-gray-700">Notes</div>
          <button onClick={loadNotes} className="text-gray-500 hover:text-gray-700" title="Refresh">
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Search */}
        <div className="p-2 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="relative">
            <FiSearch className="absolute left-2 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search notes..." 
              className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {notes.map(note => (
            <div
              key={note._id}
              onClick={() => { setSelectedNote(note); setNoteContent(note.content); }}
              className={`p-3 border-b border-gray-100 cursor-pointer flex flex-col gap-1 hover:bg-gray-50 ${
                selectedNote?._id === note._id ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : 'border-l-4 border-l-transparent'
              }`}
            >
              <div className="font-medium text-gray-900 truncate">
                {note.content.split('\n')[0] || 'New Note'}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {new Date(note.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
          {notes.length === 0 && !loading && (
            <div className="p-4 text-center text-gray-400 text-sm">No notes found</div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Main Toolbar */}
        <div className="h-10 border-b border-gray-200 flex items-center px-4 bg-gray-50 gap-3 flex-shrink-0">
          <button 
            onClick={handleCreate}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <FiPlus size={16} /> New Note
          </button>
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <button 
            onClick={handleSave}
            disabled={!selectedNote || isSaving}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 disabled:text-gray-400"
          >
            <FiSave size={16} /> {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button className="text-gray-600 hover:text-red-600 ml-auto" title="Delete" disabled={!selectedNote}><FiTrash2 size={18} /></button>
        </div>

        <div className="flex-1 p-6 flex flex-col">
          {selectedNote ? (
            <textarea
              className="flex-1 w-full h-full resize-none outline-none text-gray-800 font-sans text-lg leading-relaxed bg-yellow-50 p-6 rounded shadow-sm border border-yellow-100"
              placeholder="Start typing..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <FiFileText size={64} className="mb-4 text-gray-300" />
              <p className="text-lg">Select a note to view or edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
