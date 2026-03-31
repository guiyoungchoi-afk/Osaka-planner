"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import {
  FaHotel,
  FaUtensils,
  FaPlane,
  FaShoppingBag,
  FaLandmark,
  FaSmile,
  FaBus,
  FaBed,
  FaCoffee,
} from "react-icons/fa";

export default function Home() {
  const dates = [
    "2026-05-24",
    "2026-05-25",
    "2026-05-26",
    "2026-05-27",
    "2026-05-28",
    "2026-05-29",
    "2026-05-30",
    "2026-05-31",
  ];

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<
    Array<{
      id: string;
      date: string;
      title: string;
      type: string;
      time: string;
      location?: string;
    }>
  >([]);

  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("activity");
  const [newTime, setNewTime] = useState("12:00");
  const [newLocation, setNewLocation] = useState("");

  const iconForType = (type: string) => {
    switch (type) {
      case "lodging":
        return <FaHotel color="#3f51b5" />;
      case "food":
        return <FaUtensils color="#e91e63" />;
      case "travel":
        return <FaPlane color="#009688" />;
      case "shopping":
        return <FaShoppingBag color="#ff9800" />;
      case "sightseeing":
        return <FaLandmark color="#4caf50" />;
      case "activity":
        return <FaSmile color="#9c27b0" />;
      case "transport":
        return <FaBus color="#795548" />;
      case "checkin":
        return <FaBed color="#673ab7" />;
      case "rest":
        return <FaCoffee color="#607d8b" />;
      default:
        return <FaSmile />;
    }
  };

  const addSchedule = () => {
    if (!selectedDate) return;
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) return;

    const payload = {
      date: selectedDate,
      title: trimmedTitle,
      type: newType,
      time: newTime,
      location: newType === "food" ? newLocation.trim() : "",
    };

    (async () => {
      const ref = await addDoc(collection(db, "schedules"), payload);
      setSchedules((prev) => [...prev, { id: ref.id, ...payload }]);
      setNewTitle("");
      setNewLocation("");
    })();
  };

  const removeSchedule = (id: string) => {
    (async () => {
      await deleteDoc(doc(db, "schedules", id));
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    })();
  };

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, "schedules"));
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as {
          date: string;
          title: string;
          type: string;
          time: string;
          location?: string;
        }),
      }));
      setSchedules(data);
    })();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>조씨네 오사카 여행기</h1>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {dates.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "1rem",
              borderRadius: "12px",
              backgroundColor: "#fce4ec",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              {date}
            </span>
          </button>
        ))}
      </div>

      {selectedDate && (
        <div style={{ marginTop: "2rem" }}>
          <h2>{selectedDate} 일정</h2>

          {/* 일정 추가 폼 */}
          <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="일정 제목"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            >
              <option value="lodging">숙소</option>
              <option value="food">식사</option>
              <option value="travel">여행</option>
              <option value="shopping">쇼핑</option>
              <option value="sightseeing">관광</option>
              <option value="activity">활동</option>
              <option value="transport">교통</option>
              <option value="checkin">체크인/체크아웃</option>
              <option value="rest">휴식</option>
            </select>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
            {newType === "food" && (
              <input
                type="text"
                placeholder="음식점 이름"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />
            )}
            <button onClick={addSchedule}>추가</button>
          </div>

          {/* 일정 목록 */}
          <ul>
            {schedules
              .filter((s) => s.date === selectedDate)
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((s) => (
                <li
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.4rem",
                  }}
                >
                  {iconForType(s.type)}
                  <span>
                    {s.time} - {s.title}
                  </span>
                  {s.type === "food" && s.location && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        s.location
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#2196f3",
                        textDecoration: "underline",
                      }}
                    >
                      {s.location} (지도 보기)
                    </a>
                  )}
                  <button onClick={() => removeSchedule(s.id)}>삭제</button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
