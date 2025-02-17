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
    artists: "user/artists/following",
    venues: "user/venues/following",
  },
  artist: {
    register: "/auth/register/artist",
    public: "/artist/public",
    self: "/artist",
    login: "/auth/login/artist",
    search: "/artist/search",
    all: "/artist/all",
    update: "/artist/update",
  },
  venue: {
    register: "/auth/register/venue",
    self: "/venue",
    public: "/venue/public",
    login: "/auth/login/venue",
    all: "/venue/all",
    event: {
      create: "/venue/event/add",
      update: "/venue/event/update",
      publish: "/venue/event/publish",
    },
    update: "/venue/update",
    bio: {
      get: "/venue/bio",
      update: "/venue/bio/update",
    },
  },
  event: {
    get: "/event",
    all: "/events",
  },
} as const;

export default Paths;
