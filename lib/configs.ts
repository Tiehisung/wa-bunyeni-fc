 export const baseUrl = process.env.NEXT_PUBLIC_API_URL

export const apiConfig = {
  base: `${baseUrl}`,
  features: `${baseUrl}/features`,
  users: `${baseUrl}/users`,
  auth: `${baseUrl}/auth`,
  signin: `${baseUrl}/auth/signin`,
  credentialSignin: `${baseUrl}/auth/credentials`,
  signout: `${baseUrl}/auth/signout`,
  logout: `${baseUrl}/auth/users/logout`,
  sponsors: `${baseUrl}/sponsors`,
  docs: `${baseUrl}/documents`,
  moveCopyDoc: `${baseUrl}/documents/move-copy`,

  teams: `${baseUrl}/teams`,

  matches: `${baseUrl}/matches`,
  goals: `${baseUrl}/goals`,
  cards: `${baseUrl}/cards`,
  mvps: `${baseUrl}/mvps`,
  injuries: `${baseUrl}/injuries`,

  players: `${baseUrl}/players`,
  trainingSession: `${baseUrl}/training`,

  managers: `${baseUrl}/managers`,

  captains: `${baseUrl}/captains`,
  currentCaptains: `${baseUrl}/captains/current`,

  galleries: `${baseUrl}/galleries`,

  messages: `${baseUrl}/messages`,
  transactions: `${baseUrl}/finance/transactions`,
  news: `${baseUrl}/news`,
  squad: `${baseUrl}/squad`,

  fileUpload: `${baseUrl}/file/cloudinary`,
  file: `${baseUrl}/file`,
  highlights: `${baseUrl}/highlights`,
};