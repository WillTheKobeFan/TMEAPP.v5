// src/constants/routes.ts 

export const routes = {
  home: "/",


  search: "/search",

  searchLeague: (
    league: string
  ) => `/search/${league}`,


  schedule: (
    league: string
  ) => `/schedule/${league}`,

  results: (
    league: string
  ) => `/schedule/results/${league}`,


  standings: (
    league: string
  ) => `/standings/${league}`,

  playoffBracket: (
    league: string
  ) => `/standings/playoffBracket/${league}`,

  seasonPicture: (
    league: string
  ) => `/standings/seasonPicture/${league}`,


  champs: (
    league: string
  ) => `/champs/${league}`,

  updates: (
    league: string
  ) => `/updates/${league}`,

  updatePost: (
    id: string
  ) => `/updates/post/${id}`,

  leagueInfo: (
    league: string
  ) => `/league-info/${league}`,


  settings: "/settings",

  contact: "/contact",

  faq: "/faq",
};