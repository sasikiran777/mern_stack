import mongodb from "mongodb"

const ObjectId = mongodb.ObjectId
let review

export default class ReviewsDao {
    static async init(conn) {
        if (review)
            return
        try {
            review = await conn.db(process.env.REST_REVIEWS_NS).collection('reviews')
        } catch (e) {
            console.error(`Unable to connect to reviews --> ${e}`)
        }
    }

    static async createReview(data) {

    }

    static async updateReview(data) {

    }

    static async deleteReview(data) {

    }
}
