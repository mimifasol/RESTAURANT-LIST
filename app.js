// require packages used in the project
const express = require('express') //載入express
const mongoose = require('mongoose') //載入mongoose
const app = express() //設定app為主入口
const port = 3000
const exphbs = require('express-handlebars') // require express-handlebars
const bodyParser = require('body-parser')
const restaurant = require('./models/restaurant')//載入Restaurant model

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//const restaurantsList = require('./restaurant.json') //載入restaurant.json(暫時用，完成後可刪去)

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

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public')) // setting static files 設定靜態檔案之路由
app.use(bodyParser.urlencoded({ extended: true }))//與範例不同express

// 瀏覽全部餐廳
app.get('/', ( req, res) => {
  restaurant.find()//範例多{}
    .lean()
    .then(restaurantData => res.render('index', { restaurantData }))
    .catch(error => console.log(error))
  //res.render('index', { restaurants: restaurantsList.results })
})

//新增餐廳頁面
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

//新增餐廳
app.post('/restaurants', (req, res) => {
  console.log('req.body', req.body)
  restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//瀏覽特定頁面
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

//搜尋特定餐廳：定義(使用者在搜尋欄輸入關鍵字)路由，並以toLowerCase()優化搜尋體驗

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase()
  restaurant.find()
    .lean()
    .then(restaurants => {
      const restaurantFiltered = restaurants.filter(
        restaurant =>
          restaurant.name.toLowerCase().includes(keyword) || restaurant.category.toLowerCase().includes(keyword))
      // console.log(restaurantFiltered)
      res.render('index', { restaurantData: restaurantFiltered })
    })
    .catch(error => console.log('search error!'))

})
/*   const restaurants = restaurants.results.filter(
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
}) */



//編輯餐廳頁面之1
app.get("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id
  return restaurant.findById(id)
    .lean()
    .then(restaurant => res.render("edit", { restaurant }))
    .catch(err => console.log(err))
})

//編輯餐廳頁面之2 (以put方式)
// 更新餐廳
app.post("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id
  const name = req.params.id
  return restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name;
      return restaurant.save()
    })
    .then(() => res.redirect('/restaurants/${id}'))
    .catch(err => console.log(err))
})

//刪除功能
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return restaurant.findById(id)
    .then(data => data.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})

console.log('restaurant')