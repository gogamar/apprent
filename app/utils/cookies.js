import { setCookie } from "cookies-next";

export const setAuthCookie = (token) => {
  setCookie("authToken", token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
    sameSite: "strict",
  });
};
