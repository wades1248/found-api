const express = require('express');
const ItemsService = require('./itemsService');
const ItemsRouter = express.Router();
const xss = require('xss');
const jsonparser = express.json()
const path = require('path')

const serializeItem = item => ({
    city: xss(item.city),
    business: xss(item.business),
    phone: item.phone,
    itemtype: item.itemtype,
    description: xss(item.description),
    confirmation: item.confirmation
})
ItemsRouter
    .route('/')
        .get((req, res, next) => {
            const connect= req.app.get('db')
            ItemsService.getAllItems(connect)
                .then(items => {
                    res.json(items.map(serializeItem))
                })
                .catch(next)
        })
        .post(jsonparser, (req,res,next)=> {
            const connect = req.app.get('db')
            const {city, business, phone, itemtype, description, confirmation} = req.body
            const newItem = {city, business, phone, itemtype, description, confirmation}

            for(const [key, value] of Object.entries(newItem)){
                if(value == null){
                    return res.status(400).json({
                        error: {message: `Missing '${key}' in request body`}
                    })
                }
            }
            ItemsService.insertItem(connect, newItem)
                .then(item => {
                    res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${item.confirmation}`))
                    .json(serializeItem(item))
                })
                .catch(next)
        })
ItemsRouter
        .route('/:item_confirmation')
        .all((req, res, next) => {
            const connect = req.app.get('db')
            ItemsService.getByConfirmation(connect, req.params.item_confirmation)
                .then(item => {
                    if(!item){
                        return res
                            .status(404)
                            .json({error: {message: 'Item does not exist'}})
                    }
                    res.item = item
                    next()
                })
                .catch(next)
        })
        .get((req, res, next)=>{
            res.json(serializeItem(res.item))
        })
        .delete((req,res,next)=> {
            const connect = req.app.get('db')
            ItemsService.deleteItem(connect, req.params.item_confirmation)
                .then(() => {
                    res.status(204).end()
                })
                .catch(next)
        })
module.exports = ItemsRouter