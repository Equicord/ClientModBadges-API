import axios from "axios";

import * as utils from "./utils.mjs";
const { addUser, CLIENT_MODS } = utils;
const badgeFile = "https://nekocord.dev/assets/badges.json";
let attempts = 1;

const getNekocordBadges = async () => {
    try {
        const { data } = await axios.get(badgeFile, { headers: { "Cache-Control": "no-cache" } });

        const entries = Object.entries(data.users).map(([key, value]) => ({
            id: key,
            name: value.badges.map((type) => ({ name: data.badges[type].name, badge: data.badges[type].image })),
        }));

        entries.forEach(entry => addUser(entry.id, CLIENT_MODS.NEKOCORD, entry.name));
    } catch (e) {
        if (attempts++ > 4) console.error("Failed to get Nekocord badges after 5 attempts", e);
        else setTimeout(getNekocordBadges, 500);
    }
};

getNekocordBadges();