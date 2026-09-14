import { DragEvent, FormEvent, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, GripVertical, Menu, Plus, Save, Trash2, X } from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  description: string;
  reason: string;
  participants: string;
  organizer: string;
  steps: string;
  invite: string;
  month: number;
  day: number;
};

type FormState = Omit<EventItem, "id" | "month" | "day">;

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const initialForm: FormState = { title: "", description: "", reason: "", participants: "", organizer: "", steps: "", invite: "" };

const starterEvents: EventItem[] = [
  { id: "1", title: "Founders breakfast", description: "A focused morning for members to meet and share ideas.", reason: "Build stronger connections early in the year.", participants: "Founders and club members", organizer: "Community team", steps: "Confirm venue; send invitations; prepare talking points", invite: "Maria, James, Aisha", month: 0, day: 8 },
  { id: "2", title: "Annual summit", description: "The main strategy and networking event for the club.", reason: "Align members around this year's priorities.", participants: "All active members", organizer: "Executive committee", steps: "Book venue; confirm speakers; publish agenda", invite: "Board and speaker team", month: 2, day: 18 },
  { id: "3", title: "Capital circle", description: "A small roundtable about funding and growth.", reason: "Help members learn from practical experience.", participants: "Business owners and investors", organizer: "Partnerships team", steps: "Select guests; prepare questions; send calendar hold", invite: "Investor relations", month: 5, day: 12 },
];

function emptyDays() {
  return Array.from({ length: 30 }, (_, index) => index + 1);
}

export default function Home() {
  const [month, setMonth] = useState(0);
  const [events, setEvents] = useState<EventItem[]>(starterEvents);
  const [form, setForm] = useState<FormState>(initialForm);
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notice, setNotice] = useState("");
  const [draggedEvent, setDraggedEvent] = useState<EventItem | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const libraryEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return events.filter((event) => !query || `${event.title} ${event.description} ${event.organizer}`.toLowerCase().includes(query));
  }, [events, search]);

  const monthEvents = events.filter((event) => event.month === month);

  function notify(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2300);
  }

  function updateForm(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function saveEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title.trim()) {
      notify("Please add an event title first.");
      return;
    }
    const newEvent: EventItem = { ...form, id: `event-${Date.now()}`, month, day: 1 };
    setEvents((current) => [...current, newEvent]);
    setForm(initialForm);
    notify("Event saved. Drag its small card onto a day box.");
  }

  function startDrag(event: DragEvent<HTMLElement>, item: EventItem) {
    setDraggedEvent(item);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", item.id);
  }

  function dropOnDay(event: DragEvent<HTMLDivElement>, day: number) {
    event.preventDefault();
    if (!draggedEvent) return;
    setEvents((current) => current.map((item) => item.id === draggedEvent.id ? { ...item, month, day } : item));
    notify(`${draggedEvent.title} placed on ${months[month]} ${day}.`);
    setDraggedEvent(null);
  }

  function deleteEvent() {
    if (!selectedEvent) return;
    setEvents((current) => current.filter((item) => item.id !== selectedEvent.id));
    notify("Event removed from the planner.");
    setSelectedEvent(null);
  }

  function changeMonth(amount: number) {
    setMonth((current) => (current + amount + 12) % 12);
    setSelectedEvent(null);
  }

  return (
    <div className="planner-app">
      <header className="topbar">
        <div className="brand"><CalendarDays size={21} /><div><strong>Business Club</strong><span>Annual event planner</span></div></div>
        <div className="topbar-title">Annual planner · 2026</div>
        <div className="topbar-actions"><button className="icon-btn mobile-menu" onClick={() => setIsSidebarOpen((value) => !value)} aria-label="Toggle sidebar"><Menu size={19} /></button><button className="save-btn" onClick={() => notify("Planner saved on this device.")}><Save size={15} /> Save</button></div>
      </header>

      <div className="app-body">
        <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-heading"><div><span className="label">Create event</span><h1>Event details</h1></div><button className="icon-btn collapse-btn" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar"><X size={17} /></button></div>
          <p className="helper">Fill in the details, save the event, then drag its card into a day on the calendar.</p>
          <form className="event-form" onSubmit={saveEvent}>
            <label>Event title<input value={form.title} onChange={(e) => updateForm("title", e.target.value)} placeholder="e.g. Member breakfast" /></label>
            <label>Description<textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="What is this event about?" rows={3} /></label>
            <label>Reason for event<textarea value={form.reason} onChange={(e) => updateForm("reason", e.target.value)} placeholder="Why are we doing it?" rows={2} /></label>
            <label>Who will participate?<input value={form.participants} onChange={(e) => updateForm("participants", e.target.value)} placeholder="e.g. Club members" /></label>
            <label>Who will organize the event?<input value={form.organizer} onChange={(e) => updateForm("organizer", e.target.value)} placeholder="e.g. Community team" /></label>
            <label>Which steps should be taken before?<textarea value={form.steps} onChange={(e) => updateForm("steps", e.target.value)} placeholder="e.g. Book venue; send invites" rows={3} /></label>
            <label>Who is called?<input value={form.invite} onChange={(e) => updateForm("invite", e.target.value)} placeholder="Names or team to contact" /></label>
            <button className="save-event" type="submit"><Plus size={16} /> Save event</button>
          </form>
          <div className="library-header"><div><span className="label">Saved events</span><strong>Drag to a day</strong></div><span className="count">{events.length}</span></div>
          <input className="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search saved events" />
          <div className="library-list">
            {libraryEvents.map((item) => <div key={item.id} className="library-card" draggable onDragStart={(e) => startDrag(e, item)} onClick={() => setSelectedEvent(item)}><div className="library-card-top"><strong>{item.title}</strong><GripVertical size={15} /></div><span>{item.organizer || "Organizer not set"}</span><small>{item.month === month && item.day ? `${months[item.month]} ${item.day}` : "Not placed yet"}</small></div>)}
            {!libraryEvents.length && <div className="empty">No saved events found.</div>}
          </div>
        </aside>

        <main className="main-content">
          <div className="page-heading"><div><span className="label">Business club · 2026</span><h2>Plan one month at a time.</h2><p>Use the 30 day boxes below to place each event exactly where it belongs.</p></div><div className="month-switcher"><button className="month-arrow" onClick={() => changeMonth(-1)} aria-label="Previous month"><ArrowLeft size={18} /></button><div><span>Current month</span><strong>{months[month]}</strong></div><button className="month-arrow" onClick={() => changeMonth(1)} aria-label="Next month"><ArrowRight size={18} /></button></div></div>
          <section className="calendar-card">
            <div className="calendar-header"><div><span className="label">Monthly calendar</span><h3>{months[month]} 2026</h3></div><div className="calendar-note">{monthEvents.length} event{monthEvents.length === 1 ? "" : "s"} placed</div></div>
            <div className="weekday-row">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <span key={day}>{day}</span>)}</div>
            <div className="day-grid">{emptyDays().map((day) => { const dayEvents = monthEvents.filter((item) => item.day === day); return <div key={day} className={`day-box ${dayEvents.length ? "has-event" : ""}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => dropOnDay(e, day)}><div className="day-number">{day}</div>{dayEvents.map((item) => <button key={item.id} className="day-event" onClick={() => setSelectedEvent(item)} draggable onDragStart={(e) => startDrag(e, item)}><span className="event-dot" /><strong>{item.title}</strong><GripVertical size={12} /></button>)}{!dayEvents.length && <span className="drop-text">Drop here</span>}</div>; })}</div>
            <div className="calendar-footer"><span>Drag a saved event card onto any day box.</span><span>30 days · {months[month]}</span></div>
          </section>
          <section className="details-panel">{selectedEvent ? <><div className="details-title"><div><span className="label">Selected event</span><h3>{selectedEvent.title}</h3></div><div className="details-actions"><button className="delete-btn" onClick={deleteEvent}><Trash2 size={15} /> Delete</button><button className="icon-btn" onClick={() => setSelectedEvent(null)} aria-label="Close details"><X size={17} /></button></div></div><div className="detail-grid"><div><span>Description</span><p>{selectedEvent.description || "—"}</p></div><div><span>Reason</span><p>{selectedEvent.reason || "—"}</p></div><div><span>Participants</span><p>{selectedEvent.participants || "—"}</p></div><div><span>Organizer</span><p>{selectedEvent.organizer || "—"}</p></div><div><span>Steps before the event</span><p>{selectedEvent.steps || "—"}</p></div><div><span>Who is called</span><p>{selectedEvent.invite || "—"}</p></div></div></> : <div className="details-empty"><Check size={18} /><div><strong>Event details</strong><p>Click a saved event to see its full information here.</p></div></div>}</section>
        </main>
      </div>
      {notice && <div className="toast"><Check size={15} /> {notice}</div>}
    </div>
  );
}
