import dotenv from 'dotenv'
import moduleAlias from 'module-alias'
export default function loadEnv() {
  if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: './.env.development' })
  }
  if (process.env.NODE_ENV === 'production') {
    moduleAlias.addAliases({
      '@': 'dist',
    })
    dotenv.config({ path: './.env.production' })
  }
}
