package com.ticketplatform.backend.config;

public final class ApiPaths {

    private ApiPaths() {
    }

    public static final String API = "/api";

    public static final class Auth {
        private Auth() {
        }

        public static final String BASE = API + "/auth";
        public static final String LOGIN = BASE + "/login";
        public static final String SIGNUP = BASE + "/signup";
        public static final String ME = BASE + "/me";
        public static final String LOGOUT = BASE + "/logout";
    }

    public static final class Events {
        private Events() {
        }

        public static final String BASE = API + "/events";
        public static final String ANY = BASE + "/**";
    }

    public static final class Tickets {
        private Tickets() {
        }

        public static final String BASE = API + "/tickets";
        public static final String ME = BASE + "/me";
        public static final String ANY = BASE + "/**";
    }

    public static final class Cors {
        private Cors() {
        }

        public static final String FRONTEND_LOCAL = "http://localhost:5173";
    }
}
