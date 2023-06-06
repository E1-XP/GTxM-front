export default {
  API_URL:
    process.env.NODE_ENV === "production"
      ? `${window.location.origin}/api`
      : "http://localhost:3001",
  API_URL_ORIGIN: "https://gtxmotorsports.gtxcodeworks.online",
};
