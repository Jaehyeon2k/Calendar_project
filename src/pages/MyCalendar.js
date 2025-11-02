import { useAuth } from "../contexts/AuthContext";
import CalendarList from "../components/CalendarList";
import EventForm from "../components/EventForm";
import { useState } from "react";

export default function MyCalendar() {
  const { user } = useAuth();
  const [tick, setTick] = useState(0);
  return (
    <section>
      <h2>내 일정</h2>
      <EventForm
        scope="PERSONAL"
        initial={{ userId: user?.id }}
        onSaved={() => setTick((t) => t + 1)}
      />
      <CalendarList
        filter={{ scope: "PERSONAL", userId: user?.id, _tick: tick }}
      />
    </section>
  );
}
