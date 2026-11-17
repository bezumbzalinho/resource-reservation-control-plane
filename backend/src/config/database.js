const Sequelize = require("sequelize");
const sequelize = new Sequelize("projetoai2", "postgres", "pass", {
  host: "localhost",
  port: "5432",
  dialect: "postgres",
});

sequelize.sync({ alter: true });
module.exports = sequelize;
