let restaurants;

export default class RestaurantDao {
    static async injectDB(conn) {
        try {
            if (restaurants)
                return
            restaurants = await conn.db(process.env.REST_REVIEWS_NS).collection('restaurants')
        } catch (e) {
            console.error(`injectDB error -> ${e}`)
        }
    }

    static async getRestaurants(
        {
            filters = null,
            page = 0,
            restaurantsPerPage = 20
    } = {}) {
        let query
        if (filters) {
            if('name' in filters) {
                // In order to search with text we need to create an index in mongodb
                // process => database->table(collection)->indexes->create index->{add your field and type}
                query = {$text: { $search: filters['name'] }}
            } else if("cuisine" in filters) {
                query = {'cuisine': { $eq: filters['cuisine'] }}
            } else if('zipcode' in filters) {
                query = {'address.zipcode': { $eq: filters["zipcode"] }}
            }
        }

        let cursor
        try {
            cursor = await restaurants.find(query)
        } catch (e) {
            console.error(`error when getting restaurants -> ${e}`)
            return {restaurantsList: [], totalNumRestaurants: 0}
        }

        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

        try {
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query)
            return {restaurantsList, totalNumRestaurants}
        } catch (e) {
            console.error(`unable to convert restaurants array -> ${e}`)
            return {restaurantsList: [], totalNumRestaurants: 0}
        }
    }
}
