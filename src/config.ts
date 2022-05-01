export default {
  API_URL:
    process.env.NODE_ENV === "production"
      ? "https://gtxmotorsports.gtxcodeworks.site"
      : "http://localhost:3001",
  API_URL_ORIGIN: "https://gtxmotorsports.gtxcodeworks.site",
};
