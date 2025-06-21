import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://govindpatel4033:Askrithe40%40@clusterg.l3yzewq.mongodb.net/todolist")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect with Mongodb", err.message));

const taskSchema = new mongoose.Schema({
  name: String
});

const Task = mongoose.model("Task", taskSchema, "list");


app.get("/", async (req, res) => {
  try {
    const items = await Task.find({});
    res.render("list", { ejes: items });
  } catch (err) {
    console.log("Error = find ", err.message);
    res.status(500).send("Failed to find in collection");
  }
});

app.post("/add", async (req, res) => {
  const name = req.body.ele1.trim();
  if (!name){
    return res.redirect("/");
  }
  try {
    await Task.create({ name });
    res.redirect("/");
  } catch (err) {
    console.log("Error = add ", err.message);
    res.status(500).send("addition of task failed on mongodb database");
  }
});

app.post("/edit", async (req, res) => {
  const { id, newtask } = req.body;
  if (!id || !newtask.trim()){
    return res.redirect("/");
  }

  try {
    await Task.updateOne({ _id: id }, { $set: { name: newtask.trim() } });
    res.redirect("/");
  } catch (err) {
    console.log("Error = edit ", err.message);
    res.status(500).send("edit of task failed on mongodb database");
  }
});

app.post("/delete", async (req, res) => {
  const { id } = req.body;
  if (!id){
    return res.redirect("/");
  }

  try {
    await Task.deleteOne({ _id: id });
    res.redirect("/");
  } catch (err) {
    console.log("Error = delete ", err.message);
    res.status(500).send("Delete of task failed on mongodb database");
  }
});


app.listen(8000, () => {
  console.log("Server running on port no 8000");
});