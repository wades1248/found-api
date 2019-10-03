# Found API

This is an API for use with Found, a lost and fount app tha reconnects people with items left behnd at businesses. Users may post items to, access items on, and delete items from the server. 

## Technologies

This API was built using Node.js and Express. The database was built with postgres.sql. Migrations are handled with postgrator. 

## CORS

This API supports currently supports GET, POST, and DELETE operations for the "items" endpoints.

## API Documentation

### Authorization

This API requires Bearer token authorization with a verified API Token. As of now API tokens are not available to the public upon request.

### /items

The /items endpoint supports GET and POST methods 
example url: https://sleepy-atoll-97874.herokuapp.com/api/items

### /items/:item_confirmation

The /itemss/:item_confirmation endpoint supports GET and DELEte methods
example url: https://sleepy-atoll-97874.herokuapp.com/api/items/463cfa90-e4d1-11e9-80d6-edf9336d54d9
