import { useEffect, useState } from "react";

const USER_ID_KEY = "hypermart_user_id";
const DEFAULT_USER_ID = "user-1";

/**
 * Custom hook untuk mengelola User ID dari localStorage
 * Jika belum ada, akan menggunakan default dan menyimpannya
 */
export function useUserId() {
  const [userId, setUserId] = useState<string>(DEFAULT_USER_ID);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load dari localStorage saat component mount
    const storedUserId = localStorage.getItem(USER_ID_KEY);
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Jika tidak ada, simpan default
      localStorage.setItem(USER_ID_KEY, DEFAULT_USER_ID);
      setUserId(DEFAULT_USER_ID);
    }
    setIsLoaded(true);
  }, []);

  const updateUserId = (newUserId: string) => {
    localStorage.setItem(USER_ID_KEY, newUserId);
    setUserId(newUserId);
  };

  return { userId, setUserId: updateUserId, isLoaded };
}
