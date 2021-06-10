const config = {
  routes: {
    home: "/",
    auth: "/auth",
    boards: "/boards",
  },
  collections: {
    mail: "mail",
  },
  env: {
    sendGridApiKey: process.env.SENDGRID_API_KEY,
  },
};

export default config;
