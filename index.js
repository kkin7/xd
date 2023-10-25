const http = require("http");
const fs = require("fs");
const parser = require("querystring");
const mysql = require("mysql");
const { resolve } = require("path");
let logStatus = 0; // 1 log, 0 logout
let userID = 0;
let select = ""

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project"
});


async function selectContent() {
    
    let query_category = "select DISTINCT product_category from products"
    
    return new Promise((resolve, reject) => {
        connection.query(query_category, (err, result, field) => { 
            let text = "" 
            console.info('result of selectContent', result)
            let index = 1;
            result.forEach(element => {
                text += '<option value="Category'+index+'">'+element.product_category+'</option>';
                index++;
            })
            resolve(text);
        });
    });
};

let server = http.createServer(async (req, res) => {
    const log = 0;
    let url = req.url.toString().substring(1).split("/");
    console.log(url);
    switch (url[0]) {
        case "": //HOME
            {
                let site = fs.readFileSync("./views/index.html").toString();
                if(logStatus==1)
                {
                    site = site.replace("{{menu}}",'<a href="/vusketPage.html"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-basket2-fill" viewBox="0 0 16 16"><path d="M5.929 1.757a.5.5 0 1 0-.858-.514L2.217 6H.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h.623l1.844 6.456A.75.75 0 0 0 3.69 15h8.622a.75.75 0 0 0 .722-.544L14.877 8h.623a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1.717L10.93 1.243a.5.5 0 1 0-.858.514L12.617 6H3.383L5.93 1.757zM4 10a1 1 0 0 1 2 0v2a1 1 0 1 1-2 0v-2zm3 0a1 1 0 0 1 2 0v2a1 1 0 1 1-2 0v-2zm4-1a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1z"/></svg></a><a class="nav-link" href="/logout" style="margin: 5px;">Logout</a>')
                }
                else
                {  
                    site = site.replace("{{menu}}",'<div class="login"><a class="nav-link" href="login" style="margin: 5px; ">Sign up</a><a class="nav-link" href="register" style="margin: 5px;">Sign in</a></div>');
                    
                }
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(site);
                break;
                
            }
        case "logout": {
            logStatus = 0
            let site = fs.readFileSync("./views/index.html").toString();
            site = site.replace("{{menu}}",'<script>alert("Logged out successfully")</script><div class="login"><a class="nav-link" href="login" style="margin: 5px; ">Sign up</a><a class="nav-link" href="register" style="margin: 5px;">Sign in</a></div>');
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
                                        site = site.replace("{{modal}}", '<script>alert("Successfully registered!\nNow you can log in")</script>')
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
            console.log("ssss")
            req.on("data", (chunk) => {
                formdata += chunk.toString();
            });
            req.on("end", () => {
                let parsed = parser.parse(formdata);
                console.log(parsed);
                console.log("aa");

               

                connection.connect((err) => {
                    let query_checklogdata = "select user_id, count(user_login) as howmany from users where user_login='"+parsed.login+"' and user_password = '"+parsed.password+"'"
                    connection.query(query_checklogdata,(err, result, field) => {
                        if (result[0].howmany == 0) {
                            
                            let site = fs.readFileSync("./views/loginPage.html").toString();
                            site = site.replace("{{modal}}", '<script>alert("Incorrect login details!")</script>');
                            res.writeHead(200, { "Content-Type": "text/html" });
                            res.end(site);
                        }
                        else
                        { 
                            logStatus = 1;
                            userID = result[0].user_id;
                            let site = fs.readFileSync("./views/loginPage.html").toString();
                            site = site.replace("{{modal}}", '<script>alert("Successfully log!")</script>');
                            res.writeHead(200, { "Content-Type": "text/html" });
                            res.end(site);
                        }
                    });
                });
            })
            break;
        }
        case "category": {
            let site = fs.readFileSync("./views/productsListPage.html").toString();
            let received = "" 
            req.on("data", (chunk) => {
                received += chunk.toString();
            });

            req.on("end", () => {
                console.log(received);
                var text = ""
                //ogarnąć kategorię
                let temp = received.substring(0,received.length-2)
                temp += " " + received[received.length-2]
                console.log(temp)
                
                connection.connect( (err) => {
                    let query_selectCategory = "select product_name, product_price, product_description, product_image from products where product_category = '"+temp+"'";
                    connection.query(query_selectCategory,  (err, result, fields) => {
                        var index = 1;
                    text ='<div class="row center-mobile" style="margin-top: 50px">'
                    result.forEach( element => {
                        
                        text += '<div class="col"><div class="card center-mobile" style="width: 18rem;"><img src="/images/'+element.product_image+'" class="card-img-top" style="padding: 15px" alt="..."><div class="card-body"><h5 class="card-title">'+element.product_name+'</h5><p class="card-text">'+element.product_description+'</p><a href="#" class="btn btn-primary">Add to cart</a><p style="float:right; margin-right: 40px;">'+element.product_price+'</p></div></div></div>';
                        index++;
                        if(index == 6)
                        {
                            text+='</div><div class="row center-mobile" style="margin-top: 50px">'
                            index = 1;
                        }                        
                    });
                    text+='</div>'
                    site = site.replace("{{cards}}",text);
                    res.writeHead(200, {"Content-Type":"text/html"});
                    res.end(site);
                    });
                });
                
            });
            break;
        }
        case "products": {
            
            let site = fs.readFileSync("./views/productsListPage.html").toString();
            let text = "";
            connection.connect( (err) =>{
                let query_selectProducts = "select product_name, product_price, product_description, product_image from products";
                connection.query(query_selectProducts,  (err, result, fields) => {
                    var index = 1;
                    text ='<div class="row center-mobile" style="margin-top: 50px">'
                    result.forEach( element => {
                        
                        text += '<div class="col"><div class="card center-mobile" style="width: 18rem;"><img src="/images/'+element.product_image+'" class="card-img-top" style="padding: 15px" alt="..."><div class="card-body"><h5 class="card-title">'+element.product_name+'</h5><p class="card-text">'+element.product_description+'</p><a href="#" class="btn btn-primary">Add to cart</a><p style="float:right; margin-right: 40px;">'+element.product_price+'</p></div></div></div>';
                        index++;
                        if(index == 6)
                        {
                            text+='</div><div class="row center-mobile" style="margin-top: 50px">'
                            index = 1;
                        }                        
                    });
                    text+='</div>'
                    site = site.replace("{{cards}}",text);
                    selectContent().then(v => {
                       
                        site = site.replace("{{select}}",v); 
                        res.writeHead(200, {"Content-Type":"text/html"});
                        res.end(site);
                    })
                   
                });
            });
            
            break;
         }
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
        default: {
            let site = fs.readFileSync("./views/error.html");
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(site);
            break;
        }
    }
});

server.listen(8000, () => {
    console.log("Server is working");
});