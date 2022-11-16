import { Card, CardContent, CardHeader, Skeleton } from '@mui/material'

const TableSkeleton = () => {
  return (
    <Card sx={{ p: 2, mt: 3 }}>
      <CardHeader
        title={<Skeleton animation="wave" width={'40%'} />}
        titleTypographyProps={{
          color: 'text.secondary',
          textTransform: 'capitalize'
        }}
        sx={{ p: 0 }}
        color={'text.secondary'}
      />
      <CardContent sx={{ p: 0, mt: 2, height: 603 }}>
        <Skeleton variant="rounded" width="100%" height="100%" />
      </CardContent>
    </Card>
  )
}

export default TableSkeleton
