import { DeleteOutline, PhotoCamera } from '@mui/icons-material'
import {
  Avatar,
  AvatarGroup,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
import { Stack } from '@mui/system'
import { useField, useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import _isArray from 'lodash/isArray'

const CustomFileField = ({ name, id, multiple }) => {
  const [field, meta] = useField(name)
  const { setFieldValue } = useFormikContext()
  const [avatarPreviews, setAvatarPreviews] = useState(field.value)
  const isError = meta && meta.touched && meta.error

  const configField = {
    ...field,
    helperText: ' '
  }

  const handleAvatarPreviews = (res) => {
    setAvatarPreviews((avatarPreviews) =>
      multiple
        ? [...avatarPreviews, ...res.map((res) => res.result)]
        : [...res.map((res) => res.result)]
    )
  }

  function readFile(fileSource) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      const fileName = fileSource.name
      fileReader.onerror = () => reject(fileReader.error)
      fileReader.onload = () =>
        resolve({
          fileName,
          base64: fileReader.result.split(',')[1],
          result: fileReader.result
        })
      fileReader.readAsDataURL(fileSource)
    })
  }

  async function handleChange(e) {
    const files = e.target.files
    setFieldValue(name, multiple ? [...field.value, ...files] : [files[0]])
    const res = await Promise.all([...files].map((file) => readFile(file)))
    handleAvatarPreviews(res)
  }

  function clearPhotos() {
    setAvatarPreviews([])
    setFieldValue(name, [])
  }

  function handleError() {
    configField.error = true
    configField.helperText = meta.error
  }

  function renderErrorMessage() {
    const error = meta.error
    return _isArray(error) ? [...new Set(error.filter(() => true))][0] : error
  }

  function renderAvatarsContent() {
    return avatarPreviews.length ? (
      avatarPreviews.map((avatar, i) => (
        <Avatar
          alt="Image"
          src={avatar}
          key={i}
          sx={{ width: 150, height: 150 }}
        />
      ))
    ) : (
      <Avatar alt="Image" src={null} sx={{ width: 150, height: 150 }} />
    )
  }

  if (isError) handleError()

  useEffect(() => {
    field.value.length === 0 && setAvatarPreviews([])
  }, [field.value.length])

  return (
    <>
      <AvatarGroup max={2}>{renderAvatarsContent()}</AvatarGroup>
      <Stack direction="row">
        <Tooltip title="Add photo">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            sx={{ width: 50, height: 50 }}
          >
            <input
              hidden
              name={name}
              type="file"
              id={id}
              multiple={!!multiple}
              onChange={handleChange}
            />
            <PhotoCamera color={isError ? 'error' : 'inherit'} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove all photos">
          <IconButton
            color="primary"
            aria-label="remove picture"
            component="label"
            onClick={clearPhotos}
            disabled={!avatarPreviews.length}
            sx={{ width: 50, height: 50 }}
          >
            <DeleteOutline />
          </IconButton>
        </Tooltip>
      </Stack>
      <Typography
        align="center"
        color="error"
        m={0}
        variant="body2"
        height={'20.012px'}
      >
        {isError ? renderErrorMessage() : ' '}
      </Typography>
    </>
  )
}

export default CustomFileField
