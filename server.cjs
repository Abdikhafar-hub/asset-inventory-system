const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom login route
server.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Received credentials:", username, password); // Debugging
  const users = router.db.get("Users").value();
  console.log("Users from database:", users); // Debugging
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    res.status(200).json({
      id: user.id,
      username: user.username,
      role: user.role,
      department_id: user.department_id,
    });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// Use JSON Server's default router
server.use(router);

// Start the server
server.listen(3000, () => {
  console.log("JSON Server is running on http://localhost:3000");
});
