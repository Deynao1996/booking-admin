import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useField, useFormikContext } from 'formik'
import { useMemo, useState } from 'react'
import { useHandleError } from '../../hooks/useHandleError'
import { fetchAllHotels, fetchAllUsers } from '../../utils/service-utils'
import _isObject from 'lodash/isObject'
import { getFullName } from '../MenuUI/NotificationMenu'

const fetchData = {
  user: fetchAllUsers,
  hotel: fetchAllHotels
}

const setOnChangeEvent = (setFn) => ({
  user: (_, value, reason) => {
    if (reason === 'clear') {
      return setFn('user', {
        name: '',
        id: ''
      })
    }
    setFn('user', {
      name: value?.user,
      id: value?.id
    })
  },
  hotel: (_, value, reason) => {
    if (reason === 'clear') {
      return setFn('hotel', {
        name: '',
        rooms: [],
        id: ''
      })
    }
    setFn('hotel', {
      name: value?.hotel,
      rooms: value?.rooms,
      id: value?.id
    })
  }
})

const handleSelectObj = {
  user: (data) => {
    const users = data.data.users.map((user) => {
      const fullName = getFullName(user)
      return {
        id: user._id,
        user: fullName
      }
    })
    return users
  },
  hotel: (data) => {
    return data.data.hotels.map((hotel) => ({
      id: hotel._id,
      hotel: hotel.name,
      rooms: hotel.rooms
    }))
  }
}

const CustomAutocompleteField = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name)
  const [open, setOpen] = useState(false)
  const {
    data = [],
    isLoading: isLoad,
    isError,
    error
  } = useQuery([`${name}s`], fetchData[name], {
    enabled: open,
    select: (data) => handleSelectObj[name](data)
  })
  const isLoading = isLoad && open
  const { setFieldValue } = useFormikContext()
  const handleChange = useMemo(
    () => setOnChangeEvent(setFieldValue)[name],
    [setFieldValue, name]
  )
  useHandleError(isError, error)

  const configTextField = {
    ...field,
    ...otherProps,
    fullWidth: true,
    helperText: ' ',
    margin: 'dense',
    variant: 'standard',
    required: true
  }

  const configAutocompleteField = {
    disablePortal: true,
    onChange: handleChange,
    isOptionEqualToValue: (option, value) => {
      if (!value) return true
      return option[name] === value || true
    },
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false)
  }

  if (meta && meta.touched && meta.error) {
    configTextField.error = true
    configTextField.helperText = meta.error.name
  }

  const value = _isObject(field.value) ? field.value.name : field.value

  return (
    <Autocomplete
      {...configAutocompleteField}
      open={open}
      loading={isLoading}
      options={data}
      value={value}
      getOptionLabel={(option) => {
        return _isObject(option) ? option[name] : option
      }}
      inputValue={value}
      renderInput={(params) => (
        <TextField
          {...configTextField}
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  )
}

export default CustomAutocompleteField
