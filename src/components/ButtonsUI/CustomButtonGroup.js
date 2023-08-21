import { Button, ButtonGroup } from '@mui/material'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRemoveItemData } from '../../hooks/useRemoveItemData'
import ConfirmDialog from '../Dialogs/ConfirmDialog'
import { deleteDataObj } from '../Tables/DataTable'

const CustomButtonGroup = ({ params, label }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { deleteItem } = useRemoveItemData({
    mutationFunc: deleteDataObj[label],
    label
  })
  const { _id } = params.row
  const navigate = useNavigate()

  const handleClickOpen = () => {
    setIsDialogOpen(true)
  }

  const handleClose = useCallback(
    () => setIsDialogOpen(false),
    [setIsDialogOpen]
  )

  const removeItem = useCallback(() => {
    deleteItem(_id)
    handleClose()
  }, [handleClose, _id])

  return (
    <>
      <ButtonGroup variant="outlined" size="small">
        <Button
          color="primary"
          aria-label="Open"
          onClick={() => {
            navigate(`/${label}/${_id}`)
          }}
        >
          View
        </Button>
        <Button color="error" aria-label="Remove" onClick={handleClickOpen}>
          Delete
        </Button>
      </ButtonGroup>
      <ConfirmDialog
        isDialogOpen={isDialogOpen}
        handleClose={handleClose}
        removeData={removeItem}
      />
    </>
  )
}

export default CustomButtonGroup
