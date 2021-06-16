const config = {
  routes: {
    home: "/",
    auth: "/auth",
    dashboard: "/dashboard",
  },
  collections: {
    mail: "mail",
  },
  env: {
    sendGridApiKey: process.env.SENDGRID_API_KEY,
  },
};

export default config;
