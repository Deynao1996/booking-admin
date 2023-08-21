import { useFormikContext } from 'formik'
import { LoadingButton } from '@mui/lab'
import { Button } from '@mui/material'

const CustomSubmitButton = ({ children, withLoading, ...props }) => {
  const { submitForm } = useFormikContext()

  const handleSubmit = () => {
    submitForm()
  }

  const configButton = {
    ...props,
    fullWidth: true,
    variant: 'contained',
    onClick: handleSubmit
  }

  return withLoading ? (
    <LoadingButton {...configButton}>{children}</LoadingButton>
  ) : (
    <Button aria-label="Send" {...configButton}>
      {children}
    </Button>
  )
}

export default CustomSubmitButton
