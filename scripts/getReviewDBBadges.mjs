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

        const results = [];


        for (const badge of donorData) {
            const badgesArray = badge.map(({ name, icon }) => ({
                name: name,
                badge: icon,
            }));

            results.push({
                discordID,
                badges: badgesArray,
            });
        };

        let users = [...results];

        users = users.reduce((acc, user) => {
            const existingUser = acc.find(u => u.id === user.id);
            if (existingUser)
                existingUser.badges = [...existingUser.badges, ...user.badges];
            else acc.push(user);
            return acc;
        }, []);

        users.forEach(user => addUser(user.id, CLIENT_MODS.REVIEWDB, user.badges));
        console.log(users);
    } catch (e) {
        if (attempts++ > 4)
            console.error("Failed to get Review DB badges after 5 attempts", e);
        else setTimeout(getReviewDBBadges, 500);
    }
};

getReviewDBBadges();
