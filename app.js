// require packages used in the project
const express = require('express') //載入express
const app = express() //設定app為主入口
const port = 3000
const exphbs = require('express-handlebars') // require express-handlebars
const mongoose = require('mongoose') //載入mongoose

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const restaurantsList = require('./restaurant.json') //載入restaurant.json

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) //設定連線到mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})


// routes setting for index頁面
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantsList.results })
})

//定義(使用者在搜尋欄輸入關鍵字)路由，並以toLowerCase()優化搜尋體驗
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantsList.results.filter(
    restaurant => {
      return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword)
    })
  res.render('index', { restaurants: restaurants, keyword: keyword }) //優化：把使用者搜尋的關鍵字帶回頁面
})


//routes setting for show頁面,(透過params取得id，再藉id從restaurant.json中篩選出特定電影)
app.get('/restaurants/:id', (req, res) => {
  const restaurantData = restaurantsList.results.find(
    data => data.id.toString() === req.params.id //data一字的位置似乎可以是任何英文restaurant等等，不影響結果
  )
  res.render('show', { restaurantsList: restaurantData }) //puting the restaurant data into 'show' partial template
})

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public')) // setting static files 設定靜態檔案之路由

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})

