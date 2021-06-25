const config = {
  routes: {
    home: '/',
    user: '/user',
    auth: '/auth',
    dashboard: '/dashboard',
    goToBoard: (id: string) => `/board/${id}`,
  },
  collections: {
    mail: '/mail',
    users: '/users',
    user: (userId: string) => `/users/${userId}`,
    userWorkedTimes: (userId: string) => `/workedTime/${userId}`,
    userWorkTimeYesterday: (userId: string, dateIsoString: string) =>
      `/workedTime/${userId}/${dateIsoString}`,
    userTodos: (userId: string) => `/users/${userId}/todos`,
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
