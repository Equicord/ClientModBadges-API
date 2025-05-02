import axios from "axios";

import * as utils from "./utils.mjs";

const { addUser, CLIENT_MODS } = utils;

let attempts = 1;

const getReviewDBBadges = async () => {
    try {
        const { data: donorData } = await axios.get(
            "https://manti.vendicated.dev/api/reviewdb/badges",
            { headers: { "Cache-Control": "no-cache" } }
        );

        const userMap = new Map();

        for (const badge of donorData) {
            if (!userMap.has(badge.discordID)) {
                userMap.set(badge.discordID, []);
            }

            userMap.get(badge.discordID).push({
                tooltip: badge.name,
                badge: badge.icon,
            });
        }

        const results = [...userMap.entries()].map(([id, badges]) => ({
            id,
            badges,
        }));

        results.forEach(user => addUser(user.id, CLIENT_MODS.REVIEWDB, user.badges));
        console.log(results);
    } catch (e) {
        if (attempts++ > 4)
            console.error("Failed to get Review DB badges after 5 attempts", e);
        else setTimeout(getReviewDBBadges, 500);
    }
};


getReviewDBBadges();