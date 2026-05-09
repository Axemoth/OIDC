import { pgTable, text, varchar, bigint, timestamp, serial } from "drizzle-orm/pg-core";

// Table schema for Users
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Using text to match Date.now().toString() logic from before
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
});

// Table schema for Authorization Codes
export const codes = pgTable('codes', {
  code: text('code').primaryKey(),
  client_id: text('client_id').notNull(),
  redirect_uri: text('redirect_uri').notNull(),
  user_id: text('user_id').notNull(),
  code_challenge: text('code_challenge').notNull(),
  scope: text('scope').notNull(),
  expiresAt: bigint('expires_at', { mode: 'number' }).notNull()
});

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  clientId: varchar('client_id', { length: 255 }).notNull().unique(),
  clientSecret: varchar('client_secret', { length: 255 }).notNull(),
  redirectUri: varchar('redirect_uri', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});
