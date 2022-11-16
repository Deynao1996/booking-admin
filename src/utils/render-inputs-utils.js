import { Grid } from '@mui/material'
import CustomAutocompleteField from '../components/FormsUI/CustomAutocompleteField'
import CustomPriceField from '../components/FormsUI/CustomPriceField'
import PerformantTextField from '../components/FormsUI/PerformantTextField'
import RoomsAutocompleteField from '../components/FormsUI/RoomsAutocompleteField'
import CustomSelectField from '../components/FormsUI/CustomSelectField'

function renderField(category, props) {
  switch (category) {
    case 'select':
      return <CustomSelectField {...props} />
    case 'autocomplete':
      return <CustomAutocompleteField {...props} />
    case 'room-autocomplete':
      return <RoomsAutocompleteField {...props} />
    case 'price':
      return <CustomPriceField {...props} />
    default:
      return <PerformantTextField {...props} />
  }
}

export function renderInputsContent(variants) {
  return variants.map(({ fullWidth, category, ...props }) => {
    const largeScreenMedia = fullWidth ? 12 : 6
    return (
      <Grid
        item
        xs={12}
        sm={largeScreenMedia}
        md={largeScreenMedia}
        key={props.id}
      >
        {renderField(category, props)}
      </Grid>
    )
  })
}
