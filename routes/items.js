module.exports = app => {
    const Items = app.db.models.Items;

    app.route("/items")
        .all(app.auth.authenticate())
        /**
         * @api {get} /items Return a full list of items entered by the user
         * @apiGroup Items
         * @apiHeader {String} Authorization Token of authenticated user
         * @apiHeaderExample {json} Header
         *  {"Authorization": "JWT asdhfkashdkfhkasdfka"}
         * @apiSuccess {Number} id Item id
         * @apiSuccess {Number} itemID Item unique identifier
         * @apiSuccess {String} itemName Item name
         * @apiSuccess {Number} price Item price
         * @apiSuccess {String} description Item description
         * @apiSuccess {String} material Main material used
         * @apiSuccess {String} creator Item creator
         * @apiSuccess {Date} updatedAt Updated date and time
         * @apiSuccess {Date} createdAt Created date and time
         * @apiSuccess {Number} UserId User id
         * @apiSuccessExample {json} Success
         *  HTTP/1.1 200 OK
         *  {
         *      "id": 1,
         *      "itemID": 102,
         *      "itemName": "Handmade Vase",
         *      "price": 25.50,
         *      "description": "A beautifully crafted vase.",
         *      "material": "Ceramic",
         *      "creator": "John Doe",
         *      "createdAt": "2024-01-01T00:00:00.000Z",
         *      "updatedAt": "2024-01-01T00:00:00.000Z",
         *      "UserId": 1
         *  }
         * @apiErrorExample {json} List error
         *  HTTP/1.1 412 Precondition Failed
         */
        .get((req, res) => {
            Items.findAll({
                where: { userId: req.user.id }
            })
            .then(result => res.json(result))
            .catch(error => {
                 res.status(412).json({msg: error.message});
            });
        })
        /**
         * @api {post} /items Submit a new item
         * @apiGroup Items
         * @apiHeader {String} Authorization Token of authenticated user
         * @apiHeaderExample {json} Header
         *  {"Authorization": "JWT asdhfkashdkfhkasdfka"}
         * @apiParam {String} itemName Item name
         * @apiParam {Number} price Item price
         * @apiParam {String} description Item description
         * @apiParam {String} material Main material used
         * @apiParam {String} creator Item creator
         * @apiParamExample {json} Input
         *  {
         *      "itemName": "Handmade Vase",
         *      "price": 25.50,
         *      "description": "A beautifully crafted vase.",
         *      "material": "Ceramic",
         *      "creator": "John Doe"
         *  }
         * @apiSuccess {Number} id Item id
         * @apiSuccess {String} itemName Item name
         * @apiSuccess {Number} price Item price
         * @apiSuccess {String} description Item description
         * @apiSuccess {String} material Main material used
         * @apiSuccess {String} creator Item creator
         * @apiSuccess {Date} updatedAt Updated date and time
         * @apiSuccess {Date} createdAt Created date and time
         * @apiSuccess {Number} UserId User id
         * @apiSuccessExample {json} Success
         *  HTTP/1.1 200 OK
         *  {
         *      "id": 1,
         *      "itemName": "Handmade Vase",
         *      "price": 25.50,
         *      "description": "A beautifully crafted vase.",
         *      "material": "Ceramic",
         *      "creator": "John Doe",
         *      "updatedAt": "2024-01-01T00:00:00.000Z",
         *      "createdAt": "2024-01-01T00:00:00.000Z",
         *      "UserId": 1
         *  }
         * @apiErrorExample {json} Submission error
         *  HTTP/1.1 412 Precondition Failed
         */
        .post((req, res) => {
            req.body.UserId = req.user.id;
            Items.create(req.body)
                .then(result => res.json(result))
                .catch(error => {
                     res.status(412).json({msg: error.message});
                });
        });

    app.route("/items/:id")
        .all(app.auth.authenticate())
        /**
         * @api {get} /items/:id Get a single item
         * @apiGroup Items
         * @apiHeader {String} Authorization Token of authenticated user
         * @apiHeaderExample {json} Header
         * {"Authorization": "JWT asdhfkashdkfhkasdfka"}
         * @apiSuccess {Number} id Item id
         * @apiSuccess {String} itemName Item name
         * @apiSuccess {Number} price Item price
         * @apiSuccess {String} description Item description
         * @apiSuccess {String} material Main material used
         * @apiSuccess {String} creator Item creator
         * @apiSuccess {Date} updatedAt Updated date and time
         * @apiSuccess {Date} createdAt Created date and time
         * @apiSuccess {Number} UserId User id
         * @apiSuccessExample {json} Success
         *  HTTP/1.1 200 OK
         * {
         *      "id": 1,
         *      "itemName": "Handmade Vase",
         *      "price": 25.50,
         *      "description": "A beautifully crafted vase.",
         *      "material": "Ceramic",
         *      "creator": "John Doe",
         *      "updatedAt": "2024-01-01T00:00:00.000Z",
         *      "createdAt": "2024-01-01T00:00:00.000Z",
         *      "UserId": 1
         * }
         * @apiErrorExample {json} Item not found error
         *  HTTP/1.1 404 Not Found
         * @apiErrorExample {json} Find error
         *  HTTP/1.1 412 Precondition Failed
         */
        .get((req, res) => {
            Items.findOne({
                where: {
                    id: req.params.id,
                    userId: req.user.id
                }
            })
            .then(result => {
                if (result) {
                    res.json(result);
                } else {
                    res.sendStatus(404);
                }
            })
            .catch(error => {
                res.status(412).json({msg: error.message});
            })
        })
        /**
         * @api {put} /items/:id Update an item
         * @apiGroup Items
         * @apiHeader {String} Authorization Token of authenticated user
         * @apiHeaderExample {json} Header
         * {"Authorization": "JWT asdhfkashdkfhkasdfka"}
         * @apiParam {Number} id Item id
         * @apiParam {String} itemName Item name
         * @apiParam {Number} price Item price
         * @apiParam {String} description Item description
         * @apiParam {String} material Main material used
         * @apiParam {String} creator Item creator
         * @apiParamExample {json} Input
         *  {
         *      "itemName": "Handmade Vase",
         *      "price": 25.50,
         *      "description": "A beautifully crafted vase.",
         *      "material": "Ceramic",
         *      "creator": "John Doe"
         *  }
         * @apiSuccessExample {json} Success
         *  HTTP/1.1 204 No Content
         * @apiErrorExample {json} Update error
         *  HTTP/1.1 412 Precondition Failed
         */
        .put((req, res) => {
            Items.update(req.body, {
                where: {
                    id: req.params.id,
                    userId: req.user.id
                }
            })
            .then(result => res.sendStatus(204))
            .catch(error => {
                res.status(412).json({msg: error.message});
            });
        })
        /**
         * @api {delete} /items/:id Remove an item
         * @apiGroup Items
         * @apiHeader {String} Authorization Token of authenticated user
         * @apiHeaderExample {json} Header
         * {"Authorization": "JWT asdhfkashdkfhkasdfka"}
         * @apiParam {Number} id Item id
         * @apiSuccessExample {json} Success
         * HTTP/1.1 204 No Content
         * @apiErrorExample {json} Delete error
         * HTTP/1.1 412 Precondition Failed
         */
        .delete((req, res) => {
            Items.destroy({
                where: {
                    id: req.params.id,
                    userId: req.user.id
                }
            })
            .then(result => res.sendStatus(204))
            .catch(error => {
                res.status(412).json({msg: error.message});
            });
        });
}


        