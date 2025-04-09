export const baseUrl = () => {
  let url: string = "";
  if (process.env.NODE_ENV === "production") {
    url = process.env.NEXT_VERCEL_URL || process.env.VERCEL_URL || "";
  } else if (process.env.NODE_ENV === "development") {
    url = "http://localhost:3000";
  }
  return url;
};
