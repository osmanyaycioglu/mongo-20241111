db.comments.find({ name: "John Bishop" }).limit(5)
db.comments.find({ name: { $eq: "John Bishop" } }).limit(5)
db.comments.find({ name: "John Bishop", movie_id: ObjectId('573a1391f29313caabcd6f98') })
db.comments.find({ $and: [{ name: "John Bishop" }, { movie_id: ObjectId('573a1391f29313caabcd6f98') }] })
db.embedded_movies.find(
    {
        $or: [
            {
                $and: [
                    { runtime: 199 },
                    { year: 1914 }
                ]
            },
            { year: { $lte: 1914 } }
        ]
    },
    {
        plot_embedding: 0
    }).limit(20)

db.embedded_movies.find(
    {
        $or: [
            { runtime: { $gte: 199 } },
            { year: { $gte: 1914 } }]
    },
    {
        runtime: 1,
        year: 1,
        title: 1
    }).limit(20)

db.embedded_movies.find(
    {
        $and: [
            { runtime: { $gt: 199 } },
            { year: { $gt: 2000 } },
            { title: /^tin/i }
        ]
    },
    {
        runtime: 1,
        year: 1,
        title: 1
    }).limit(20)

db.embedded_movies.find(
    {
        $and: [
            { runtime: { $gt: 199 } },
            { year: { $gt: 2000 } },
            { title: /^the/i }
        ]
    },
    {
        runtime: 1,
        year: 1,
        title: 1
    }).limit(20)

db.embedded_movies.find(
    {
        $and: [
            { runtime: { $gt: 199 } },
            { year: { $gt: 2000 } },
            { title: { $regex: /^the/, $options: 'i' } }
        ]
    },
    {
        runtime: 1,
        year: 1,
        title: 1
    }).limit(20)

db.embedded_movies.find({ runtime: { $in: [199, 11, 600] } }, { plot_embedding: 0 }).limit(5)
db.embedded_movies.find({ runtime: { $in: [600, 11, 199] } }, { plot_embedding: 0 }).limit(5)
db.embedded_movies.find({ $or: [{ runtime: 600 }, { runtime: 11 }, { runtime: { $lt: 199 } }] }, { plot_embedding: 0 }).limit(5)

db.embedded_movies.find({ title: { $in: [/^the/i, /^into/i] } }, { plot_embedding: 0 }).limit(5)

db.embedded_movies.find({ title: { $nin: [/^the/i, /^into/i] } }, { plot_embedding: 0 }).limit(5)

db.embedded_movies.find({ "awards.nominations": 1 }, { awards: 1, title: 1 }).limit(5)


db.embedded_movies.find({ "genres": "Action" }, { awards: 1, title: 1, genres: 1 }).limit(20)
db.embedded_movies.find({ "genres": ["Action"] }, { awards: 1, title: 1, genres: 1 }).limit(20)

db.embedded_movies.find({ "genres": { $all: ["Action", "Comedy"] } }, { awards: 1, title: 1, genres: 1 }).limit(20)

db.embedded_movies.find({ $and: [{ "genres": { $size: 2 } }, { "genres": { $all: ["Action", "Comedy"] } }] }, { awards: 1, title: 1, genres: 1 }).limit(20)


db.survey.insertMany([
    {
        "_id": 1, "results": [{ "product": "abc", "score": 10 },
        { "product": "xyz", "score": 5 }]
    },
    {
        "_id": 2, "results": [{ "product": "abc", "score": 8 },
        { "product": "xyz", "score": 7 }]
    },
    {
        "_id": 3, "results": [{ "product": "abc", "score": 7 },
        { "product": "xyz", "score": 8 }]
    },
    {
        "_id": 4, "results": [{ "product": "abc", "score": 7 },
        { "product": "def", "score": 8 }]
    },
    { "_id": 5, "results": { "product": "xyz", "score": 7 } }
])

db.survey.find({ "results": { $elemMatch: { "product": "abc", "score": 10 } } }).limit(20)
db.survey.find({ "results": { $elemMatch: { "product": "def", "score": { $gte: 8 } } } })
db.survey.find({ "results": { $elemMatch: { "product": { $ne: "def" } } } })

db.embedded_movies.find({}, { plot_embedding: 0 }).limit(20)

db.embedded_movies.updateOne({ _id: ObjectId('573a1393f29313caabcdc953') }, { $pop: { cast: 1 } })
db.embedded_movies.find({ _id: ObjectId('573a1393f29313caabcdc953') }, { plot_embedding: 0 })

// arrays
db.embedded_movies.updateOne({ _id: ObjectId('573a1393f29313caabcdc953') }, { $push: { cast: "osman" } })

db.embedded_movies.updateOne(
    { _id: ObjectId('573a1393f29313caabcdc953') },
    {
        $push:
        {
            cast:
            {
                $each: ["ali", "mehmet"]
            }
        }
    }
)


db.embedded_movies.updateOne(
    { _id: ObjectId('573a1393f29313caabcdc953') },
    {
        $push:
        {
            cast:
            {
                $each: ["ayşe", "fatma"],
                $sort: 1
            }
        }
    }
)

db.embedded_movies.updateOne(
    { _id: ObjectId('573a1393f29313caabcdc953') },
    {
        $push:
        {
            cast:
            {
                $each: ["gizem", "fatma"],
                $sort: 1
            }
        }
    }
)

db.embedded_movies.updateOne(
    { _id: ObjectId('573a1393f29313caabcdc953') },
    {
        $push:
        {
            cast:
            {
                $each: ["mustafa", "orhan"],
                $sort: 1,
                $slice : 5
            }
        }
    }
)

db.embedded_movies.updateOne(
    { _id: ObjectId('573a1393f29313caabcdc953') },
    {
        $push:
        {
            cast:
            {
                $each: ["mustafa", "orhan"],
                $sort: 1,
                $slice : -3
            }
        }
    }
)

db.embedded_movies.updateOne(
    { _id: ObjectId('573a1393f29313caabcdc953') },
    {
        $push:
        {
            cast:
            {
                $each: ["mustafa", "orhan"]
            }
        }
    }
)

db.embedded_movies.updateOne(
    { _id: ObjectId('573a1393f29313caabcdc953') },
    {
        $addToSet:
        {
            cast:
            {
                $each: ["mustafa", "orhan"]
            }
        }
    }
)


db.embedded_movies.updateOne(
    { _id: ObjectId('573a1393f29313caabcdc953') },
    {
        $push:
        {
            cast:
            {
                "address" : "deneme",
                "phone" : "9823472374"
            }
        }
    }
)


db.embedded_movies.updateOne(
    { _id: ObjectId('573a1393f29313caabcdc953') },
    {
        $pull:
        {
            cast:
            {
                $type : 3
            }
        }
    }
)

db.embedded_movies.updateOne(
    { _id: ObjectId('573a1393f29313caabcdc953') },
    {
        $pullAll:
        {
            cast: ["mustafa", "orhan"]
        }
    }
)

db.embedded_movies.updateOne(
    { _id: ObjectId('573a1393f29313caabcdc953'), cast : "mustafa" },
    {
        $set:
        {
            "cast.$" : "osman"
        }
    }
)

db.embedded_movies.updateOne(
    { _id: ObjectId('573a1393f29313caabcdc953')},
    {
        $set:
        {
            "cast.$[]" : "osman"
        }
    }
)


db.embedded_movies.updateOne(
    { _id: ObjectId('573a1393f29313caabcdc953')},
    {
        $set:
        {
            "cast.$[el]" : "osman"
        }
    },
    {
        "arrayFilters" : [ {"el" : "fatma" }]
    }
)

db.embedded_movies.updateOne(
    { _id: ObjectId('573a1393f29313caabcdc953')},
    {
        $set:
        {
            "cast.$[xyz]" : "gizem"
        }
    },
    {
        "arrayFilters" : [ {"xyz" : "ali" }]
    }
)
