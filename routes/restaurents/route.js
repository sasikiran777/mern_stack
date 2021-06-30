import express from "express";
import RestaurantController from "../../controllers/restaurant_controller.js";
import ReviewsController from "../../controllers/reviews_controller";

const router = express.Router()

router.route('/').get(RestaurantController.getRestaurant)

router.route('/reviews')
    .post(ReviewsController.createReview)
    .patch(ReviewsController.updateReview)
    .delete(ReviewsController.deleteReview)

export default router
