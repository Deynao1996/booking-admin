import { TextField } from '@mui/material'
import { NumericFormat } from 'react-number-format'
import { useField, useFormikContext } from 'formik'
import _isObject from 'lodash/isObject'

const CustomPriceField = ({ name, ...otherProps }) => {
  const [{ onChange, ...field }, meta] = useField(name)
  const { setFieldValue } = useFormikContext()

  const configTextfield = {
    fullWidth: true,
    helperText: ' ',
    margin: 'dense',
    required: true,
    ...otherProps,
    ...field
  }

  function handleError() {
    configTextfield.error = true
    configTextfield.helperText = meta.error
  }

  if (meta && meta.error && meta.touched) handleError()

  return (
    <NumericFormat
      {...configTextfield}
      value={_isObject(field.value) ? field.value.formattedValue : field.value}
      onValueChange={(val) => setFieldValue(name, val.floatValue || '')}
      thousandSeparator
      customInput={TextField}
      prefix={'$'}
    />
  )
}

export default CustomPriceField
