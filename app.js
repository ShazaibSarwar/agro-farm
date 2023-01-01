const path = require("path");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const xss = require("xss-clean");
const cors = require("cors");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const adsRouter = require("./routes/adsRoute");
const surveyRouter = require("./routes/surveyRoutes");
const contactRouter = require("./routes/contactRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");
const mongoSanitize = require("express-mongo-sanitize");
const bodyParser = require("body-parser");
const multer = require("multer");
const stripe = require("stripe")(
  "sk_test_51MHCC9KQZxZ5ZgrKeVK49TltKb3lpvEHeJSCoxeOiqfijGMATO1qdSLrGFYYT9RLRpfZisu4zfKL4kQ5h5SbJgUD00FqNzJqwB"
);

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(cors());
app.options("*", cors());
if (process.env.NODE_ENV == "development") {
    app.use(morgan("dev"));
}

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer().array())

app.use(express.static(`${__dirname}/public`));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

app.get("/", (req, res) => {
    res.status(200).send("Hello from server");
});

app.post("/create-payment-intent", async (req, res) => {
  const { items, price } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: price,
    currency: "usd",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/surveys", surveyRouter);
app.use("/api/v1/contactus", contactRouter);
app.use("/api/v1/ads", adsRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messageRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
