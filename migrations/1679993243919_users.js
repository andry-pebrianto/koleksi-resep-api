/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
    },
    full_name: {
      type: "VARCHAR(55)",
      notNull: true,
    },
    birth_date: {
      type: "DATE",
    },
    email: {
      type: "VARCHAR(55)",
      notNull: true,
      unique: true,
    },
    phone: {
      type: "VARCHAR(15)",
    },
    password: {
      type: "VARCHAR(205)",
      notNull: true,
    },
    photo_url: {
      type: "VARCHAR(205)",
    },
    level: {
      type: "INTEGER",
      default: 2,
    },
    is_verified: {
      type: "INTEGER",
      default: 0,
    },
    is_active: {
      type: "INTEGER",
      default: 1,
    },
    email_token: {
      type: "VARCHAR(205)",
    },
    google_id: {
      type: "VARCHAR(205)",
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
