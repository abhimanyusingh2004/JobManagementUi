// src/utils/userCache.js
const userCache = {};

/**
 * Fetch user name by ID from API.
 * Returns cached name if available.
 */
export const fetchUserName = async (userId) => {
  if (userCache[userId]) return userCache[userId];

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `https://localhost:7204/api/User/id-name?id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch user");

    const users = await res.json(); // [{ userId: 1, userName: "Pawan" }, ...]
    const user = users.find((u) => u.userId === userId);
    const name = user?.userName || "Unknown";

    userCache[userId] = name;
    return name;
  } catch (err) {
    console.error("fetchUserName error:", err);
    return "Unknown";
  }
};