import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

// export const usersTable = pgTable("users", {
//   id: integer().primaryKey().generatedAlwaysAsIdentity(),
//   name: varchar({ length: 255 }).notNull(),
//   age: integer().notNull(),
//   email: varchar({ length: 255 }).notNull().unique(),
// });

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  oldId: text(),
  name: varchar({ length: 300 }).notNull(),
  email: varchar({ length: 300 }).unique(),
  createdAt: timestamp().defaultNow(),
});

export type User = typeof users.$inferSelect

export const surauMasjids = pgTable("surau_masjid", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 300 }).notNull(),
  uniqueName: varchar({ length: 300 }).notNull(),
  directionDescription: text(),
  isApproved: boolean().default(false),
  isApprovedAt: timestamp(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp(),
  state: varchar({ length: 100 }),
  district: varchar({ length: 100 }),
  mallName: text(),
  isQiblatCertified: boolean(),
  isPerformingJumaatPrayer: boolean(),

  submittedBy: integer().references(() => users.id),

  oldId: text(),
});

export const audits = pgTable("audits", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  action: varchar({ length: 300 }).notNull(),
  actor: integer().references(() => users.id),

  surauMasjidId: integer().references(() => surauMasjids.id),
});

export const images = pgTable("images", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  path: text(),
  createdAt: timestamp().defaultNow(),

  surauMasjidId: integer().references(() => surauMasjids.id, {
    onDelete: "set null",
  }),

  oldId: text(),
});

export const ratings = pgTable("ratings", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  rating: integer(),
  remarks: text(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp(),

  surauMasjidId: integer().references(() => surauMasjids.id),
  postedBy: integer().references(() => users.id),
});

export type Rating = typeof ratings.$inferSelect;

export const surauMasjidRelations = relations(
  surauMasjids,
  ({ many, one }) => ({
    images: many(images),
    ratings: many(ratings),
    audits: many(audits),
    user: one(users, {
      fields: [surauMasjids.submittedBy],
      references: [users.id],
    }),
  })
);

export const userRelations = relations(users, ({ many }) => ({
  surauMasjids: many(surauMasjids),
  ratings: many(ratings),
  audits: many(audits),
}));

export const ratingRelations = relations(ratings, ({ one }) => ({
  surauMasjid: one(surauMasjids, {
    fields: [ratings.surauMasjidId],
    references: [surauMasjids.id],
  }),
  user: one(users, {
    fields: [ratings.postedBy],
    references: [users.id],
  }),
}));

export const imageRelations = relations(images, ({ one }) => ({
  surauMasjid: one(surauMasjids, {
    fields: [images.surauMasjidId],
    references: [surauMasjids.id],
  }),
}));
