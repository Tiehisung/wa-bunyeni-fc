 
import _players from "./players";

export const _playerStats  = [
  {
    featuredPlayer: {
      ..._players[2],

      statsValue: "10",
    },
    otherPlayers: [
      {
        ..._players[1],

        statsValue: "4",
      },
      {
        ..._players[3],

        statsValue: "4",
      },
      {
        ..._players[0],

        statsValue: "3",
      },
    ],
    alias: "Goals",
    title: "Goals",
  },
  {
    featuredPlayer: {
      ..._players[2],

      statsValue: "10",
    },
    otherPlayers: [
      {
        ..._players[1],

        statsValue: "4",
      },
      {
        ..._players[3],

        statsValue: "4",
      },
      {
        ..._players[0],

        statsValue: "3",
      },
    ],
    alias: "Assists",
    title: "Assists",
  },
  {
    featuredPlayer: {
      ..._players[0],

      statsValue: "25",
    },
    otherPlayers: [
      {
        ..._players[1],

        statsValue: "14",
      },
      {
        ..._players[3],

        statsValue: "11",
      },
      {
        ..._players[0],

        statsValue: "3",
      },
    ],
    alias: "Dribles",
    title: "Dribbles completed",
  },
];
