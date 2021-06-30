import RestaurantDao from "../api/dao/restaurant_dao.js";

export default class RestaurantController {
    static async getRestaurant(req, res, nxt) {
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage) : 20
        const page = req.query.page ? parseInt(req.query.page) : 0

        let filters = {}
        if(req.query.cuisine) {
            filters.cuisine = req.query.cuisine
        } else if(req.query.zipcode) {
            filters.zipcode = req.query.zipcode
        }else if(req.query.name) {
            filters.name = req.query.name
        }

        const { restaurantsList, totalNumRestaurants } = await RestaurantDao.getRestaurants({
            filters,
            page,
            restaurantsPerPage
        })

        let response = {
            restaurants: restaurantsList,
            current_count: restaurantsList.length,
            total_restaurants: totalNumRestaurants,
            entries_per_page: restaurantsPerPage,
            filters: filters,
            page: page
        }
        return res.json(response)
    }
}
