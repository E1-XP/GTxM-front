export default {
  API_URL:
    process.env.NODE_ENV === "production"
      ? "https://gtxmotorsports.gtxcodeworks.com.pl"
      : "http://localhost:3001",
  API_URL_ORIGIN: "https://gtxmotorsports.gtxcodeworks.com.pl",
};
