import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = 3000;

let blog_list = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    if (req.query.action == "delete") {
        const blog_post = blog_list.find((element) => element.id == req.query.id);
        const blog_index = blog_list.indexOf(blog_post);
        blog_list.splice(blog_index, 1);
    }
    displayHome(res);
});

app.get("/create", (req, res) => {
    res.locals.currentPage = "create";
    res.render("create.ejs");
});

app.get("/edit", (req, res) => {
    res.locals.currentPage = "edit";
    const blog_post = blog_list.find((element) => element.id == req.query.id);

    const data = {
        title: blog_post.title,
        body: blog_post.body,
        id: blog_post.id
    };
    res.render("edit.ejs", data);
});

app.get("/read", (req, res) => {
    res.locals.currentPage = "read";
    const blog_post = blog_list.find((element) => element.id == req.query.id);
    
    let formattedText = blog_post.body.replace(/\r\n/g, "@@@");
    formattedText = formattedText.replace(/@@@@@@/g, "<br/><br/>"); // sauts de ligne intentionnels
    formattedText = formattedText.replace(/@@@/g, ""); // retours à la ligne automatiques
        
    const data = {
        title: blog_post.title,
        body: formattedText,
        id: blog_post.id
    };
    res.render("read.ejs", data);
});

app.post("/", (req, res) => {
    console.log("there "+req.query);
    if (req.body.id) {
        const blog_post = blog_list.find((element) => element.id == req.body.id);
        blog_post.title = req.body.title;
        blog_post.body = req.body.body;
    } else {
        const new_id = uuidv4();
        const new_blog = new Blog(req.body.title, req.body.body, new_id);
        blog_list.push(new_blog);
    }
    displayHome(res);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


function displayHome(res) {
    const data = {
        blog_list: blog_list
    }
    res.locals.currentPage = "home";
    res.render("index.ejs", data);
}

class Blog {
    constructor(title, body, id) {
        this.title = title;
        this.body = body;
        this.id = id;
    }
}