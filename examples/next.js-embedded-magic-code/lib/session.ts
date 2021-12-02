// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionData } from "iron-session";
import type { User } from "pages/api/user";

// This is where we specify the typings of req.session.*
// This type is used by the `iron-session` package (and above) this way:
// import { IronSessionOptions } from 'iron-session';
declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}

export type Session = IronSessionData;
