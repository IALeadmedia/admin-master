import axios from "axios";

// Chat
export const apiUberich = axios.create({
  baseURL: "https://evolution.bigdates.com.br:3300",
  headers: {
    "Content-Type": "application/json",
    "x-flowise-token":
      "ff52c550a19a84ce0de929b75874ef8bbd503eeffdaeb324cdb7da0c7f4cd819cfb760c07b0e2578197fc3934c13df24",
  },
});

export const apiEvolution = axios.create({
  baseURL: "https://evolution.bigdates.com.br:3000/evolution/relay",
  headers: {
    "Content-Type": "application/json",
    "x-flowise-token":
      "ff52c550a19a84ce0de929b75874ef8bbd503eeffdaeb324cdb7da0c7f4cd819cfb760c07b0e2578197fc3934c13df24",
  },
});
