import authService from "../services/auth.service.js";

class AuthController {
  async signup(req, res) {
    try {
      const { email, password } = req.body;
      const user = await authService.signup(email, password);
      res.status(201).json({ message: "User registered", userId: user.id });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: error.message });
    }
  }
}

export default new AuthController();
