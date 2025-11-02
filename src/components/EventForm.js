import { useState } from "react";
import api from "../services/api";
import dayjs from "dayjs";

export default function EventForm({
  mode = "create",
  initial = {},
  scope = "SCHOOL",
  deptId = null,
  onSaved,
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: initial.title || "",
    start: initial.start || dayjs().format("YYYY-MM-DD"),
    end: initial.end || dayjs().add(1, "day").format("YYYY-MM-DD"),
    description: initial.description || "",
  });

  const submit = async (e) => {
    e.preventDefault();
    // SCHOOL(전체 학사)은 관리자만 생성/수정 허용
    const user = JSON.parse(localStorage.getItem("yju_user") || "null");
    if (scope === "SCHOOL" && user?.role !== "ADMIN") {
      alert("관리자만 변경할 수 있습니다.");
      return;
    }
    const payload = { ...initial, ...form, scope, deptId };
    if (mode === "edit") await api.put(`/events/${initial.id}`, payload);
    else await api.post("/events", payload);
    setOpen(false);
    onSaved?.();
  };

  return (
    <>
      <button onClick={() => setOpen((v) => !v)}>
        {mode === "edit" ? "수정" : "일정 추가"}
      </button>
      {open && (
        <form className="editor" onSubmit={submit}>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="제목"
            required
          />
          <div className="row">
            <input
              type="date"
              value={form.start}
              onChange={(e) =>
                setForm((f) => ({ ...f, start: e.target.value }))
              }
            />
            <input
              type="date"
              value={form.end}
              onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))}
            />
          </div>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="설명(선택)"
          />
          <button type="submit">{mode === "edit" ? "저장" : "추가"}</button>
        </form>
      )}
    </>
  );
}
