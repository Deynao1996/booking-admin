import { TextField, Tooltip } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { useQueryClient } from '@tanstack/react-query'
import { format, isValid } from 'date-fns'
import { useField, useFormikContext } from 'formik'
import { useMemo, useState } from 'react'

const popperSx = {
  '& .MuiPickersDay-dayWithMargin.Mui-disabled': {
    filter: 'opacity(0.6) blur(1px)'
  }
}

const DatePickerField = ({ name, maxPickedDate, minPickedDate, ...props }) => {
  const queryClient = useQueryClient()
  const [field, meta] = useField(name)
  const [roomField] = useField('room')
  const [open, setOpen] = useState(false)
  const roomId = roomField.value.roomId
  const currentRoomId = roomField.value.currentRoomId
  const unavailableDates = useMemo(() => open && setUnavailableDates(), [open])
  const { setFieldValue } = useFormikContext()

  const textFieldConfig = {
    ...props,
    variant: 'standard',
    helperText: ' ',
    fullWidth: true,
    margin: 'dense',
    required: true
  }

  function handleChange(value) {
    const isDate = isValid(value)
    const correctValue = isDate ? value : ''
    setFieldValue(name, correctValue, true)
  }

  function handleError() {
    textFieldConfig.error = true
    textFieldConfig.helperText = meta.error
  }

  function clearError() {
    textFieldConfig.error = false
  }

  function setUnavailableDates() {
    if (!roomId) return []
    const room = queryClient.getQueriesData([`room:${roomId}`])[0][1].data
    const unavailableDates = room.roomNumbers.find(
      (item) => item._id === currentRoomId
    ).unavailableDates
    return unavailableDates.map((date) => {
      const formattedDate = format(new Date(date), 'MM/dd/yyyy')
      return formattedDate
    })
  }

  function shouldDisableDate(date) {
    if (!unavailableDates) return
    const formattedDate = format(new Date(date), 'MM/dd/yyyy')
    return unavailableDates.includes(formattedDate)
  }

  if (!meta.error) clearError()
  if (meta && meta.error) handleError()

  return (
    <DatePicker
      onChange={handleChange}
      value={field.value}
      maxDate={maxPickedDate}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      minDate={minPickedDate}
      disabled={!roomId}
      shouldDisableDate={shouldDisableDate}
      PopperProps={{ sx: popperSx }}
      renderInput={(params) => {
        return (
          <Tooltip title={!roomId ? 'Please select any room' : ''} arrow>
            <TextField {...params} {...textFieldConfig} />
          </Tooltip>
        )
      }}
    />
  )
}

export default DatePickerField
