"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface) => {
    const hashed = await bcrypt.hash("123456", 10);
    await queryInterface.bulkInsert("Users", [
      {
        name: "Admin User",
        email: "admin@rafeeq.com",
        password: hashed,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Test User",
        email: "user@rafeeq.com",
        password: hashed,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
