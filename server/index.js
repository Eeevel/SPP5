const express = require('express')
const {graphql, buildSchema} = require('graphql')
const {graphqlHTTP} = require('express-graphql')
const cors = require('cors')
const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: String,
    message: String,
    status: String,
    date: String,
}, {versionKey: false})

const articles = mongoose.model("Article", articleSchema)

const schema = buildSchema(`
    type Article {
        title: String
        message: String
        status: String
        date: String
    }
    type Query{
        getAllArticles: [Article]
    }
    type Mutation {
        createArticle(title: String!, message: String!, status: String!, date: String!): Article
    }
`)

const rootValue = {
    getAllArticles: () => {
        return articles.find({})
    },
    createArticle: ({title, message, status, date}) => {
        const article = {title, message, status, date}
        articles.create(article).then(r => {
            console.log(r)
        })
        return article
    }
}

const app = express()
app.use(cors())

app.use(`/graphql`, graphqlHTTP({
    rootValue, schema, graphiql: true
}))

async function start() {
    try {
        await mongoose.connect('mongodb://localhost:27017/websokets',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            }
        )
        app.listen(4000, () => {
            console.log('Server has been started...')
        })
    } catch (e) {
        console.log(e)
    }
}

start()
