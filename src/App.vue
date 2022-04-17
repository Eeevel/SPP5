<template>
  <div id="app">
    <div style="margin: 0 20% 0 20%">
      <form  enctype="multipart/form-data">
        <h2>Create article</h2>
        <div class="input-field">
          <input id="articleName" type="text" name="title" required placeholder="Article name" v-model="form.title">
        </div>
        <div class="input-field">
        <textarea id="messageArticle" type="text" name="message" required placeholder="Article description"
                  style="resize:vertical;
        min-height:150px" v-model="form.message"
        ></textarea>
        </div>
        <p>
          <label>
            <input name="status_order" id="london" type="radio" value="London" v-model="form.status" checked/>
            <span>London</span>
          </label>
        </p>
        <p>
          <label>
            <input name="status_order" id="paris" type="radio" value="Paris" v-model="form.status"/>
            <span>Paris</span>
          </label>
        </p>
        <div>
          <input id="date" type="date" class="datepicker" name="date" required v-model="form.date">
        </div>
        <button @click.prevent="createArticle" type="submit" class="btn" style="margin-top:20px;">Create</button>
      </form>

      <button style="margin-top: 30px" type="submit" @click="getArticles" class="btn">Open Articles</button>
    </div>

    <div style="margin: auto" v-if="articles.length !== 0">
      <table style="margin: auto;width: 730px; margin-top: 20px">
        <tr>
          <th>Title</th>
          <th>Message</th>
          <th>City</th>
          <th>Date</th>
        </tr>
        <tr v-for="(article) in articles" v-bind:key="article">
          <td>{{ article.title }}</td>
          <td>{{ article.message }}</td>
          <td>{{ article.status }}</td>
          <td>{{ article.date }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {
      showArticlesFlag: false,
      numberArticles: 0,
      form: {
        title: '',
        message: '',
        status: '',
        date: '',
      },
      articles: [],
      newArticle: null
    }
  },
  methods: {
    async createArticle() {
      let title = this.form.title
      let message = this.form.message
      let status = this.form.status
      let date = this.form.date

      try {
        const res = await axios.post(
            'http://localhost:4000/graphql', {
              query: `mutation createArticle($title: String!, $message: String!, $status: String!, $date: String!) {
                      createArticle(title: $title, message: $message, status: $status, date: $date) {
                        title
                        message
                        status
                        date
                      }
              }`,
              variables: {
                title: title,
                message: message,
                status: status,
                date: date,
              }
            })
        this.newArticle = res.data.data
        console.log(this.newArticle)
      } catch (e) {
        console.log('err', e)
      }
    },
    async getArticles() {
      this.numberArticles = 0
      this.showArticlesFlag = true;
      try {
        const res = await axios.post(
            'http://localhost:4000/graphql', {
              query: `{
                getAllArticles {
                  title
                  message
                  status
                  date
                }
               }`
            })
        this.articles = res.data.data.getAllArticles
        console.log(res.data.data.getAllArticles)
      } catch (e) {
        console.log('err', e)
      }
    }
  }
}
</script>