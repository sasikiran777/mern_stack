let restaurants;
import mongodb from "mongodb"

const ObjectId = mongodb.ObjectId

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
            if ('name' in filters) {
                // In order to search with text we need to create an index in mongodb
                // process => database->table(collection)->indexes->create index->{add your field and type}
                query = {$text: {$search: filters['name']}}
            } else if ("cuisine" in filters) {
                query = {'cuisine': {$eq: filters['cuisine']}}
            } else if ('zipcode' in filters) {
                query = {'address.zipcode': {$eq: filters["zipcode"]}}
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

    static async getRestaurantById(id) {
        try {
            id = new ObjectId(id)
            const pipeline = [
                {
                    $match: {
                        _id: id,
                    },
                },
                {
                    $lookup: {
                        from: 'reviews',
                        let: {
                            id: "$_id",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$restaurantId", "$$id"]
                                    }
                                }
                            },
                            {
                                $sort: {
                                    date: -1,
                                },
                            },
                        ],
                        as: "reviews",
                    },
                },
                {
                    $addFields: {
                        reviews: "$reviews",
                    }
                }
            ]
            return await restaurants.aggregate(pipeline).next()
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    static async getRestaurantCuisines() {
        let cuisines = []
        try {
            cuisines = await restaurants.distinct("cuisine")
        } catch (e) {
            console.error(e)
        }
        return cuisines
    }
}
