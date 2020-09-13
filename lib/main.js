const http = require('http')
const slice = Array.prototype.slice

class Express {
    constructor() {
        this.routes = {
            all: [],
            get: [],
            post: []
        }
    }
    register(path) {
        const info = {}
        if (typeof path === 'string') {
            info.path = path
            info.stacks = slice.call(arguments, 1)
        } else {
            info.path = '/'
            info.stacks = slice.call(arguments, 0)
        }
        return info
    }
    use() {
        const info = this.register.apply(this, arguments)
        this.routes.all.push(info)
    }
    get() {
        const info = this.register.apply(this, arguments)
        this.routes.get.push(info)
    }
    post() {
        const info = this.register.apply(this, arguments)
        this.routes.post.push(info)
    }
    handle(req, res, stacks) {
        console.log(stacks)
        const next = () => {
            const middleware = stacks.shift()
            if (middleware) {
                middleware(req, res, next)
            }
        }
        next()
    }
    listen(...args) {
        const server = http.createServer((req, res) => {
            res.json = (data) => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
            }
            const url = req.url
            const method = req.method.toLowerCase()

            let stacks = []
            if (url === '/favicon.ico') {
                return stacks
            }
            let curRoutes = []
            curRoutes = curRoutes.concat(this.routes.all)
            curRoutes = curRoutes.concat(this.routes[method])

            curRoutes.forEach(info => {
                if (url.indexOf(info.path) === 0) {
                    stacks = stacks.concat(info.stacks)
                }
            })
            this.handle(req, res, stacks)
        })
        server.listen(...args)
    }

}

module.exports = () => {
    return new Express()
}