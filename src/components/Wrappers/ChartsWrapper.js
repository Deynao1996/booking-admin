import { Grid } from '@mui/material'
import React from 'react'
import Chart from '../Charts/Chart'

const ChartsContainer = ({ children, fullWidth, ...props }) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { ...props })
    }
    return child
  })

  return (
    <Grid container spacing={3}>
      <Grid xs={12} lg={fullWidth ? 12 : 4} item>
        {childrenWithProps}
      </Grid>
      <Grid item xs={12} lg={fullWidth ? 12 : 8}>
        <Chart {...props} />
      </Grid>
    </Grid>
  )
}

export default ChartsContainer
