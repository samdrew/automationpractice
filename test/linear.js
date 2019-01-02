const {Builder, By, until} = require('selenium-webdriver');
const {expect} = require('chai');

const waitTimeout = 1000;
const testParams = {
    "username" : "random@mailinator.com",
    "password" : "password",
    "product" : {
        "id" : 7,
        "desc" : "Printed Chiffon Dress",
        "price" : "16.40",
        "colour" : "color_15"
    }
}

var state = {
    "cart" : {
        "products" : [],
        "total" : 0,
        "shipping" : false
    }
}

describe ("Purchase a dress", function() {
    let driver = new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions( /* … */)
        .setChromeOptions( /* … */)
        .build();

    // Set mocha timeout
    this.timeout(20000);

    before("open sign in page and log into website", function(done) {
        driver.get("http://automationpractice.com/index.php?controller=authentication&back=my-account")
            .then(_ => driver.findElement(By.id("email")).sendKeys(testParams.username))
            .then(_ => driver.findElement(By.id("passwd")).sendKeys(testParams.password))
            .then(_ => driver.findElement(By.id("SubmitLogin")).click())
            .then(_ => driver.getTitle())
            .then(title => {
                expect(title).equals("My account - My Store");
                done();
            });
    });

    describe("from homepage", function() {
        it("loads " + testParams.product.desc + " product page when clicked", function(done) {
            let qvElement = "/html/body/div[1]/div[2]/div/div[2]/div/div[1]/ul[1]/li["+testParams.product.id+"]";
            driver.get("http://automationpractice.com/index.php")
                .then(_ => driver.findElement(By.xpath(qvElement)).click())
                .then(_ => driver.getTitle())
                .then(title => {
                    expect(title).equals(testParams.product.desc + " - My Store");
                    done();
                });
        });

        it("adds item to basket when selected", function(done) {
            driver.then(_ => driver.wait(until.elementLocated(By.id(testParams.product.colour)), waitTimeout))
                .then(_ => driver.findElement(By.id(testParams.product.colour)).click())
                .then(_ => driver.findElement(By.name("Submit")).click())
                .then(_ => driver.wait(until.elementIsVisible(driver.findElement(By.id("layer_cart"))), waitTimeout))
                .then(_ => driver.findElement(By.id("layer_cart")).getCssValue("display"))
                .then(css => {
                    state.cart.total += parseInt(testParams.product.price, 10);
                    expect(css).equals("block");
                    done();
                });
        });

        it("loads the checkout when proceed is selected", function(done) {
            let procElement = "/html/body/div[1]/div[1]/header/div[3]/div/div/div[4]/div[1]/div[2]/div[4]/a/span";
            driver.then(_ => driver.findElement(By.xpath(procElement)).click())
                .then(_ => driver.getTitle())
                .then(title => {
                    expect(title).equals("Order - My Store");
                    done();
                });
        });

        it("goes to address on proceed to checkout", function(done) {
            driver.then(_ => driver.findElement(By.partialLinkText("Proceed to checkout")).click())
                .then(_ => driver.findElement(By.className("navigation_page")).getText())
                .then(text => {
                    expect(text).equals("Addresses");
                    done();
                });
        });

        it("loads shipping information and adds shipping to price", function(done) {
            let priceElement = "/html/body/div[1]/div[2]/div/div[3]/div/div/form/div/div[2]/div[1]/div/div/table/tbody/tr/td[4]/div"
            driver.then(_ => driver.findElement(By.name("processAddress")).click())
                .then(_ => driver.findElement(By.className("navigation_page")).getText())
                .then(text => expect(text).equals("Shipping"))
                .then(_ => driver.findElement(By.xpath(priceElement)).getText())
                .then(price => {
                    let shippingPrice = price;
                    state.cart.total += parseInt(shippingPrice.substring(1, shippingPrice.length), 10);
                    state.cart.shipping = true;
                    done();
                })
        });

        it("loads order information with correct price", function(done) {
            driver.then(_ => driver.findElement(By.name("cgv")).click())
                .then(_ => driver.findElement(By.name("processCarrier")).click())
                .then(_ => driver.findElement(By.className("navigation_page")).getText())
                .then(text => expect(text).equals("Your payment method"))
                .then(_ => driver.findElement(By.id("total_price")).getText())
                .then(price => {
                    let totalPrice = price;
                    expect(parseInt(totalPrice.substring(1, totalPrice.length), 10)).to.equal(state.cart.total);
                    done();
                })
        });

        it("pays by wire transfer", function(done) {
            driver.then(_ => driver.findElement(By.className("bankwire")).click())
                .then(_ => driver.findElement(By.className("navigation_page")).getText())
                .then(text => {
                    expect(text).equals("Bank-wire payment.");
                    done();
                });
        })

        it("confirms the wire transfer details", function(done) {
            let continueElement = "/html/body/div[1]/div[2]/div/div[3]/div/form/p/button";
            driver.then(_ => driver.findElement(By.xpath(continueElement)).click())
                .then(_ => driver.findElement(By.className("navigation_page")).getText())
                .then(text => {
                    expect(text).equals("Order confirmation");
                    done();
                });
        })
    });
});