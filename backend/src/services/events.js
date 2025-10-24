import { v4 as uuidv4 } from 'uuid'
import { Event } from '../db/models/event.js'

export async function trackEvent({
  recipeId,
  action,
  session = uuidv4(),
  date = Date.now(),
}) {
  const event = new Event({ recipe: recipeId, action, session, date })
  return await event.save()
}

export async function getTotalViews(recipeId) {
  return {
    views: await Event.countDocuments({
      recipe: recipeId,
      action: 'startView',
    }),
  }
}

export async function getDailyViews(recipeId) {
  return await Event.aggregate([
    {
      $match: {
        recipe: recipeId,
        action: 'startView',
      },
    },
    {
      $group: {
        _id: {
          $dateTrunc: { date: '$date', unit: 'day' },
        },
        views: { $count: {} },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])
}

export async function getDailyDurations(recipeId) {
  return await Event.aggregate([
    {
      $match: {
        recipe: recipeId,
      },
    },
    {
      $project: {
        session: '$session',
        startDate: {
          $cond: [{ $eq: ['$action', 'startView'] }, '$date', undefined],
        },
        endDate: {
          $cond: [{ $eq: ['$action', 'endView'] }, '$date', undefined],
        },
      },
    },
    {
      $group: {
        _id: '$session',
        startDate: { $min: '$startDate' },
        endDate: { $max: '$endDate' },
      },
    },
    {
      $project: {
        day: { $dateTrunc: { date: '$startDate', unit: 'day' } },
        duration: { $subtract: ['$endDate', '$startDate'] },
      },
    },
    {
      $group: {
        _id: '$day',
        averageDuration: { $avg: '$duration' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])
}
