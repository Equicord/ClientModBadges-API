import axios from "axios";
import * as utils from "./utils.mjs";

const { addUser, CLIENT_MODS } = utils;

let attempts = 1;

const getRa1ncordBadges = async () => {
    try {
        const { data: donorData } = await axios.get(
            "https://raw.githubusercontent.com/ra1ncord/badges/main/badges.json",
            { headers: { "Cache-Control": "no-cache" } }
        );

        const donors = Object.entries(donorData).map(([id, badge]) => {
            const badgesArray = Object.entries(badge).map(([name, value]) => ({
                name: value.label,
                badge: value.url,
            }));

            return {
                id,
                badges: badgesArray,
            };
        });

        let users = [...donors];

        users = users.reduce((acc, user) => {
            const existingUser = acc.find(u => u.id === user.id);
            if (existingUser)
                existingUser.badges = [...existingUser.badges, ...user.badges];
            else acc.push(user);
            return acc;
        }, []);

        users.forEach(user => addUser(user.id, CLIENT_MODS.RA1NCORD, user.badges));
        console.log(users);
    } catch (e) {
        if (attempts++ > 4)
            console.error("Failed to get Vencord badges after 5 attempts", e);
        else setTimeout(getRa1ncordBadges, 500);
    }
};

getRa1ncordBadges();
