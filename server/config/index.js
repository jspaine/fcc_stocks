const env = process.env.NODE_ENV || 'development'
const port = env === 'development' ? 8000 : 8001

export default {
  env,
  protocol: process.env.PROTOCOL || 'http',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || port,
  ioPort: 8002
}
