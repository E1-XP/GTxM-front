export default {
  API_URL:
    process.env.NODE_ENV === "production"
      ? `${window.location.origin}/api`
      : "https://gtxmotorsports.gtxcodeworks.site",
  API_URL_ORIGIN: "https://gtxmotorsports.gtxcodeworks.site",
};
