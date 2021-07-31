import ReviewsDao from "../api/dao/reviews_dao.js";

export default class ReviewsController {
    static async createReview(req, res, nxt) {
        try {
            let data = {}
            data.review = req.body.review
            data.restaurantId = req.body.restaurantId
            data.name = req.body.name
            data.date = Date()
            data.user_id = req.body.user_id

            let response = await ReviewsDao.createReview(data)

            if (response) {
                return res.json('success').status(201)
            }
            return res.json({'error': 'Can not create post'}).status(400)
        } catch (e) {
            console.error(e)
            return res.json({'error': 'something went wrong'}).status(400)
        }
    }

    static async updateReview(req, res, nxt) {
        try {
            let data = {}
            data.review_id = req.body.review_id
            data.text = req.body.text
            data.date = Date()
            data.user_id = req.body.user_id

            const response = ReviewsDao.updateReview(data)

            if(response)
            {
                return res.json('success').status(200)
            }
            return res.json({'error': 'Can not update review'}).status(400)
        } catch (e) {
            console.error("error occurred while updating a review --> ". e)
            return res.json({'error': 'Can not update review'}).status(400)
        }
    }

    static async deleteReview(req, res, nxt) {
        try {
            let data = {}
            data.review_id = req.query.review_id
            data.user_id = req.body.user_id

            const response = ReviewsDao.deleteReview(data)

            if(response)
            {
                return res.json('success').status(200)
            }
            return res.json({'error': 'Can not delete review'}).status(400)
        } catch (e) {
            console.error("error occurred while deleting a review --> ". e)
            return res.json({'error': 'Can not delete review'}).status(400)
        }
    }
}
