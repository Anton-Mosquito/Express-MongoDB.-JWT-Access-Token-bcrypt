const Router = require("express");
const router = new Router();
const authController = require("./authController");
const { check } = require("express-validator");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

router.post(
  "/registration",
  [
    check("username", "User name can not be empty").notEmpty(),
    check(
      "password",
      "Password should be bigger than 4 and les the 10 symbols"
    ).isLength({ min: 4, max: 10 }),
  ],
  authController.registration
);
router.post("/login", authController.login);
router.get("/users", roleMiddleware(["USER"]), authController.getUser);

module.exports = router;
