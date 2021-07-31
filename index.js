import app from "./server.js";
import mongodb from "mongodb"
import dotenv from "dotenv"
import RestaurantDao from "./api/dao/restaurant_dao.js";
import ReviewsDao from "./api/dao/reviews_dao.js";

dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.REST_REVIEWS_DB_URI,
    {
        poolSize: 50,
        wtimeout: 2500,
        useNewUrlParser: true
    })
    .catch(error => {
        console.log(error.stack)
        process.exit(1)
    })
    .then(async client => {
        await RestaurantDao.injectDB(client)
        await ReviewsDao.injectDB(client)
        app.listen(port, () => {
            console.log(`listing to port ${port}`)
        })
    })
