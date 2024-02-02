const router = require('express').Router();
const Product = require('../models/product');
const dotenv = require('dotenv');
dotenv.config();
//Cache
const redis = require('redis');
const redisClient = redis.createClient({
    url: process.env.REDIS_URL // Redis URL'niz
});
redisClient.connect().catch(console.error);






router.post('/create', async (req,res)=>{
    const product = new Product({
        name:req.body.name,
        price:req.body.price,
        description:req.body.description,
        currency:req.body.currency,
        seller_id:req.body.seller_id,
        in_stock:req.body.in_stock,
        delivery_options:req.body.delivery_options
    });
    try{
        const savedProduct = await product.save();
        res.send(savedProduct);
    }catch(err){
        res.status(400).send(err);
    }
});



router.get('/products', async(req,res)=>{
    try{
        let sort = {};

        // Sıralama parametresini kontrol et
        if (req.query.sort) {
            // Örneğin, req.query.sort değeri 'price_asc' veya 'price_desc' olabilir
            if (req.query.sort === 'price_asc') {
                sort.price = 1;
            } else if (req.query.sort === 'price_desc') {
                sort.price = -1;
            }
        }
        
        //Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skipIndex = (page - 1) * limit;

        //cache
        const redisKey = `products:sort_${req.query.sort}:page_${page}:limit_${limit}`;
        // Redis'ten önbelleklenmiş veriyi kontrol et
        const cachedProducts = await redisClient.get(redisKey);
        if (cachedProducts) {
            return res.send(JSON.parse(cachedProducts));
        }

        const products = await Product.find({}).sort(sort).limit(limit).skip(skipIndex);


        // Sonucu Redis'e kaydet
        await redisClient.set(redisKey, JSON.stringify(products), {
            EX: 60 * 60 // 1 saat süreyle önbellekte tut
        });


        res.send(products);
    }catch(err){
        res.status(400).send(err);
    }

});


router.patch('/productUpdate/:id', async (req,res)=>{
    try{
        const product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!product) {return res.status(404).send();}
        else{res.status(200).send(product);}
    }catch(err){
        res.status(400).send(err);
    }
});


router.delete('/productDelete/:id', async (req,res)=>{
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product){
            res.status(404).send();
        }else{
            res.status(200).send();
        }
    }catch(err){
        res.status(400).send(err);
    }
});



module.exports=router;