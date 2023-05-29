import authRouter from './auth'
import insertRouter from './insert'
import categoryRouter from './category'
import postRouter from './post'
import priceRouter from './price'
import acreageRouter from './acreage'
import addressRouter from './address'
import mailerRouter from './mailer'
import userRouter from './user'
import blogRouter from './blog'
import paymentRouter from './payment'
import reportRouter from './report'
import listPriceRouter from './listPrice'

const initRoutes = (app) => {
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/insert', insertRouter)
    app.use('/api/v1/category', categoryRouter)
    app.use('/api/v1/post', postRouter)
    app.use('/api/v1/price', priceRouter)
    app.use('/api/v1/acreage', acreageRouter)
    app.use('/api/v1/address', addressRouter)
    app.use('/api/v1/mailer', mailerRouter)
    app.use('/api/v1/blog', blogRouter)
    app.use('/api/v1/payment', paymentRouter)
    app.use('/api/v1/report', reportRouter)
    app.use('/api/v1/price_list', listPriceRouter)

    return app.use('/', (req, res) => {
        res.send('server on ...!')
    })
}

export default initRoutes