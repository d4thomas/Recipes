import mongoose from 'mongoose'
import { beforeAll, afterAll } from '@jest/globals'
import { initDatabase } from '../db/init.js'

// Before testing
beforeAll(async () => {
  await initDatabase()
})

// After testing
afterAll(async () => {
  await mongoose.disconnect()
})
