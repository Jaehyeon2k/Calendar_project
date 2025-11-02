import { useParams } from "react-router-dom";
import CalendarList from "../components/CalendarList";
import EventForm from "../components/EventForm";
import { useState } from "react";

export default function DeptCalendar() {
  const { deptId } = useParams();
  const [tick, setTick] = useState(0);
  return (
    <section>
      <h2>학과 일정</h2>
      <EventForm
        scope="DEPT"
        deptId={Number(deptId)}
        onSaved={() => setTick((t) => t + 1)}
      />
      <CalendarList
        filter={{ scope: "DEPT", deptId: Number(deptId), _tick: tick }}
      />
    </section>
  );
}
