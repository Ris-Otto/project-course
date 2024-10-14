

const Paths = {
    users: "/users",
    auth: "/auth",
    user: {
        register: "/auth/register",
        events: "user/events"
    },
    band: {
        register: "/auth/register/band",
    },
    venue: {
        register: "/auth/register/venue",
    },
    login: "/auth/login",
} as const;

export default Paths;