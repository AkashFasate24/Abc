import { useState } from "react";
import axios from "axios";

function App() {
  const [subject, setSubject] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [attendees, setAttendees] = useState("");
  const [meeting, setMeeting] = useState(null);

  const scheduleMeeting = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/meetings", {
        subject,
        startDateTime: start,
        endDateTime: end,
        attendees: attendees.split(",").map((a) => a.trim()),
      });
      setMeeting(res.data);
    } catch (err) {
      console.error(err);
      alert("Error scheduling meeting");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📅 Schedule Teams Meeting</h1>
      <div>
        <input
          type="text"
          placeholder="Meeting Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </div>
      <div>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Attendees (comma-separated emails)"
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
        />
      </div>
      <button onClick={scheduleMeeting}>Schedule Meeting</button>

      {meeting && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd" }}>
          <h2>✅ Meeting Scheduled!</h2>
          <p>Subject: {meeting.subject}</p>
          <p>Start: {meeting.startDateTime}</p>
          <p>End: {meeting.endDateTime}</p>
          <a href={meeting.joinUrl} target="_blank" rel="noreferrer">
            Join Meeting
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
