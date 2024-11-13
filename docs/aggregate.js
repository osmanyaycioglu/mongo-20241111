db.embedded_movies.aggregate(
    [
        {
            $match: {
                runtime: { $gte: 600 }
            }
        },
        {
            $project: {
                plot: 1,
                genres: 1,
                runtime: 1,
                title: 1,
                year: 1,
                yearRun: { $sum: ["$runtime", "$year"] }
            }
        }
    ]
)

db.embedded_movies.aggregate(
    [
        {
            $match: {
                runtime: { $gte: 600 }
            }
        },
        {
            $project: {
                plot: 1,
                genres: 1,
                runtime: 1,
                title: 1,
                year: 1,
                imdb: 1,
                yearRun: { $sum: ["$runtime", "$year"] },
                imdbSuccess: {
                    $cond: {
                        if: { $gte: ["$imdb.rating", 8] },
                        then: "high",
                        else: "low"
                    }
                }
            }
        }
    ]
)

db.embedded_movies.aggregate(
    [
        {
            $match: {
                runtime: { $gte: 300 }
            }
        },
        {
            $project: {
                plot: 1,
                genres: 1,
                runtime: 1,
                title: 1,
                year: 1,
                imdb: 1,
                yearRun: { $sum: ["$runtime", "$year"] },
                imdbSuccess: {
                    $switch: {
                        branches: [
                            { case: { $gte: ["$imdb.rating", 8] }, then: "high" },
                            { case: { $gte: ["$imdb.rating", 6] }, then: "mid" },
                            { case: { $lt: ["$imdb.rating", 6] }, then: "low" }
                        ]
                    }
                }
            }
        }
    ]
)

db.imdb.aggregate(
    [
        {
            $match: {
                runtime: { $gte: 300 }
            }
        },
        {
            $project: {
                plot: 1,
                genres: 1,
                runtime: 1,
                title: 1,
                year: 1,
                imdb: 1,
                yearRun: { $sum: ["$runtime", "$year"] },
                imdbSuccess: {
                    $switch: {
                        branches: [
                            { case: { $gte: ["$imdb.rating", 8] }, then: "high" },
                            { case: { $gte: ["$imdb.rating", 6] }, then: "mid" },
                            { case: { $lt: ["$imdb.rating", 6] }, then: "low" }
                        ]
                    }
                },
                sortedCountries: {
                    $function: {
                        body: function (abc) {
                            if (abc == null) {
                                return null;
                            } else {
                                return abc.sort();
                            }
                        },
                        args: ["$countries"],
                        lang: "js"
                    }
                }
            }
        }
    ]
)

db.embedded_movies.aggregate(
    [
        {
            $project: {
                plot: 1,
                genres: 1,
                runtime: 1,
                title: 1,
                year: 1,
                imdb: 1
            }
        },
        {
            $match: {
                runtime: { $gte: 300 }
            }
        },
        {
            $addFields: {
                yearRun: { $sum: ["$runtime", "$year"] },
                imdbSuccess: {
                    $switch: {
                        branches: [
                            { case: { $gte: ["$imdb.rating", 8] }, then: "high" },
                            { case: { $gte: ["$imdb.rating", 6] }, then: "mid" },
                            { case: { $lt: ["$imdb.rating", 6] }, then: "low" }
                        ]
                    }
                }
            }
        },
        {
            $out: "output"
        }

    ]
)

db.embedded_movies.aggregate(
    [
        {
            $project: {
                plot: 1,
                genres: 1,
                runtime: 1,
                title: 1,
                year: 1,
                imdb: 1
            }
        },
        {
            $match: {
                runtime: { $gte: 300 }
            }
        },
        {
            $addFields: {
                yearRun: { $sum: ["$runtime", "$year"] },
                imdbSuccess: {
                    $switch: {
                        branches: [
                            { case: { $gte: ["$imdb.rating", 8] }, then: "high" },
                            { case: { $gte: ["$imdb.rating", 6] }, then: "mid" },
                            { case: { $lt: ["$imdb.rating", 6] }, then: "low" }
                        ]
                    }
                }
            }
        },
        {
            $merge: { into: "myOutput", on: "_id", whenMatched: "replace", whenNotMatched: "insert" }
        }
    ]
)


db.car.aggregate(
    [
        {
            $project: {
                name: 1,
                model: 1,
                year: 1,
                price: 1,
                variations: 1
            }
        },
        { $unwind: "$variations" },
        {
            $group: {
                _id: "$variations.variation",
                car_count: {
                    $sum: 1
                },
                avg_price:
                    { $avg: "$price" }
            }
        },
        {
            $project : {
                car_count:1,
                trunc_avg : {$trunc : ["$avg_price" ,2]}
            }

        }

    ]
)

db.car.aggregate(
    [
        {
            $project: {
                name: 1,
                model: 1,
                year: 1,
                price: 1,
                variations: 1
            }
        },
        {
            $group: {
                _id: "$year",
                car_count: {
                    $sum: 1
                }
            }
        }
    ]
)


db.car.aggregate(
    [
        {
            $project: {
                name: 1,
                model: 1,
                year: 1,
                price: 1,
                variations: 1
            }
        },
        {
            $group: {
                _id: "$year",
                car_count: {
                    $sum: 1
                },
                cars:
                    { $addToSet: {car_name: "$name",car_model: "$model"} }
            }
        }
    ]
)


db.car.aggregate(
    [
        {
            $project: {
                name: 1,
                model: 1,
                year: 1,
                price: 1,
                variations: 1
            }
        },
        {
            $group: {
                _id: "$year",
                car_count: {
                    $sum: 1
                },
                cars:
                    { $addToSet: { $concat : ["$name","-","$model"]} }
            }
        }
    ]
)

db.car.aggregate(
    [
        {
            $project: {
                name: 1,
                model: 1,
                year: 1,
                price: 1,
                variations: 1
            }
        },
        {
            $group: {
                _id: "$name",
                car_count: {
                    $sum: 1
                },
                cars:
                    { $push: "$model" }
            }
        }
    ]
)

db.car.aggregate(
    [
        {
            $project: {
                name: 1,
                model: 1,
                year: 1,
                price: 1,
                variations: 1
            }
        },
        {
            $bucket: {
                groupBy: "$year",
                boundaries: [1970,1980,1990,2000,2010,2020],
                default: "others",
                output:{
                    car_count: {
                        $sum: 1
                    }
                }
            }
        }
    ]
)

db.car.aggregate(
    [
        {
            $project: {
                name: 1,
                model: 1,
                year: 1,
                price: 1,
                variations: 1
            }
        },
        {
            $bucketAuto: {
                groupBy: "$year",
                buckets: 10,
                output:{
                    car_count: {
                        $sum: 1
                    }
                },
                granularity: "E12"
            }
        }
    ]
)

db.imdb.aggregate(
    [
        {
            $project: {
                tomatoes: 1,
                genres: 1
            }
        },
        {
            $group: {
                _id: "$tomatoes.viewer.rating",
                movie_count: {
                    $sum: 1
                },
                genres:
                    { $addToSet: {$arrayElemAt : ["$genres",0] } }
            }
        }
    ]
)

