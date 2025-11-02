import { useEffect, useState } from "react";
import dayjs from "dayjs";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import EventForm from "./EventForm";

export default function CalendarList({ filter }) {
  const [events, setEvents] = useState([]);

  const load = async () => {
    const params = { _sort: "start", _order: "asc", ...filter };
    const { data } = await api.get("/events", { params });
    setEvents(data);
  };
  useEffect(() => {
    load();
  }, [JSON.stringify(filter)]);

  return (
    <div className="cards">
      {events.map((ev) => (
        <EventCard key={ev.id} ev={ev} onChanged={load} />
      ))}
      {events.length === 0 && <p className="empty">표시할 일정이 없습니다.</p>}
    </div>
  );
}

function EventCard({ ev, onChanged }) {
  const { user } = useAuth();
  const canModify = () => {
    if (!user) return false;
    if (ev.scope === "SCHOOL") return user.role === "ADMIN"; // 전체 학사: 관리자만
    if (ev.scope === "DEPT") return true || user.role === "ADMIN"; // 학과: 지금은 모두 허용(원하면 제한 가능)
    if (ev.scope === "PERSONAL")
      return user.role === "ADMIN" || user.id === ev.userId; // 개인: 본인 or 관리자
    return false;
  };
  const del = async () => {
    try {
      if (!canModify()) {
        alert("삭제 권한이 없습니다.");
        return;
      }
      if (!ev?.id && ev?.id !== 0) {
        alert("이 일정의 ID가 없어 삭제할 수 없습니다.");
        console.error("Delete ID missing:", ev);
        return;
      }
      await api.delete(`/events/${encodeURIComponent(ev.id)}`);
      await onChanged?.();
    } catch (err) {
      console.error("DELETE failed:", err?.response?.config?.url, err);
      alert(`삭제 실패: ${err?.response?.status || ""} ${err?.message}`);
    }
  };
  return (
    <article className="card">
      <h3>{ev.title}</h3>
      <p className="time">
        {dayjs(ev.start).format("YYYY.MM.DD")} ~{" "}
        {dayjs(ev.end).format("YYYY.MM.DD")}
      </p>
      {ev.description && <p className="desc">{ev.description}</p>}
      {canModify() && (
        <div className="actions">
          <EventForm mode="edit" initial={ev} onSaved={onChanged} />
          <button onClick={del}>삭제</button>
        </div>
      )}
    </article>
  );
}
