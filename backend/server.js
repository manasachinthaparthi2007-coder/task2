const express = require("express");
const cors = require("cors");

const app = express();


app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// Temporary storage
const users = [];
const blogs = [];

// =========================
// HOME / TEST API
// =========================

app.get("/", (req, res) => {
    res.json({
        message: "MyBlog Backend is running!"
    });
});

// =========================
// REGISTER API
// =========================

app.post("/api/register", (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email,
        password
    };

    users.push(newUser);

    res.status(201).json({
        message: "Registration successful",
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }
    });
});

// =========================
// LOGIN API
// =========================

app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    const user = users.find(
        user =>
            user.email === email &&
            user.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    res.json({
        message: "Login successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

// =========================
// CREATE BLOG API
// =========================

app.post("/api/blogs", (req, res) => {

    const { title, author, category, content } = req.body;

    if (!title || !author || !category || !content) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const newBlog = {
        id: blogs.length + 1,
        title,
        author,
        category,
        content
    };

    blogs.push(newBlog);

    res.status(201).json({
        message: "Blog created successfully",
        blog: newBlog
    });
});

// =========================
// GET ALL BLOGS API
// =========================
app.get("/api/blogs", (req, res) => {
res.json(blogs);

});
    
app.delete("/api/blogs/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const blogIndex = blogs.findIndex(
        blog => blog.id === id
    );

    if (blogIndex === -1) {
        return res.status(404).json({
            message: "Blog not found"
        });
    }

    blogs.splice(blogIndex, 1);

    res.json({
        message: "Blog deleted successfully"
    });
});


// =========================
// SERVER
// =========================

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});