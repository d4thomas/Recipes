/* global use, db */
use('recipes-simulated')
db.getCollection('events').aggregate([
  {
    $match: { action: 'startView' },
  },
  {
    $group: {
      _id: '$recipe',
      views: { $count: {} },
    },
  },
])
