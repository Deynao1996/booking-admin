import { forwardRef, useEffect, useState } from 'react'
import { Button, DialogActions, DialogContentText } from '@mui/material'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  useMediaQuery
} from '@mui/material'
import { useThemeProvider } from '../../contexts/ThemeContext'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const DisclaimerDialog = ({ storageKey = 'block-disclaimer', ...props }) => {
  const { theme } = useThemeProvider()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  function handleClose() {
    setIsConfirmDialogOpen(false)
  }

  function handleBlock() {
    handleClose()
    localStorage.setItem(storageKey, 'true')
  }

  useEffect(() => {
    if (!localStorage.getItem(storageKey)) {
      setIsConfirmDialogOpen(true)
    }
  }, [])

  return (
    <Dialog
      open={isConfirmDialogOpen}
      TransitionComponent={Transition}
      fullScreen={isMobile}
      onClose={handleClose}
      {...props}
    >
      <DialogTitle>Quick Server Wake-up & Demo Reminder</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please note that this is a free demo service and the server may take
          30-60 seconds to wake up if there hasn't been recent activity.
          Additionally, some functionalities of the project may be limited or
          not fully operational. Your patience and understanding are greatly
          appreciated.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button aria-label="Confirm" onClick={handleClose}>
          Close
        </Button>
        <Button aria-label="Block-message" onClick={handleBlock}>
          Never show me again
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DisclaimerDialog
