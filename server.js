
var koa = require('koa');
var _ = require('koa-route');
var bodyParse = require('co-body');
var logger = require('koa-logger');
var liveKey = process.env.STRIPE_LIVE_SECRET;
if (!liveKey) throw new Error("Please set STRIPE_LIVE_SECRET env");
var testKey = process.env.STRIPE_TEST_SECRET;
if (!testKey) throw new Error("Please set STRIPE_TEST_SECRET env");
var stripeLive = require("stripe")(liveKey);
var stripeTest = require("stripe")(testKey);

var app = koa();
console.log(process.env.STRIPE_LIVE_SECRET)
app.use(logger());

app.use(_.post("/api/subscribe", function* () {
  var body = yield bodyParse(this);
  var stripe = body.livemode ? stripeLive : stripeTest;  
  console.log("request", body)
  var customer = yield function (callback) {
    stripe.customers.create({
      card: body.stripeToken,
      plan: body.plan,
      email: body.email
    }, callback);
  };
  console.log(customer);
  this.redirect("https://creationix.com/success.html");  
}));

var port = process.env.PORT || 3000;

app.listen(port);
console.log("Stripe Handler Listening at port %s.", port);

