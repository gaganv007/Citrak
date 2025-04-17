class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async registerUser(req, res) {
        try {
            const userData = req.body;
            const newUser = await this.userService.createUser(userData);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async loginUser(req, res) {
        try {
            const { username, password } = req.body;
            const token = await this.userService.authenticateUser(username, password);
            res.status(200).json({ token });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
}

export default UserController;