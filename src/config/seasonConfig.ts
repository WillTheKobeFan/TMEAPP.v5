// src/config/seasonConfig

export const SEASON_CONFIG: Record<
  string,
  {
    regularWeeks: number;
    playoffs: {
      quarterfinals: number[];
      semifinals: number[];
      championship: number[];
    };
  }
> = {
  sun: {
    regularWeeks: 10,
    playoffs: {
      quarterfinals: [11],
      semifinals: [12],
      championship: [],
    },
  },

  mon: {
    regularWeeks: 9,
    playoffs: {
      quarterfinals: [],
      semifinals: [10],
      championship: [11],
    },
  },

  wed: {
    regularWeeks: 9,
    playoffs: {
      quarterfinals: [],
      semifinals: [10],
      championship: [11],
    },
  },

  tue: {
    regularWeeks: 9,
    playoffs: {
      quarterfinals: [],
      semifinals: [10],
      championship: [11],
    },
  },
};