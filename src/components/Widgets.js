import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Skeleton,
  Tooltip,
  Typography
} from '@mui/material'
import { grey } from '@mui/material/colors'
import { styled } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { widgetsData } from '../data/widgets-data'
import { useHandleError } from '../hooks/useHandleError'
import { countWidgets } from '../utils/service-utils'
import { StyledLink } from '../styled/styled'
import { useAuthProvider } from '../contexts/AuthContext'

const StyledCardActions = styled(CardActions)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: 0,
  alignItems: 'flex-end'
}))

const Widgets = () => {
  const { currentUser } = useAuthProvider()
  const { data, isLoading, isError, error } = useQuery(
    ['widgets-count'],
    countWidgets,
    {
      enabled: !!currentUser?._id
    }
  )
  useHandleError(isError, error)

  function renderWidgetsContent(widgetsData) {
    return widgetsData.map((item, i) => {
      const countValue = data?.data[item.title]
      return (
        <CustomCard
          key={i}
          countValue={countValue}
          isLoading={isLoading}
          {...item}
        />
      )
    })
  }

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {renderWidgetsContent(widgetsData)}
    </Grid>
  )
}

const CustomCard = ({
  title,
  link,
  icon,
  countValue,
  isLoading,
  btnColor,
  addIcon
}) => {
  return (
    <Grid xs={12} sm={6} md={3} item>
      <Card sx={{ p: 2 }}>
        <CardHeader
          title={!isLoading ? title : <Skeleton animation="wave" width="60%" />}
          titleTypographyProps={{
            fontSize: 14,
            color: 'text.secondary',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}
          action={
            !isLoading && (
              <Tooltip title={`Add new ${title}`}>
                <StyledLink to={`/create/${title}`}>
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label={`Add new ${title}`}
                  >
                    {addIcon}
                  </IconButton>
                </StyledLink>
              </Tooltip>
            )
          }
          sx={{ p: 0 }}
        />
        <CardContent sx={{ px: 0 }}>
          <Typography component="div" variant="h5">
            {!isLoading ? (
              countValue
            ) : (
              <Skeleton animation="wave" width="20%" />
            )}
          </Typography>
        </CardContent>
        <StyledCardActions>
          {!isLoading ? (
            <StyledLink
              to="/table"
              state={{ data: title }}
              sx={{
                textDecoration: 'underline',
                typography: 'body2'
              }}
            >
              {link}
            </StyledLink>
          ) : (
            <Skeleton animation="wave" width="40%" />
          )}
          {!isLoading ? (
            <IconButton
              size="small"
              component="div"
              edge="end"
              variant="outlined"
              aria-label="Action description"
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === 'light' ? btnColor[50] : grey[800],
                borderRadius: 1,
                color: btnColor[500],
                cursor: 'initial'
              }}
            >
              {icon}
            </IconButton>
          ) : (
            <Skeleton
              animation="wave"
              variant="rounded"
              width={25}
              height={25}
            />
          )}
        </StyledCardActions>
      </Card>
    </Grid>
  )
}

export default Widgets
