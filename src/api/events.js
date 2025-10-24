export const recipeTrackEvent = (event) =>
  fetch(`${import.meta.env.VITE_BACKEND_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  }).then((res) => res.json())

export const getTotalViews = (recipeId) =>
  fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/totalViews/${recipeId}`,
  ).then((res) => res.json())

export const getDailyViews = (recipeId) =>
  fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/dailyViews/${recipeId}`,
  ).then((res) => res.json())

export const getDailyDurations = (recipeId) =>
  fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/dailyDurations/${recipeId}`,
  ).then((res) => res.json())
