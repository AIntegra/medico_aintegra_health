// src/context/KaiEventContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const KaiEventContext = createContext();

export const KaiEventProvider = ({ children }) => {
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem("evolution-calendar");
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem("evolution-calendar", JSON.stringify(events));
  }, [events]);

  const addEvent = (date, data) => {
    setEvents((prev) => ({
      ...prev,
      [date]: { ...(prev[date] || {}), ...data },
    }));
  };

  const deleteEvent = (date) => {
    setEvents((prev) => {
      const updated = { ...prev };
      delete updated[date];
      return updated;
    });
  };

  const listUpcomingEvents = () => {
    const sorted = Object.entries(events)
      .map(([fecha, d]) => ({ fecha, ...d }))
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .filter((e) => new Date(e.fecha) >= new Date());
    return sorted;
  };

  return (
    <KaiEventContext.Provider
      value={{ events,setEvents, addEvent, deleteEvent, listUpcomingEvents }}
    >
      {children}
    </KaiEventContext.Provider>
  );
};
