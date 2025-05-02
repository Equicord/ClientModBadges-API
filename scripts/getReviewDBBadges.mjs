import axios from "axios";

import * as utils from "./utils.mjs";

const { addUser, CLIENT_MODS } = utils;

let attempts = 1;


const getReviewDBBadges = async () => {
    try {
        const { data: rawBadges } = await axios.get(
            "https://manti.vendicated.dev/api/reviewdb/badges",
            { headers: { "Cache-Control": "no-cache" } }
        );

        const donorData = {};

        for (const { discordID, name, icon } of rawBadges) {
            if (!donorData[discordID]) {
                donorData[discordID] = [];
            }
            donorData[discordID].push({ name, icon });
        }

        const donors = Object.entries(donorData).map(([discordID, badges]) => {
            const badgesArray = badges.map(({ name, icon }) => ({
                name,
                badge: icon,
            }));

            return {
                discordID,
                badges: badgesArray,
            };
        });

        let users = [...donors];

        users = users.reduce((acc, user) => {
            const existingUser = acc.find(u => u.discordID === user.discordID);
            if (existingUser)
                existingUser.badges = [...existingUser.badges, ...user.badges];
            else acc.push(user);
            return acc;
        }, []);

        users.forEach(user => addUser(user.discordID, CLIENT_MODS.REVIEWDB, user.badges));
        console.log(users);
    } catch (e) {
        if (attempts++ > 4)
            console.error("Failed to get Review DB badges after 5 attempts", e);
        else setTimeout(getReviewDBBadges, 500);
    }
};

getReviewDBBadges();