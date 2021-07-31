import mongodb from "mongodb"

const ObjectId = mongodb.ObjectId
let review

export default class ReviewsDao {
    static async injectDB(conn) {
        if (review)
            return
        try {
            review = await conn.db(process.env.REST_REVIEWS_NS).collection('reviews')
        } catch (e) {
            console.error(`Unable to connect to reviews --> ${e}`)
        }
    }

    static async createReview(data) {
        data.restaurantId = ObjectId(data.restaurantId)
        return await review.insertOne(data)
    }

    static async updateReview(data) {
        return await review.updateOne(
            {user_id: data.user_id, _id:ObjectId(data.review_id)},
            {$set: {review: data.text, date:data.date}}
        )
    }

    static async deleteReview(data) {
        return await review.deleteOne(
            {_id: ObjectId(data.review_id), user_id: data.user_id}
        )
    }
}
