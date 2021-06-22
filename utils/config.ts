const config = {
  routes: {
    home: '/',
    user: '/user',
    auth: '/auth',
    dashboard: '/dashboard',
  },
  collections: {
    mail: '/mail',
    users: '/users',
    user: (userId: string) => `/users/${userId}`,
    userBoards: (userId: string) => `/users/${userId}/boards`,
    boardMetadata: (userId: string, boardId: string) =>
      `/users/${userId}/boards/${boardId}`,
    boardData: (boardId: string) => `/boardData/${boardId}`,
  },
  env: {
    sendGridApiKey: process.env.SENDGRID_API_KEY,
  },
};

export default config;
