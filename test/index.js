var app = require('../lib/main.js')()

app.use((req, res, next) => {
    console.log('use handle')
    next()
})
app.get('/list', (req, res, next) => {
    console.log('get /list handle')
    res.json({ status: 0, message: '7777' })
})
app.post('/detail', (req, res, next) => {
    console.log('post /detail handle')
})
app.listen(3000, () => {
    console.log('server running on port 3000')
})