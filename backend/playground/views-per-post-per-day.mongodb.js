/* global use, db */
use('recipes-simulated')
db.getCollection('events').aggregate([
  {
    $match: { action: 'startView' },
  },
  {
    $project: {
      recipe: '$recipe',
      day: { $dateTrunc: { date: '$date', unit: 'day' } },
    },
  },
  {
    $group: {
      _id: { recipe: '$recipe', day: '$day' },
      views: { $count: {} },
    },
  },
])
