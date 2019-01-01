const {describe} = require("mocha");

var chai = require('chai')
    , chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

const urlHome = "http://automationpractice.com";

var state = {
    "authenticated" : false,
    "cart" : []
}

const pages = {
    "root" : {
        "type" : "redirect",
        "description": "URL root page",
        "uri": "/",
        "statusCode" : 302,
        "redirectTo" : "/index.php"
    },
    "home" : {
        "type" : "page",
        "description": "Home page",
        "uri" : "/index.php",
        "testable" : ["basic", "authenticated", "cart"],
        "title" : "My Store"
    },
    "cart" : {
        "type" : "page",
        "description": "Shopping cart",
        "uri" : "/index.php?controller=order",
        "testable" : ["basic", "authenticated", "cart"],
        "title" : "Order - My Store"
    },
    "product" : {
        "type" : "class",
        "description": "Product page for $name$",
        "uri" : "/index.php?controller=product&id_product=$id$",
        "testable" : ["basic", "authenticated", "cart"],
        "title" : "$name$ - My Store",
        "instances" : [
            {"id" : 5, "name" : "Printed Summer Dress"}
        ]
    }
};

class Page {
    constructor(pageBuilder) {
        this.test_array = [];
        this.description = pageBuilder.description;
        if (pageBuilder.type == "page") {
            if (pageBuilder.testable.includes("basic")) {
                this.test_array.push(function(){
                    it("returns HTTP-200 and has the title \"" + pageBuilder.title + "\"", function(done) {
                        chai.request(urlHome)
                            .get(pageBuilder.uri)
                            .end(function (err, res) {
                                expect(res).to.have.status(200);
                                expect(res.text).to.contain("<title>"+pageBuilder.title+"</title>");
                                done();
                            });
                })});
            }
            if (pageBuilder.testable.includes("authenticated")) {
                if (!state.authenticated) {
                    this.test_array.push(function(){
                        it("invites user to sign in", function(done) {
                            chai.request(urlHome)
                                .get(pageBuilder.uri)
                                .end(function (err, res) {
                                    expect(res.text).to.contain('<a class="login" href="http://automationpractice.com/index.php?controller=my-account" rel="nofollow" title="Log in to your customer account">');
                                    done();
                                });
                        });
                    });
                } else {
                    this.test_array.push(function(){
                        it("display's users name", function(done) {
                            chai.request(urlHome)
                                .get(pageBuilder.uri)
                                .end(function (err, res) {
                                    expect(res.text).to.contain('<span>Random </span>');
                                    done();
                                });
                        });
                    });
                }
            }
        } else if (pageBuilder.type == "redirect") {
            this.test_array.push(function(){
                it("redirects to \"" + pageBuilder.redirectTo + "\"", function(done) {
                    chai.request(urlHome)
                        .get(pageBuilder.uri)
                        .end(function (err, res) {
                            expect(res).to.redirectTo(urlHome + pageBuilder.redirectTo);
                            done();
                        });
                })});
        }
    }

    request() {
        let i = 0;
        for (; i < this.test_array.length; i++) {
            this.test_array[i]();
        }
    }
}

describe("Testing against " + urlHome, function() {
    it("returns HTTP-200 and HTML content", function(done){
        chai.request(urlHome)
            .get('/')
            .end(function(err, res) {
                expect(res).to.redirectTo(urlHome + '/index.php');
                done();
            });
    });

    let homePage = new Page(pages.home);
    homePage.request()

    let rootPage = new Page(pages.root);
    rootPage.request()
});