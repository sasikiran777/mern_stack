import express from "express";
import RestaurantController from "../../controllers/restaurant_controller.js";
import ReviewsController from "../../controllers/reviews_controller.js";

const router = express.Router()

router.route('/').get(RestaurantController.getRestaurant)
router.route('/id/:id').get(RestaurantController.getRestaurantById)
router.route('/cuisines').get(RestaurantController.getRestaurantCuisines)

router.route('/reviews')
    .post(ReviewsController.createReview)
    .patch(ReviewsController.updateReview)
    .delete(ReviewsController.deleteReview)

export default router
