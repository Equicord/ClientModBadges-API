import axios from "axios";

import * as utils from "./utils.mjs";

const { addUser, CLIENT_MODS } = utils;

let attempts = 1;

const getEquicordBadges = async () => {
    try {
        const { data } = await axios.get(
            "https://raw.githubusercontent.com/Equicord/Equicord/main/src/utils/constants.ts",
            { headers: { "Cache-Control": "no-cache" } }
        );

        const matches = data.split("EquicordDevs")[1].match(/id: ([0-9n]+)/gs);
        const contributors = matches.map(match => {
            const [, id] = match.match(/id: ([0-9n]+)/s);
            return { id: id.replace("n", ""), badges: ["Contributor"] };
        });

        const { data: donorData } = await axios.get(
            "https://equicord.org/badges.json",
            { headers: { "Cache-Control": "no-cache" } }
        );

        const donors = Object.entries(donorData).map(([id, badges]) => {
            const badgesArray = badges.map(({ tooltip, badge }) => ({
                name: tooltip,
                badge: badge,
            }));

            if (!badgesArray.some(b => b.badge === "https://cdn.nest.rip/uploads/78cb1e77-b7a6-4242-9089-e91f866159bf.png")) {
                badgesArray.push({
                    name: "Equicord Donor",
                    badge: "https://cdn.nest.rip/uploads/78cb1e77-b7a6-4242-9089-e91f866159bf.png"
                });
            }

            return {
                id,
                badges: badgesArray,
            };
        });

        let users = [...contributors, ...donors];

        users = users.reduce((acc, user) => {
            const existingUser = acc.find(u => u.id === user.id);
            if (existingUser)
                existingUser.badges = [...existingUser.badges, ...user.badges];
            else acc.push(user);
            return acc;
        }, []);

        users.forEach(user => addUser(user.id, CLIENT_MODS.EQUICORD, user.badges));
        console.log(users);
    } catch (e) {
        if (attempts++ > 4)
            console.error("Failed to get Equicord badges after 5 attempts", e);
        else setTimeout(getEquicordBadges, 500);
    }
};

getEquicordBadges();
