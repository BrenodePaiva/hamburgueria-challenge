const express = require("express")
const uuid = require("uuid")

const app = express()
const port = 3002
app.use(express.json())

const hamburgueOrde = []
const status = "Em preparação"

// Middleware
const httpInfo = ("/hamburgueria", (request, response, next) => {
    const url = request.url
    const method = request.method
    console.log(``)
    console.log(`----------------${method}-------------------------------------------------------------`)
    console.log(`Request URL ${url}   Methodo: ${method}`)
    console.log(`---------------------------------------------------------------------------------`)
    console.log(``)

    next()
})

// Middleware
const checkOrdeId = ("/hamburgueria/:id", (request, response, next) => {
    const {id} = request.params
    const findOrderIndex = hamburgueOrde.findIndex(order => order.id === id)

    if (findOrderIndex < 0) {
        return response.status(404).json({Error:"Order not Found"})        
    }

    request.orderId = id
    request.orderIndex = findOrderIndex

    next()
})

// POST
app.post("/hamburgueria", httpInfo, (request, response) => {
    const id = uuid.v4()
    const {order, clientName, price} = request.body
    const orderCreate = {id, order, clientName, price, status}

    hamburgueOrde.push(orderCreate)

    return response.status(201).json(orderCreate)
})

// GET
app.get("/hamburgueria", httpInfo, (request, response) => {

    return response.json(hamburgueOrde)
})

// PUT
app.put("/hamburgueria/:id", httpInfo, checkOrdeId, (request, response) => {
    const id = request.orderId
    const {order, clientName, price} = request.body
    const updateOrder = {id, order, clientName, price, status}

    hamburgueOrde[request.orderIndex] = updateOrder

    return response.json(hamburgueOrde)
})

// Delete
app.delete("/hamburgueria/:id", httpInfo, checkOrdeId, (request, response) => {

    hamburgueOrde.splice(request.orderIndex, 1)

    return response.status(204).json("")
})

// GET by id
app.get("/hamburgueria/:id", httpInfo, checkOrdeId, (request, response) => {

    return response.json(hamburgueOrde[request.orderIndex])
})

// PATCH
app.patch("/hamburgueria/:id", httpInfo, checkOrdeId, (request, response) => {
    
    hamburgueOrde[request.orderIndex].status = "Pronto"
    
    return response.json(hamburgueOrde)
})



app.listen(port, () => {
    console.log(`🚀 Server Started on port: ${port}`)
})