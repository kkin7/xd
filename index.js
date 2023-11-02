const http = require("http");
const fs = require("fs");
const parser = require("querystring");
const mysql = require("mysql");
const { resolve } = require("path");
var logStatus = 0; // 1 log, 0 logout
var userID = 0;
var basket = [];
let basket_sum = 0.0
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project"
});
function header() {
    let content = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>{{title}}</title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous"><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"crossorigin="anonymous"></script><style>.login {display: flex;}body{overflow-y: scroll;background-color: rgb(248, 249, 250);}#menubutton{min-width: 100px;}#slider {height: 700px;}.slider_bg {background-color: rgb(46, 46, 46);opacity: 0.7;color: white;font-size: 25px;}::-webkit-scrollbar {-webkit-appearance: none;width: 7px;}::-webkit-scrollbar-thumb {border-radius: 4px;background-color: rgba(0, 0, 0, .5);-webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);}#loginForm{width: 60vw;margin: auto;border: 1px solid black;padding: 5%;}.center-mobile{margin-top: 50px;}@media (max-width: 666px){.center-mobile{margin: 0 auto; }}.center-mobile1{margin-top: -50px;}@media (max-width: 990px){.center-mobile1{margin-top: 0;}}@media (max-width: 768px){.center-mobile2{margin: 0 auto;text-align: center;}}.filter{margin-left: 5%;margin-top: 2%;}#container1{width: 90vw;margin: 0 auto;}#container2{width: 75vw;margin: 0 auto;}.col{margin-top: 50px;}</style></head><body><div id="menu"><nav class="navbar bg-body-tertiary nav-underline"><div class="container-fluid"><a class="navbar-brand nav-underline nav-link" style="width: 8%; text-align: center;" href="/">ShopName</a><form method="post" action="search" class="d-flex" role="search" style="width: 50vw; margin-left: 30%;"><input name="search" class="form-control me-2" type="search" style="width: 50vw; margin-left: -40%; margin-right: 40%;"placeholder="Searched product name" aria-label="Search"><input class="btn btn-outline-dark" value="Search" type="submit"></input></form>{{menu}}</div></nav><nav class="navbar navbar-expand-lg bg-body-tertiary nav-underline"><div class="container-fluid" style="text-align: center;"><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="navbarNavAltMarkup"><div class="navbar-nav" style="margin-top: 10px; align-items: center;"><form action="" method="post" id="formselect"><select name="category" class="form-select selectoption" id="menubutton" aria-label="" style="width: 300px;"><option value="" >Choose category</option><option value="all">All categories</option>{{select}}</select><script>let formsel=document.getElementById("formselect");\nformsel.addEventListener("input",()=>{\nlet opt=document.querySelector(".selectoption");\nformsel.action="category";formsel.submit();\n});\n</script></form><a class="nav-link" id="menubutton" href="/products">Products</a><a class="nav-link" id="menubutton" href="/delivery">Delivery</a><a class="nav-link" id="menubutton" href="/contact">Contact</a><a class="nav-link" id="menubutton" href="/about_us">About us</a></div></div></div></nav></div>';

    return content;
}
function footer() {
    var text = '<footer class="py-3 my-4"><p class="text-center text-body-dark">© 2023 ShopName</p></footer></body></html>';

    return text
}
async function selectContent() {

    let query_category = "select DISTINCT product_category from products"

    return new Promise((resolve, reject) => {
        connection.query(query_category, (err, result, field) => {
            let text = ""
            let index = 1;
            result.forEach(element => {
                text += '<option value="Category ' + index + '">' + element.product_category + '</option>';
                index++;
            })
            resolve(text);
        });
    });
};
function ifLogged() {
    if (logStatus == 1) {
        text = '<a href="/basket"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-basket2-fill" viewBox="0 0 16 16"><path d="M5.929 1.757a.5.5 0 1 0-.858-.514L2.217 6H.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h.623l1.844 6.456A.75.75 0 0 0 3.69 15h8.622a.75.75 0 0 0 .722-.544L14.877 8h.623a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1.717L10.93 1.243a.5.5 0 1 0-.858.514L12.617 6H3.383L5.93 1.757zM4 10a1 1 0 0 1 2 0v2a1 1 0 1 1-2 0v-2zm3 0a1 1 0 0 1 2 0v2a1 1 0 1 1-2 0v-2zm4-1a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1z"/></svg></a><a class="nav-link" href="./logout" style="margin: 5px;">Logout</a>'

    }
    else {
        text = '<div class="login"><a class="nav-link" href="login" style="margin: 5px; ">Sign in</a><a class="nav-link" href="register" style="margin: 5px;">Sign up</a></div>'

    }
    return text
}
let server = http.createServer(async (req, res) => {
    const log = 0;
    let url = req.url.toString().substring(1).split("/");
    console.log(url);
    switch (url[0]) {
        case "": /* + */ {
            let site = fs.readFileSync("./views/index.html").toString();

            console.log(selectContent())
            selectContent().then(v => {
                site = site.replace('{{header}}', header())
                site = site.replace('{{footer}}', footer())
                site = site.replace("{{title}}", "Home")
                site = site.replace("{{menu}}", ifLogged());
                site = site.replace("{{select}}", v);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(site);
            });
            break;
        }
        case "logout": /* + */ {
            logStatus = 0
            let site = fs.readFileSync("./views/index.html").toString();
            site = site.replace("{{menu}}", '<script>alert("Logged out successfully")</script><div class="login"><a class="nav-link" href="login" style="margin: 5px; ">Sign in</a><a class="nav-link" href="register" style="margin: 5px;">Sign up</a></div>');
            selectContent().then(v => {
                site = site.replace('{{header}}', header())
                site = site.replace('{{footer}}', footer())
                site = site.replace("{{title}}", "Home")
                site = site.replace("{{menu}}", "<script>alert('Logged out successfully')</script>" + ifLogged());
                site = site.replace("{{select}}", v);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(site);
            });
            break;
        }
        case "login": /* + */ {
            let site = fs.readFileSync("./views/loginPage.html").toString();
            selectContent().then(v => {
                site = site.replace('{{header}}', header())
                site = site.replace('{{footer}}', footer())
                site = site.replace("{{title}}", "Login")
                site = site.replace("{{menu}}", ifLogged());
                site = site.replace("{{select}}", v);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(site);
            });
            break;

        }
        case "register": /* + */
            {
                let site = fs.readFileSync("./views/registerPage.html").toString();
                selectContent().then(v => {
                    site = site.replace('{{header}}', header())
                    site = site.replace('{{footer}}', footer())
                    site = site.replace("{{title}}", "Register")
                    site = site.replace("{{menu}}", ifLogged());
                    site = site.replace("{{select}}", v);
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(site);
                });

                break;
            }
        case "signUp": /* + */ {
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
                                        selectContent().then(v => {
                                            site = site.replace('{{header}}', header())
                                            site = site.replace('{{footer}}', footer())
                                            site = site.replace("{{title}}", "Login")
                                            site = site.replace("{{menu}}", ifLogged());
                                            site = site.replace("{{select}}", v);
                                            site = site.replace("{{modal}}", '<script>alert("Successfully registered!\nNow you can log in")</script>')
                                            res.writeHead(200, { "Content-Type": "text/html" });
                                            res.end(site);
                                        });


                                    }
                                });

                            }
                            else {
                                res.writeHead(200, { "Content-Type": "text/html" });
                                let site = fs.readFileSync("./views/registerPage.html").toString();
                                selectContent().then(v => {
                                    site = site.replace('{{header}}', header())
                                    site = site.replace('{{footer}}', footer())
                                    site = site.replace("{{title}}", "Login")
                                    site = site.replace("{{menu}}", ifLogged());
                                    site = site.replace("{{select}}", v);
                                    site = site.replace("{{modal}}", '<script>alert("Username already exists!")</script>')
                                    res.writeHead(200, { "Content-Type": "text/html" });
                                    res.end(site);
                                });

                            }


                        });
                    }
                });
            });
            break;
        }
        case "signIn": /* + */ {
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
                    let query_checklogdata = "select user_id, count(user_login) as howmany from users where user_login='" + parsed.login + "' and user_password = '" + parsed.password + "'"
                    connection.query(query_checklogdata, (err, result, field) => {
                        if (result[0].howmany == 0) {

                            let site = fs.readFileSync("./views/loginPage.html").toString();

                            selectContent().then(v => {
                                site = site.replace('{{header}}', header())
                                site = site.replace('{{footer}}', footer())
                                site = site.replace("{{title}}", "Login")
                                site = site.replace("{{menu}}", ifLogged());
                                site = site.replace("{{select}}", v);
                                site = site.replace("{{modal}}", '<script>alert("Incorrect login details!")</script>');
                                res.writeHead(200, { "Content-Type": "text/html" });
                                res.end(site);
                            });

                        }
                        else {
                            logStatus = 1;
                            userID = result[0].user_id;
                            let site = fs.readFileSync("./views/loginPage.html").toString();
                            selectContent().then(v => {
                                site = site.replace('{{header}}', header())
                                site = site.replace('{{footer}}', footer())
                                site = site.replace("{{title}}", "Login")
                                site = site.replace("{{menu}}", ifLogged());
                                site = site.replace("{{select}}", v);
                                site = site.replace("{{modal}}", '<script>alert("Successfully log!")</script>');
                                res.writeHead(200, { "Content-Type": "text/html" });
                                res.end(site);
                            });
                        }
                    });
                });
            })
            break;
        }
        case "category": /* + */ {
            let site = fs.readFileSync("./views/productsListPage.html").toString();
            if (req.method == 'POST') {
                var body = '';

                req.on('data', function (data) {
                    body += data;
                });

                req.on("end", () => {
                    var text = ""
                    var post = parser.parse(body);
                    var cat = ""
                    connection.connect((err) => {
                        let query_selectCategory = ""
                        if (post['category'] == "all" || post['category'] == "") {
                            query_selectCategory = "select product_name, product_price, product_description, product_image from products";
                            cat = "All categories"
                        }
                        else {
                            cat = post['category'];
                            query_selectCategory = "select product_name, product_price, product_description, product_image from products where product_category = '" + post['category'] + "'";
                        }

                        // console.log(query_selectCategory)
                        connection.query(query_selectCategory, (err, result, fields) => {

                            var index = 1;
                            text = '<div class="row center-mobile" style="margin-top: 50px">'
                            result.forEach(element => {

                                text += '<div class="col"><div class="card center-mobile" style="width: 18rem;"><img src="/images/' + element.product_image + '" class="card-img-top" style="padding: 15px" alt="..."><div class="card-body"><h5 class="card-title">' + element.product_name + '</h5><p class="card-text">' + element.product_description + '</p>'
                                if (logStatus == 1) {
                                    text += '<a href="/addToBasket/' + element.product_id + '" class="btn btn-primary">Add to cart</a><p style="float:right; margin-right: 40px;">' + element.product_price + '</p></div></div></div>';
                                    index++;
                                } else {
                                    text += '<p style="float:right; margin-right: 40px;">' + element.product_price + '</p></div></div></div>';
                                    index++;
                                }




                                if (index == 6) {
                                    text += '</div><div class="row center-mobile" style="margin-top: 50px">'
                                    index = 1;
                                }
                            });
                            text += '</div>'
                            site = site.replace("{{cards}}", text);
                            selectContent().then(v => {
                                site = site.replace('{{header}}', header())
                                site = site.replace('{{footer}}', footer())
                                site = site.replace("{{title}}", "Products")
                                site = site.replace("{{category}}", cat);
                                site = site.replace("{{menu}}", ifLogged());
                                site = site.replace("{{select}}", v);
                                res.writeHead(200, { "Content-Type": "text/html" });
                                res.end(site);
                            });
                        });
                    });
                });
            }
            break;
        }
        case "products": /* + */ {
            let site = fs.readFileSync("./views/productsListPage.html").toString();
            let text = "";
            connection.connect((err) => {
                let query_selectProducts = "select product_id, product_name, product_price, product_description, product_image from products";
                connection.query(query_selectProducts, (err, result, fields) => {
                    var index = 1;
                    text = '<br><div class="row center-mobile" style="margin-top: 50px;;">'
                    result.forEach(element => {

                        text += '<div class="col"><div class="card center-mobile" style="width: 18rem;"><img src="/images/' + element.product_image + '" class="card-img-top" style="padding: 15px" alt="..."><div class="card-body"><h5 class="card-title">' + element.product_name + '</h5><p class="card-text">' + element.product_description + '</p>'
                        if (logStatus == 1) {
                            text += '<a href="/addToBasket/' + element.product_id + '" class="btn btn-primary">Add to cart</a><p style="float:right; margin-right: 40px;">' + element.product_price + '</p></div></div></div>';
                            index++;
                        } else {
                            text += '<p style="float:right; margin-right: 40px;">' + element.product_price + '</p></div></div></div>';
                            index++;
                        }




                        if (index == 6) {
                            text += '</div><div class="row center-mobile" style="margin-top: 50px">'
                            index = 1;
                        }
                    });
                    text += '</div>'
                    site = site.replace("{{cards}}", text);
                    selectContent().then(v => {
                        site = site.replace('{{header}}', header())
                        site = site.replace('{{footer}}', footer())
                        site = site.replace("{{title}}", "Products")
                        site = site.replace("{{menu}}", ifLogged());
                        site = site.replace("{{category}}", "All categories");
                        site = site.replace("{{select}}", v);
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end(site);
                    });

                });
            });

            break;
        }
        case "search": /* + */  {
            let site = fs.readFileSync("./views/searchResult.html").toString();
            if (req.method == 'POST') {
                var body = '';
                req.on('data', function (data) {
                    body += data;
                });
                req.on("end", () => {
                    var text = ""
                    var post = parser.parse(body);
                    connection.connect((err) => {
                        let query_searchSelect = "select product_id, product_name, product_price, product_description, product_image from products where product_name = '" + post['search'] + "'";
                        connection.query(query_searchSelect, (err, result, fields) => {
                            if (result.length == 0) {
                                text = " <h3 class=\"filter\">There are no products with this name</h3>"
                            } else {
                                var index = 1;
                                text = '<div class="row center-mobile" style="margin-top: 50px">'
                                result.forEach(element => {

                                    text += '<div class="col"><div class="card center-mobile" style="width: 18rem;"><img src="/images/' + element.product_image + '" class="card-img-top" style="padding: 15px" alt="..."><div class="card-body"><h5 class="card-title">' + element.product_name + '</h5><p class="card-text">' + element.product_description + '</p><a href="" id="' + element.product_id + '" class="btn btn-primary">Add to cart</a><p style="float:right; margin-right: 40px;">' + element.product_price + '</p></div></div></div>';
                                    index++;
                                    if (index == 6) {
                                        text += '</div><div class="row center-mobile" style="margin-top: 50px">'
                                        index = 1;
                                    }
                                });
                                text += '</div>'
                            }

                            site = site.replace("{{cards}}", text);
                            selectContent().then(v => {
                                site = site.replace('{{header}}', header())
                                site = site.replace('{{footer}}', footer())
                                site = site.replace("{{title}}", "Search result")
                                site = site.replace("{{menu}}", ifLogged());
                                site = site.replace("{{select}}", v);
                                res.writeHead(200, { "Content-Type": "text/html" });
                                res.end(site);
                            });
                        });
                    });
                });
            }
            break;
        }
        case "delivery": /* + */  {
            let site = fs.readFileSync("./views/deliveryPage.html").toString();
            selectContent().then(v => {
                site = site.replace('{{header}}', header())
                site = site.replace('{{footer}}', footer())
                site = site.replace("{{title}}", "Delivery")
                site = site.replace("{{menu}}", ifLogged());
                site = site.replace("{{select}}", v);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(site);
            });
            break;
        }
        case "contact": /* + */ {
            let site = fs.readFileSync("./views/contactPage.html").toString();
            selectContent().then(v => {
                site = site.replace('{{header}}', header())
                site = site.replace('{{footer}}', footer())
                site = site.replace("{{title}}", "Contact")
                site = site.replace("{{menu}}", ifLogged());
                site = site.replace("{{select}}", v);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(site);
            });
            break;
        }
        case "about_us": /* + */ {
            let site = fs.readFileSync("./views/aboutUsPage.html").toString();
            selectContent().then(v => {
                site = site.replace('{{header}}', header())
                site = site.replace('{{footer}}', footer())
                site = site.replace("{{title}}", "About us")
                site = site.replace("{{menu}}", ifLogged());
                site = site.replace("{{select}}", v);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(site);
            });
            break;
        }
        case "images": /* + */ {
            console.log(url[1]);
            let file_extension = url[1].split('.');
            console.log(file_extension)
            if (file_extension[1] == "jpg") {
                let image = fs.readFileSync("./images/" + url[1]);
                res.writeHead(200, { "Content-Type": "image/jpeg" });
                res.end(image, 'binary');
                break;
            } else {
                let image = fs.readFileSync("./images/" + url[1]);
                res.writeHead(200, { "Content-Type": "image/png" });
                res.end(image, 'binary');
                break;
            }

        }
        case "addToBasket": /* + */{
            // url[0] - addtobasket
            //url [1] - element id 

            console.log(url)
            basket.push(url[1])
            let text = "";
            let site = fs.readFileSync("./views/productsListPage.html").toString();
            connection.connect((err) => {
                let query_selectProducts = "select product_id, product_name, product_price, product_description, product_image from products";
                connection.query(query_selectProducts, (err, result, fields) => {
                    var index = 1;
                    text = '<br><div class="row center-mobile" style="margin-top: 50px; display:flex;">'
                    result.forEach(element => {

                        text += '<div class="col"><div class="card center-mobile" style="width: 18rem;"><img src="/images/' + element.product_image + '" class="card-img-top" style="padding: 15px" alt="..."><div class="card-body"><h5 class="card-title">' + element.product_name + '</h5><p class="card-text">' + element.product_description + '</p>'
                        if (logStatus == 1) {
                            text += '<a href="/addToBasket/' + element.product_id + '" class="btn btn-primary">Add to cart</a><p style="float:right; margin-right: 40px;">' + element.product_price + '</p></div></div></div>';
                            index++;
                        } else {
                            text += '<p style="float:right; margin-right: 40px;">' + element.product_price + '</p></div></div></div>';
                            index++;
                        }




                        if (index == 6) {
                            text += '</div><div class="row center-mobile" style="margin-top: 50px">'
                            index = 1;
                        }
                    });

                    text += '</div>'
                    site = site.replace("{{cards}}", text);
                    selectContent().then(v => {
                        site = site.replace('{{header}}', header())
                        site = site.replace('{{footer}}', footer())
                        site = site.replace("{{title}}", "Products")
                        site = site.replace("{{menu}}", ifLogged());
                        site = site.replace("{{alert}}", "<script>alert('Successfully add!')</script>")
                        site = site.replace("{{category}}", "All categories");
                        site = site.replace("{{select}}", v);
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end(site);
                    });
                })
            })
            break;
        }   
        case "placeOrder": {
                /* 
                    podsumowanie (dodawanie zamówienia do bazy)
                */
            site = fs.readFileSync("./views/orderDetails.html").toString()
            if (req.method == 'POST') {
                var body = '';

                req.on('data', function (data) {
                    body += data;
                });

                req.on("end", () => {
                    var text = ""
                    let payment = ""
                    let deliveryPrice = 0
                    var post = parser.parse(body);
                    connection.connect((err) => {
                        let products = "items id: "
                        let sum = basket_sum
                        let address = post.address1 + " " + post.address2 + " " + post.city
                        
                        basket.forEach(el => {
                            products += el+";"
                        });
                        
                        if(post.flexRadioDefault.value == 14.99)
                        {
                            payment = "Cash on delivery"
                            deliveryPrice = 14.99
                            sum += 14.99
                        }
                             
                        else{
                            payment = "online payment"
                            deliveryPrice = 9.99
                            sum += 9.99
                        }
                            
                        products+= " Total price:" +sum
                        let query_insertOrder = "insert into orders values('',"+userID+",'"+post.fname+"','"+post.lName+"','"+address+"','"+payment+"','"+products+"')"
                        connection.query(query_insertOrder, (err, result, fields)=>{

                        })
                        let query_orderid = "select order_id from orders order by order_id DESC limit 1"
                        connection.query(query_orderid, (err, result, fields) => {
                            text = "number: " +result[0].order_id 
                        })
                        selectContent().then(v => {
                        
                        let total = '<div class="card text-bg-secondary mb-3" style="width: 18rem; margin: 0 auto;"><div class="card-header">Basket price: ' + basket_sum + '<br>Delivery price: '+deliveryPrice+'</div><div class="card-body"><h5 class="card-title">Order price: ' + sum + '</h5></div></div>'
                            site = site.replace('{{header}}', header())
                            site = site.replace('{{footer}}', footer())
                            site = site.replace("{{title}}", "Order details")
                            site = site.replace("{{menu}}", ifLogged());
                            site = site.replace("{{ordId}}", text)
                            site = site.replace("{{total}}", total)
                            site = site.replace("{{select}}", v);
                            res.writeHead(200, { "Content-Type": "text/html" });
                            res.end(site);
                        });


                    });
                });
            }
            break;
        }
        case "order": /* + */ {
            let site = fs.readFileSync("./views/orderPage.html").toString();
            selectContent().then(v => {

                site = site.replace('{{header}}', header())
                site = site.replace('{{footer}}', footer())
                site = site.replace("{{title}}", "Order")
                // site = site.replace("{{cards}}",text)
                // site = site.replace("{{category}}", cat);
                // site = site.replace("{{summary}}", summary)
                site = site.replace("{{menu}}", ifLogged());
                site = site.replace("{{select}}", v);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(site);
            });
            break
        }
        case "DeleteFromBasket" /* + */:
            {
                var index = basket.indexOf(url[1])
                basket.splice(index, 1)
                let text = ""
                let sum = 0.0
                let site = fs.readFileSync("./views/basketPage.html").toString();
                connection.connect((err) => {
                    basket.forEach(element => {
                        let query_basketSelect = "select product_id, product_name, product_price, product_description, product_image from products where product_id = " + element
                        connection.query(query_basketSelect, (err, result, field) => {
                            sum += result[0].product_price
                            text += '<div class="card mb-3 center-mobile2" style="max-width: 70vw;"><div class="row g-0"><div class="col-md-4"><img src="/images/' + result[0].product_image + '" class="img-fluid rounded-start" alt="..." style="width: 200px; height: 200px; margin: 2%"></div><div class="col-md-8"><div class="card-body"><h5 class="card-title">' + result[0].product_name + '</h5><p class="card-text">' + result[0].product_description + '</p><p class="card-text text-body-secondary">' + result[0].product_price + '</p><a href="/DeleteFromBasket/' + result[0].product_id + '" class="btn btn-primary">Delete from cart</a></div></div></div></div>'
                        });
                    });

                    selectContent().then(v => {
                        summary = '<div class="card text-bg-secondary mb-3" style="max-width: 18rem;"><div class="card-header">Basket price: ' + sum + '<br>Delivery price: ?.??</div><div class="card-body"><h5 class="card-title">Order price: ' + sum + '</h5><a href="/order" class="btn btn-primary">Go to shipping method</a></div></div>'
                        site = site.replace('{{header}}', header())
                        site = site.replace('{{footer}}', footer())
                        site = site.replace("{{title}}", "Basket")
                        site = site.replace("{{cards}}", text)
                        basket_sum = sum
                        // site = site.replace("{{category}}", cat);
                        site = site.replace("{{summary}}", summary)
                        site = site.replace("{{menu}}", ifLogged());
                        site = site.replace("{{select}}", v);
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end(site);
                    });
                })

                break
            }
        case "basket": /* + */{
            let text = ""
            let sum = 0.0
            let site = fs.readFileSync("./views/basketPage.html").toString();
            connection.connect((err) => {
                basket.forEach(element => {
                    let query_basketSelect = "select product_id, product_name, product_price, product_description, product_image from products where product_id = " + element
                    connection.query(query_basketSelect, (err, result, field) => {
                        sum += result[0].product_price
                        text += '<div class="card mb-3 center-mobile2" style="max-width: 70vw;"><div class="row g-0"><div class="col-md-4"><img src="/images/' + result[0].product_image + '" class="img-fluid rounded-start" alt="..." style="width: 200px; height: 200px; margin: 2%"></div><div class="col-md-8"><div class="card-body"><h5 class="card-title">' + result[0].product_name + '</h5><p class="card-text">' + result[0].product_description + '</p><p class="card-text text-body-secondary">' + result[0].product_price + '</p><a href="/DeleteFromBasket/' + result[0].product_id + '" class="btn btn-primary">Delete from cart</a></div></div></div></div>'
                    });
                });

                selectContent().then(v => {
                    summary = '<div class="card text-bg-secondary mb-3" style="max-width: 18rem;"><div class="card-header">Basket price: ' + sum + '<br>Delivery price: ?.??</div><div class="card-body"><h5 class="card-title">Order price: ' + sum + '</h5><a href="/order" class="btn btn-primary">Go to shipping method</a></div></div>'
                    basket_sum = sum
                    site = site.replace('{{header}}', header())
                    site = site.replace('{{footer}}', footer())
                    site = site.replace("{{title}}", "Basket")
                    site = site.replace("{{cards}}", text)
                    // site = site.replace("{{category}}", cat);
                    site = site.replace("{{summary}}", summary)
                    site = site.replace("{{menu}}", ifLogged());
                    site = site.replace("{{select}}", v);
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(site);
                });
            })

            break
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