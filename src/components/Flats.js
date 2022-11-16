import { Delete, DeleteSweep, Edit } from '@mui/icons-material'
import { Link, SpeedDial, SpeedDialAction, Stack, Tooltip } from '@mui/material'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format } from 'date-fns'
import { useCallback, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import ConfirmDialog from './Dialogs/ConfirmDialog'
import { useSnackbar } from 'notistack'
import { removeDeprecatedDates } from '../utils/service-utils'
import styled from '@emotion/styled'

const actions = [
  { icon: <Delete />, name: 'Delete old dates', operation: 'delete-old' },
  { icon: <DeleteSweep />, name: 'Delete all dates', operation: 'delete-all' }
]

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: theme.zIndex.modal + 1 + ' !important'
}))

const Flats = ({ data }) => {
  const [currentFlat, setCurrentFlat] = useState({
    unavailableDates: [],
    flatId: null,
    flatNumber: '',
    operation: null
  })
  const [isModalOpen, setIsModalOpen] = useState({
    isDialogOpen: false,
    isPickerOpen: false
  })
  const { enqueueSnackbar } = useSnackbar()
  const { mutateAsync } = useMutation(removeDeprecatedDates)
  const formattedUnavailableDates = useMemo(
    () => setFormattedUnavailableDates(),
    [currentFlat.flatId]
  )

  const handlePickerOpen = (dates, number, id) => {
    setCurrentFlat((currentFlat) => ({
      ...currentFlat,
      flatId: id,
      flatNumber: number,
      unavailableDates: dates
    }))
    setIsModalOpen((isModalOpen) => ({ ...isModalOpen, isPickerOpen: true }))
  }

  const handlePickerClose = () => {
    setIsModalOpen((isModalOpen) => ({ ...isModalOpen, isPickerOpen: false }))
  }

  const handleDialogClose = useCallback(
    () =>
      setIsModalOpen((isModalOpen) => ({
        ...isModalOpen,
        isDialogOpen: false
      })),
    [setIsModalOpen]
  )

  const handleDialActionClick = (operation) => {
    setCurrentFlat((currentFlat) => ({ ...currentFlat, operation }))
    setIsModalOpen({
      isPickerOpen: false,
      isDialogOpen: true
    })
  }

  function setFormattedUnavailableDates() {
    return currentFlat.unavailableDates.map((date) => {
      const formattedDate = format(new Date(date), 'MM/dd/yyyy')
      return formattedDate
    })
  }

  function shouldDisableDate(date) {
    if (!currentFlat.unavailableDates) return
    const formattedDate = format(new Date(date), 'MM/dd/yyyy')
    return formattedUnavailableDates.includes(formattedDate)
  }

  function onSuccess(res) {
    handleDialogClose()
    setCurrentFlat({
      unavailableDates: [],
      flatId: null,
      flatNumber: '',
      operation: null
    })
    enqueueSnackbar(res.data, {
      variant: 'success'
    })
  }

  const removeData = useCallback(async () => {
    try {
      const res = await mutateAsync({
        roomId: currentFlat.flatId,
        operation: currentFlat.operation
      })
      onSuccess(res)
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
  }, [currentFlat.flatId, currentFlat.operation])

  function renderSpeedDialActionsContent() {
    return actions.map((action) => (
      <SpeedDialAction
        key={action.name}
        icon={action.icon}
        tooltipTitle={action.name}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 2 }}
        onClick={(e) => handleDialActionClick(action.operation)}
      />
    ))
  }

  function renderFlatsContent() {
    return data?.data.roomNumbers.map((room, i, arr) => {
      return (
        <Link
          sx={{ cursor: 'pointer' }}
          component="span"
          key={room._id}
          onClick={() =>
            handlePickerOpen(room.unavailableDates, room.number, room._id)
          }
        >
          {arr.length - 1 === i ? `${room.number}` : `${room.number} `}
        </Link>
      )
    })
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ConfirmDialog
        isDialogOpen={isModalOpen.isDialogOpen}
        handleClose={handleDialogClose}
        removeData={removeData}
        multiple
      />
      {isModalOpen.isPickerOpen && (
        <StyledSpeedDial
          ariaLabel="SpeedDial basic"
          open={true}
          icon={<Edit />}
        >
          {renderSpeedDialActionsContent()}
        </StyledSpeedDial>
      )}
      <MobileDatePicker
        label={`Available dates for ${currentFlat.flatNumber} room`}
        readOnly
        open={isModalOpen.isPickerOpen}
        onClose={handlePickerClose}
        shouldDisableDate={shouldDisableDate}
        value={null}
        onChange={() => {}}
        InputProps={{ sx: { display: 'none' } }}
        renderInput={() => <span />}
        componentsProps={{
          actionBar: {
            actions: ['cancel']
          }
        }}
      />
      <Tooltip title="Check available dates" arrow>
        <Stack direction={'row'} gap={1}>
          {renderFlatsContent()}
        </Stack>
      </Tooltip>
    </LocalizationProvider>
  )
}

export default Flats
