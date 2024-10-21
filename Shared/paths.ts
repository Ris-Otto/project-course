

const Paths = {
    users: "/users",
    auth: "/auth",
    user: {
        register: "/auth/register",
        logout: "/auth/logout",
        login: "/auth/login",
        events: "user/events"
    },
    band: {
        register: "/auth/register/band",
    },
    venue: {
        register: "/auth/register/venue",
    },

} as const;

export default Paths;