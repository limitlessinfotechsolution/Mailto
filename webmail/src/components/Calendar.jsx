import { useState, useEffect, useCallback } from 'react';
import { getEvents, createEvent } from '../api';
import { FiCalendar, FiPlus, FiClock, FiMapPin, FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', location: '', description: '' });

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEvents();
      // Sort events by start date
      const sorted = res.data.sort((a, b) => new Date(a.start) - new Date(b.start));
      setEvents(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(newEvent);
      setNewEvent({ title: '', start: '', end: '', location: '', description: '' });
      setIsCreating(false);
      loadEvents();
    } catch (err) {
      console.error(err);
      alert('Failed to create event');
    }
  };

  const groupEventsByDate = () => {
    const groups = {};
    events.forEach(event => {
      const date = new Date(event.start).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      if (!groups[date]) groups[date] = [];
      groups[date].push(event);
    });
    return groups;
  };

  const eventGroups = groupEventsByDate();

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-white flex-col">
      {/* Toolbar */}
      <div className="h-10 border-b border-gray-200 flex items-center px-4 bg-gray-50 justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-700">Calendar</span>
          <div className="h-4 w-px bg-gray-300"></div>
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <FiPlus size={16} /> New Event
          </button>
        </div>
        <div className="flex items-center gap-2">
           <button className="text-gray-500 hover:text-gray-700"><FiChevronLeft /></button>
           <span className="text-sm font-medium text-gray-600">Today</span>
           <button className="text-gray-500 hover:text-gray-700"><FiChevronRight /></button>
           <div className="h-4 w-px bg-gray-300 mx-2"></div>
           <button onClick={loadEvents} className="text-gray-500 hover:text-gray-700" title="Refresh">
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        {isCreating && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow border border-blue-100 max-w-2xl mx-auto animate-fade-in">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
              <FiCalendar className="text-blue-500" /> New Event
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  required
                  placeholder="Meeting with..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                  <input
                    type="datetime-local"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newEvent.start}
                    onChange={e => setNewEvent({...newEvent, start: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
                  <input
                    type="datetime-local"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newEvent.end}
                    onChange={e => setNewEvent({...newEvent, end: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-6">
          {Object.keys(eventGroups).length === 0 && !loading && !isCreating && (
             <div className="text-center py-20 text-gray-400">
               <FiCalendar size={64} className="mx-auto mb-4 text-gray-300" />
               <p className="text-lg">No upcoming events</p>
               <button onClick={() => setIsCreating(true)} className="mt-4 text-blue-600 hover:underline">Create one</button>
             </div>
          )}

          {Object.entries(eventGroups).map(([date, groupEvents]) => (
            <div key={date}>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 sticky top-0 bg-gray-50 py-2 z-10">
                {date}
              </h4>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {groupEvents.map((event, idx) => (
                  <div key={event._id} className={`p-4 flex gap-4 hover:bg-gray-50 ${idx !== groupEvents.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex flex-col items-center min-w-[60px] text-gray-600">
                      <span className="text-xs font-medium">{new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      <div className="h-full w-px bg-gray-200 my-1"></div>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-800 text-lg">{event.title}</h5>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><FiClock size={14} /> {new Date(event.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        {event.location && <span className="flex items-center gap-1"><FiMapPin size={14} /> {event.location}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
