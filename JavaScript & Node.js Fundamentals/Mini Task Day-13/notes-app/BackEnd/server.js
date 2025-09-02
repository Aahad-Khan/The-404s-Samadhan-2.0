import express from "express";
import cors from "cors";
import { init, run, all } from "./db.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
init();

app.get("/api/notes", async (req, res) => {
    const notes = await all("SELECT * FROM notes ORDER BY updated_at DESC");
    res.json(notes);
});

app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).send("Missing fields");
    const { id } = await run("INSERT INTO notes (title, content) VALUES (?,?)", [
        title,
        content,
    ]);
    const note = await all("SELECT * FROM notes WHERE id=?", [id]);
    res.json(note[0]);
});

app.put("/api/notes/:id", async (req, res) => {
    const { title, content } = req.body;
    const id = req.params.id;
    await run(
        "UPDATE notes SET title=?, content=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
        [title, content, id]
    );
    const note = await all("SELECT * FROM notes WHERE id=?", [id]);
    res.json(note[0]);
});

app.delete("/api/notes/:id", async (req, res) => {
    await run("DELETE FROM notes WHERE id=?", [req.params.id]);
    res.sendStatus(204);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
