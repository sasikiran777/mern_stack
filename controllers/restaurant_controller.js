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
    static async getRestaurantById(req, res, nxt) {
        try {
            let id = req.params.id || {}
            let restaurant = await RestaurantDao.getRestaurantById(id)
            if(!restaurant) {
                return res.status(404).json({message: 'Not Found'})
            }
            return res.status(200).json({data: restaurant})
        } catch (e) {
            return res.status(500).json({error: e})
        }
    }
    static async getRestaurantCuisines(req, res, nxt) {
        try {
            let restaurant = await RestaurantDao.getRestaurantCuisines()
            return res.status(200).json({data: restaurant})
        } catch (e) {
            return res.status(500).json({error: e})
        }
    }
}
