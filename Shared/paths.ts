
//TODO keep but make useful
const Paths = {
    users: "/users",
    auth: "/auth",
    user: {
        register: "/auth/register",
        logout: "/auth/logout",
        login: "/auth/login",
        events: "/user/events",
        self: "/user",
    },
    artist: {
        register: "/auth/register/band",
        public: "/artist/public",
        self: "/artist",
    },
    venue: {
        register: "/auth/register/venue",
        self: "/venue",
        public: "/venue/public",
        event: {
            create: "/venue/event/add",
            update: "/venue/event/update",
        }
    },
    event: {
        get: "/event",
        all: "/events"
    }

} as const;

export default Paths;