import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import React from 'react'

const ConfirmDialog = ({ isDialogOpen, handleClose, removeData, multiple }) => {
  const titleLabel = multiple ? 'these items' : 'this item'
  const contentLabel = multiple ? 'items' : 'item'

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>{`Are you sure you want to delete ${titleLabel}?`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`If you accidentally delete selected ${contentLabel} you will never be able to
          restore it. Are you sure?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={() => removeData()} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(ConfirmDialog)
