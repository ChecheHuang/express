import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prismadb = new PrismaClient()
const reset = async () => {
  await prismadb.user.deleteMany()
}

const userSeed = async () => {
  const create = await prismadb.user.create({
    data: {
      account: 'account',
      password: await bcrypt.hash('password', 12),
    },
  })
}

async function main() {
  try {
    await reset()
    console.log('reset done')
    console.log('Start seeding ...')
    await userSeed()
    console.log('Seeding finished ...')
  } catch (err) {
    console.log(err)
  }
}

void main()
