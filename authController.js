const User = require("./models/User");
const Role = require("./models/Role");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./config");

const generateAccessToken = (id, roles) => {
  const payLoad = {
    id,
    roles,
  };

  return jwt.sign(payLoad, secret, { expiresIn: "24h" });
};

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Registration error", errors });
      }

      const { username, password } = req.body;
      const candidate = await User.findOne({ username });

      if (candidate) {
        return res
          .status(400)
          .json({ message: "User with this name has already existed" });
      }

      const saltRounds = 7;
      const userRole = await Role.findOne({ value: "USER" });

      await bcrypt.hash(password, saltRounds, (err, hashPassword) => {
        if (err) {
          console.log(err);
        }

        const user = new User({
          username,
          password: hashPassword,
          roles: [userRole.value],
        });

        user.save();
      });

      return res.json({ message: "registration was success" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Registration error" });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res
          .status(400)
          .json({ message: `User ${username} can not found` });
      }

      await bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          console.log(err);
        }

        if (!result) {
          return res.status(400).json({ message: "Incorrect password" });
        }

        const token = generateAccessToken(user._id, user.roles);

        return res.json({ token });
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Login error" });
    }
  }

  async getUser(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new AuthController();
