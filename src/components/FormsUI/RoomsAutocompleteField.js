import { styled, lighten, darken } from '@mui/system'
import {
  Autocomplete,
  CircularProgress,
  TextField,
  Tooltip
} from '@mui/material'
import { useQueries } from '@tanstack/react-query'
import { useField, useFormikContext } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useHandleError } from '../../hooks/useHandleError'
import { useIsMount } from '../../hooks/useIsMount'
import { fetchRoom } from '../../utils/service-utils'

const StyledGroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  textTransform: 'capitalize',
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.7)
      : darken(theme.palette.primary.main, 0.8)
}))

const StyledGroupItems = styled('ul')(() => ({
  padding: 0,
  '& > li:not(.Mui-focused)': {
    backgroundColor: 'transparent !important'
  }
}))

const StyledAutocomplete = styled(Autocomplete)({
  '& .MuiInputBase-input': {
    textTransform: 'capitalize'
  }
})

const RoomsAutocompleteField = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name)
  const [hotelField] = useField('hotel')
  const { setFieldValue } = useFormikContext()
  const roomIds = useMemo(
    () => hotelField.value.rooms,
    [hotelField.value.rooms]
  )
  const [open, setOpen] = useState(false)
  const isMount = useIsMount()
  const result = useQueries({
    queries: roomIds
      ? roomIds.map((id) => {
          return {
            enabled: !!roomIds.length,
            queryKey: [`${name}:${id}`, id],
            queryFn: () => fetchRoom(id)
          }
        })
      : []
  })
  const isLoading = result.some((res) => res.isLoading)
  const isError = result.some((res) => res.isError)
  const error = result.map((res) => res.error)
  const isHotelNameProvided = !!hotelField.value.name
  const data = useMemo(
    () => (!isLoading ? getTransformedData() : []),
    [isLoading, roomIds]
  )
  useHandleError(isError, error?.[0])

  const configTextField = {
    ...field,
    ...otherProps,
    fullWidth: true,
    helperText: ' ',
    margin: 'dense',
    variant: 'standard',
    required: true
  }

  function clearRoomField() {
    setFieldValue('room', {
      name: '',
      roomId: '',
      currentRoomId: ''
    })
  }

  function handleChange(_, value, reason) {
    if (reason === 'clear') {
      return clearRoomField()
    }
    const strValue = `${value.roomNumber}: ${value.title}`
    setFieldValue(name, {
      name: strValue,
      roomId: value.roomId,
      currentRoomId: value.currentRoomId
    })
  }

  function setAvailableOptions() {
    return result.flatMap((data) => {
      const title = data.data.data.title
      const id = data.data.data._id
      return data.data.data.roomNumbers.map((num) => ({
        title,
        roomNumber: num.number.toString(),
        roomId: id,
        currentRoomId: num._id
      }))
    })
  }

  function getTransformedData() {
    if (!result.length) return []
    const isDataExist = result.some((res) => res.data)
    if (!isDataExist) return []
    const options = setAvailableOptions()
    return options
  }

  function handleError() {
    configTextField.error = true
    configTextField.helperText = meta.error.name
  }

  function isOptionEqualToValue(option, value) {
    return option.id === value.id
  }

  function renderInput(params) {
    return (
      <TextField
        {...configTextField}
        {...params}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {isLoading && open ? (
                <CircularProgress color="inherit" size={20} />
              ) : null}
              {params.InputProps.endAdornment}
            </>
          )
        }}
      />
    )
  }

  function renderGroup(params) {
    return (
      <li key={params.key}>
        <StyledGroupHeader>{params.group}</StyledGroupHeader>
        <StyledGroupItems>{params.children}</StyledGroupItems>
      </li>
    )
  }

  if (meta && meta.touched && meta.error) handleError()

  useEffect(() => {
    !isMount && clearRoomField()
  }, [roomIds])

  return (
    <Tooltip
      arrow
      title={!isHotelNameProvided ? 'Please select any hotel' : ''}
    >
      <StyledAutocomplete
        open={open}
        loading={isLoading && open}
        options={data}
        onChange={handleChange}
        groupBy={(option) => option.title}
        isOptionEqualToValue={isOptionEqualToValue}
        value={field.value.name}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        getOptionLabel={(option) => option.roomNumber || ''}
        inputValue={field.value.name}
        disabled={!isHotelNameProvided}
        renderInput={renderInput}
        renderGroup={renderGroup}
      />
    </Tooltip>
  )
}

export default RoomsAutocompleteField
