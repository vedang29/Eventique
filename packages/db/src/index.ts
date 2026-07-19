import { type Prisma, PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db =
  global.prisma ??
  new PrismaClient({
    //log: ["query", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = db;

export default db;

export type { Prisma };

export const BankNames = {
    bob: "bob",
    hdfc: "hdfc",
    icic: "icic",
    kotak: "kotak",
    yesbank: "yesbank",
} as const;

export const TransactionTypes = {
    CANCEL: "CANCEL",
    DEPOSIT: "DEPOSIT",
    PURCHASE: "PURCHASE",
    REFUND: "REFUND",
    WITHDRAWAL: "WITHDRAWAL",
    PAYOUT:"PAYOUT"
} as const;

export const Roles = {
    admin: "admin",
    organiser: "organiser",
    user: "user",
    verifier: "verifier",
} as const;

export const OTPPurposes = {
    forgot_password: "forgot_password",
    signup: "signup",
    ticket_validation:"ticket_validation"
} as const;

export const EventStatuses = {
    cancelled: "cancelled",
    draft: "draft",
    published: "published",
} as const;

export const EventCategory = {
  movie: "movie",
  concert: "concert",
  sports: "sports",
  theatre: "theatre",
  comedy: "comedy",
  conference: "conference",
  workshop: "workshop",
  exhibition: "exhibition",
  festival: "festival",
  other: "other"
} as const

export const EventGenre = {
  action: "action",
  drama: "drama",
  comedy: "comedy",
  romance: "romance",
  horror: "horror",
  thriller: "thriller",
  sci_fi: "sci_fi",
  fantasy: "fantasy",
  documentary: "documentary",
  animation: "animation",
  classical: "classical",
  rock: "rock",
  pop: "pop",
  jazz: "jazz",
  hip_hop: "hip_hop",
  sports_general: "sports_general",
  other: "other"
} as const

export const EventLanguage = {
  english: "english",
  hindi: "hindi",
  marathi: "marathi",
  spanish: "spanish",
  french: "french",
  german: "german",
  japanese: "japanese",
  korean: "korean",
  chinese: "chinese",
  tamil: "tamil",
  telugu: "telugu",
  multi_language: "multi_language",
} as const;

export const TicketStatus = {
  ISSUED: "ISSUED",
  CANCELLED: "CANCELLED",
  USED: "USED",
  EXPIRED: "EXPIRED"
}

// Types
export type BankName = (typeof BankNames)[keyof typeof BankNames];
export type TransactionType = (typeof TransactionTypes)[keyof typeof TransactionTypes];
export type Role = (typeof Roles)[keyof typeof Roles];
export type OTPPurpose = (typeof OTPPurposes)[keyof typeof OTPPurposes];
export type EventStatus = (typeof EventStatuses)[keyof typeof EventStatuses];
export type EventCategory = (typeof EventCategory)[keyof typeof EventCategory];
export type EventGenre = (typeof EventGenre)[keyof typeof EventGenre];
export type EventLanguage = (typeof EventLanguage)[keyof typeof EventLanguage];
export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];