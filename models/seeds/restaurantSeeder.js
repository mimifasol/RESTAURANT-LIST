import { connect, connection } from "mongoose" //載入mongoose
import { create } from "../restaurant"//載入restaurant model
import { results as restaurantList } from "../../restaurant.json"

connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) //設定連線到mongoDB

// 取得資料庫連線狀態
const db = connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('running restaurantSeeder script...') //執行腳本(寫新增餐廳資料腳本)

  create(restaurantList)
    .then(() => {
      console.log("restaurantSeeder done!")
      db.close()
    })
    .catch(err => console.log(err))
})