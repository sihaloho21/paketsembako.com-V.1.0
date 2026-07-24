import { useEffect } from "react";
import { useUserId } from "./use-user-id";
import * as gasApi from "@/lib/gas-api";

/**
 * Hook untuk auto-register user baru saat aplikasi pertama kali dibuka
 */
export function useAutoRegister() {
  const { userId, isLoaded } = useUserId();

  useEffect(() => {
    if (!isLoaded || !userId) return;

    const registerUser = async () => {
      try {
        const result = await gasApi.initializeUser(userId, `User ${userId}`, "");
        console.log("User initialization result:", result);
      } catch (error) {
        console.error("Failed to initialize user:", error);
        // Jangan throw error, biarkan aplikasi tetap berjalan
      }
    };

    registerUser();
  }, [userId, isLoaded]);
}
