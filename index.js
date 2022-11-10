const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config()
require('colors')
const port = process.env.PORT || 5000
const app = express()
/*=================================================================
                   MiddleWare 
==================================================================*/     app.use(cors())
app.use(express.json())
/*=================================================================
              Data Base Connection 
==================================================================*/
const url = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASSE_PASSWORD}@cluster0.0ang8.mongodb.net/test`

const client = new MongoClient(url)
async function dataBaseInit(){
  try {
    await  client.connect()
    console.log("DateBase Connected Sucessfully !!!".cyan.bold)
    
  } catch (error) {
    console.log(error.message.red.bold)
  }

}
// collections 
const services = client.db('assignment-11').collection('services')
const reviews = client.db('assignment-11').collection('reviews')
dataBaseInit()
/*=================================================================
                         Route 
==================================================================*/ 

app.get('/',(req ,res)=>{ 
  res.send(" Service Review server is running !!! ")
 })
app.get('/services', async(req,res)=>{
    const lim = parseInt(req.query.l) 
    const q   = req.query.q
    if(q){ 
      const data = services.find({_id:ObjectId(q)})
      const result = await data.toArray() 
      res.send(result)   
    }
    else{
      const data   = services.find({}).limit(lim)
      const result = await data.toArray() 
      res.send(result)
    }
 })
 app.post('/services', async(req,res)=>{
    serveiceObj = req.body.newService 
    const  result = await services.insertOne(serveiceObj)
    res.status(201).send({ message:"Service Created Successfull !" , docId:result.insertedId})
 })



app.get('/reviews',async(req,res)=>{ 
  const q = req.query.q
  const  data =  reviews.find({serveiceId:q})
  const result = await data.toArray()
  res.send(result)

})
app.get('/my-reviews',async(req,res)=>{
  const email = req.query.email 

  const data = reviews.find({email:email})
  const result = await data.toArray()
  res.send(result)
})


app.post('/review',async(req,res)=>{ 
  reviewObj = req.body.newReview
  const  result = await reviews.insertOne(reviewObj)
  res.status(201).send({ message:"Review Created Successfull !" , docId:result.insertedId})

})
/*=================================================================
          App init  
==================================================================*/ 
app.listen(port,()=>{ console.log(`app is runnng at:${port}`)})
