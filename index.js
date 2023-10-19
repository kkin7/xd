const http = require("http");
const fs = require("fs");
const parser = require("querystring");
const mysql = require("mysql");

let server = http.createServer((req, res) => {
    const log = 0;
    let url = req.url.toString().substring(1).split("/");
    console.log(url);
    switch (url[0]) {
        case "": //HOME
            {
                let site = fs.readFileSync("./views/index.html");
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(site);
                break;
            }
        case "style.css":
            {
                let style = fs.readFileSync("./views/style.css");
                res.writeHead(200, { "Content-Type": "text/css" });
                res.end(style);
                break;
            }
        case "login":
            {
                let site = fs.readFileSync("./views/loginPage.html");
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(site);
                break;
            }
        case "register":
            {
                let site = fs.readFileSync("./views/registerPage.html");
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(site);
                break;
            }
        case "signIn": {
            let formdata = "";
            req.on("data", (chunk) => {
                formdata += chunk.toString();
            });
            req.on("end", () => {
                let parsed = parser.parse(formdata);
                console.log(parsed);

                let connection = mysql.createConnection({
                    host: "localhost",
                    user: "root",
                    password: "",
                    database: "project"
                });

                connection.connect((err) => {
                    if (parsed.password != parsed.confirm_password) {
                        res.writeHead(200, { "Content-Type": "text/html" });
                        let site = fs.readFileSync("./views/registerPage.html").toString();
                        site = site.replace("{{modal}}", '<script>alert("Passwords are different")</script>')
                        res.end(site);
                    }

                    else {
                        let query_checklogin = "select count(user_login) as howMany from users where user_login='" + parsed.login + "'";
                        connection.query(query_checklogin, (err, result, fields) => {
                            console.log(result[0].howMany)
                            if (result[0].howMany == 0) {
                                let sql_insert = "insert users values ('', '" + parsed.login + "', '" + parsed.password + "');"
                                connection.query(sql_insert, (err, result, fields) => {
                                    if (result) {
                                        res.writeHead(200, { "Content-Type": "text/html" });
                                        let site = fs.readFileSync("./views/registerPage.html").toString();
                                        site = site.replace("{{modal}}", '<script>alert("Successfully registered!")</script>')
                                        res.end(site);
                                    }
                                });

                            }
                            else {
                                res.writeHead(200, { "Content-Type": "text/html" });
                                let site = fs.readFileSync("./views/registerPage.html").toString();
                                site = site.replace("{{modal}}", '<script>alert("Username already exists!")</script>')
                                res.end(site);
                            }


                        });
                    }
                });
            });



            break;
        }
        case "signUp": {
            let formdata = "";
            req.on("data", (chunk) => {
                formdata += chunk.toString();
            });
            req.on("end", () => {
                let parsed = parser.parse(formdata);
                console.log(parsed);

                let connection = mysql.createConnection({
                    host: "localhost",
                    user: "root",
                    password: "",
                    database: "project"
                });

                connection.connect((err) => {
                    let query_checklogdata = "select count(user_login) as howmany from users where user_login='"+parsed.login+"' and user_password = '"+parsed.password+"'"
                    connection.query(query_checklogdata,(err, result, field) => {
                        if (result[0].howmany == 0) {
                            
                            let site = fs.readFileSync("./views/loginPage.html").toString();
                            site = site.replace("{{modal}}", '<script>alert("Incorrect login details!")</script>');
                            res.writeHead(200, { "Content-Type": "text/html" });
                            res.end(site);
                        }
                        else
                        {
                            
                            let site = fs.readFileSync("./views/loginPage.html").toString();
                            site = site.replace("{{modal}}", '<script>alert("Successfully log!")</script>');
                            res.writeHead(200, { "Content-Type": "text/html" });
                            res.end(site);
                        }
                    });
                });
            })
        }
        case "products": { }
        case "delivery": { }
        case "contact": { }
        case "about_us": { }
        case "images":
            {
                console.log(url[1]);
                let image = fs.readFileSync("./images/" + url[1]);
                res.writeHead(200, { "Content-Type": "image/png" });
                res.end(image, 'binary');
                break;
            }
    }
    /*
       
    case "add_user":
            {
                let formdata = "";
                req.on("data", (chunk) => {
                    formdata += chunk.toString();
                });
                req.on("end",()=>{
                    let parsed = parser.parse(formdata);
                    console.log(parsed);

                    let connection = mysql.createConnection({
                        host: "localhost",
                        user: "root",
                        password: "",
                        database: "users"
                    });  

                    connection.connect( (err) => {
                        let sql_query = "insert into students values ('','"+parsed.user_fname+"','"+parsed.user_lname+"',"+parsed.user_age+")";
                        connection.query(sql_query, (err,result,fields) =>{
                            res.writeHead(200, {"Content-Type" : "text/html"});
                            res.end("Dodawno")
                        });

                    });
                });

                

                break;
            }*/
});

server.listen(8000, () => {
    console.log("Server is working");
});