import { useQuery } from '@tanstack/react-query'
import {
  VictoryChart,
  VictoryTooltip,
  VictoryBar,
  VictoryLine,
  VictoryVoronoiContainer,
} from 'victory'
import PropTypes from 'prop-types'
import {
  getTotalViews,
  getDailyViews,
  getDailyDurations,
} from '../api/events.js'

export function RecipeStats({ recipeId }) {
  const totalViews = useQuery({
    queryKey: ['totalViews', recipeId],
    queryFn: () => getTotalViews(recipeId),
  })
  const dailyViews = useQuery({
    queryKey: ['dailyViews', recipeId],
    queryFn: () => getDailyViews(recipeId),
  })
  const dailyDurations = useQuery({
    queryKey: ['dailyDurations', recipeId],
    queryFn: () => getDailyDurations(recipeId),
  })
  if (
    totalViews.isLoading ||
    dailyViews.isLoading ||
    dailyDurations.isLoading
  ) {
    return <div>loading stats...</div>
  }
  return (
    <div>
      <br />
      <div>This recipe has {totalViews.data?.views} total views!</div>
      <br />
      <div style={{ width: 512 }}>
        <details>
          <summary>Daily Views</summary>
          <VictoryChart domainPadding={16}>
            <VictoryBar
              labelComponent={<VictoryTooltip />}
              data={dailyViews.data?.map((d) => ({
                x: new Date(d._id),
                y: d.views,
                label: `${new Date(d._id).toLocaleDateString()}:${
                  d.views
                } views`,
              }))}
            />
          </VictoryChart>
        </details>
      </div>
      <div style={{ width: 512 }}>
        <details>
          <summary>Daily Average Viewing Duration</summary>
          <VictoryChart
            domainPadding={16}
            containerComponent={
              <VictoryVoronoiContainer
                voronoiDimension='x'
                labels={({ datum }) =>
                  `${datum.x.toLocaleDateString()}: ${datum.y.toFixed(
                    2,
                  )} minutes`
                }
                labelComponent={<VictoryTooltip />}
              />
            }
          >
            <VictoryLine
              data={dailyDurations.data?.map((d) => ({
                x: new Date(d._id),
                y: d.averageDuration / (60 * 1000),
              }))}
            />
          </VictoryChart>
        </details>
      </div>
    </div>
  )
}

RecipeStats.propTypes = {
  recipeId: PropTypes.string.isRequired,
}
