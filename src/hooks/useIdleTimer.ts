import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function useIdleTimer(timeoutMs: number = 30 * 60 * 1000) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleIdle = useCallback(async () => {
    if (user) {
      await logout();
      navigate("/login?reason=idle");
    }
  }, [logout, user, navigate]);

  useEffect(() => {
    if (!user) return;

    let timer: any;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(handleIdle, timeoutMs);
    };

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, handleIdle, timeoutMs]);
}
