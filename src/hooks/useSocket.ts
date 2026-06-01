"use client";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";

type NotificationHandler = (data: {
  message: string;
  appointmentId?: string;
  status?: string;
  pdfUrl?: string;
}) => void;

export function useSocket(onNotification: NotificationHandler) {
  const socketRef = useRef<Socket | null>(null);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(baseUrl, {
      auth: { token: accessToken },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("notification:appointment", onNotification);
    socket.on("notification:prescription", onNotification);

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken, onNotification]);

  return socketRef;
}
