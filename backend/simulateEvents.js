import dotenv from 'dotenv'
import { initDatabase } from './src/db/init.js'
import { Recipe } from './src/db/models/recipe.js'
import { User } from './src/db/models/user.js'
import { Event } from './src/db/models/event.js'
import { createUser } from './src/services/users.js'
import { createRecipe } from './src/services/recipes.js'
import { trackEvent } from './src/services/events.js'

dotenv.config()

const simulationStart = Date.now() - 1000 * 60 * 60 * 24 * 30
const simulationEnd = Date.now()
const simulatedUsers = 5
const simulatedRecipes = 10
const simulatedViews = 10000
async function simulateEvents() {
  const connection = await initDatabase()
  await User.deleteMany({})
  const createdUsers = await Promise.all(
    Array(simulatedUsers)
      .fill(null)
      .map(
        async (_, u) =>
          await createUser({
            username: `user-${u}`,
            password: `password-${u}`,
          }),
      ),
  )
  console.log(`created ${createdUsers.length} users`)
  await Recipe.deleteMany({})
  const createdRecipes = await Promise.all(
    Array(simulatedRecipes)
      .fill(null)
      .map(async (_, p) => {
        const randomUser =
          createdUsers[Math.floor(Math.random() * simulatedUsers)]
        return await createRecipe(randomUser._id, {
          title: `Test Recipe ${p}`,
          contents: `This is a test recipe ${p}`,
          image:
            'https://www.nhlbi.nih.gov/sites/default/files/styles/16x9_crop/public/2025-03/Ultraprocessed%20foods%20display%202%20framed%20-%20shutterstock_2137640529_r.jpg?h=ab94ba44&itok=yrOIN-8T',
        })
      }),
  )
  console.log(`created ${createdRecipes.length} recipes`)
  await Event.deleteMany({})
  const createdViews = await Promise.all(
    Array(simulatedViews)
      .fill(null)
      .map(async () => {
        const randomRecipe =
          createdRecipes[Math.floor(Math.random() * simulatedRecipes)]
        const sessionStart =
          simulationStart + Math.random() * (simulationEnd - simulationStart)
        const sessionEnd =
          sessionStart + 1000 * Math.floor(Math.random() * 60 * 5)
        const event = await trackEvent({
          recipeId: randomRecipe._id,
          action: 'startView',
          date: new Date(sessionStart),
        })
        await trackEvent({
          recipeId: randomRecipe._id,
          session: event.session,
          action: 'endView',
          date: new Date(sessionEnd),
        })
      }),
  )
  console.log(`successfully simulated ${createdViews.length} views`)
  await connection.disconnect()
}
simulateEvents()
