import CalendarList from "../components/CalendarList";
import EventForm from "../components/EventForm";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [tick, setTick] = useState(0);

  return (
    <section>
      <h2>학교 전체 학사일정</h2>

      {user?.role === "ADMIN" && (
        <EventForm scope="SCHOOL" onSaved={() => setTick((t) => t + 1)} />
      )}
      {/* tick을 filter에 섞어 넣어주면 CalendarList가 의존성 변화로 재로딩됨 */}
      <CalendarList filter={{ scope: "SCHOOL", _tick: tick }} />
    </section>
  );
}
