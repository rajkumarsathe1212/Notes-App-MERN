
export const formatDate = (date) => {
  if (!date) return "";

  const currentDate = new Date();
  const targetDate = new Date(date);

  const diffInSeconds = Math.floor(
    (currentDate - targetDate) / 1000
  );

  if (diffInSeconds < 60) {
    return "Just now";
  }

  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  }

  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  if (diffInSeconds < 172800) {
    return "Yesterday";
  }

  return targetDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
