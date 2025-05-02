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

        const donors = Object.entries(donorData).map((name, icon, id) => {
            const badgesArray = ({
                name: name,
                badge: icon,
            });

            return {
                id,
                badges: badgesArray,
            };
        });

        donors.forEach(user => addUser(user.id, CLIENT_MODS.REVIEWDB, user.name));
        console.log(donors);
    } catch (e) {
        if (attempts++ > 4)
            console.error("Failed to get Review DB badges after 5 attempts", e);
        else setTimeout(getReviewDBBadges, 500);
    }
};

getReviewDBBadges();
