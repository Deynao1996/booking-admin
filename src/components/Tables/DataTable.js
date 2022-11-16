import { Add, DeleteOutline } from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip
} from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  createUserColumns,
  createHotelsColumns,
  createOrdersColumns,
  createRoomsColumns
} from '../../utils/render-columns-utils'
import {
  deleteHotel,
  deleteOrder,
  deleteRoom,
  deleteUser,
  fetchAllHotels,
  fetchAllOrders,
  fetchAllRooms,
  fetchAllUsers
} from '../../utils/service-utils'
import { useHandleError } from '../../hooks/useHandleError'
import { useRemoveItemData } from '../../hooks/useRemoveItemData'
import { useSnackbar } from 'notistack'
import { capitalizedString } from '../../utils/capitalized-string-utils'
import TableSkeleton from '../LoadingsUI/TableSkeleton'
import ConfirmDialog from '../Dialogs/ConfirmDialog'
import { StyledLink } from '../../styled/styled'

const fetchDataObj = {
  users: fetchAllUsers,
  hotels: fetchAllHotels,
  orders: fetchAllOrders,
  rooms: fetchAllRooms
}

export const deleteDataObj = {
  users: deleteUser,
  hotels: deleteHotel,
  orders: deleteOrder,
  rooms: deleteRoom
}

const renderColumnsObj = {
  users: createUserColumns,
  hotels: createHotelsColumns,
  orders: createOrdersColumns,
  rooms: createRoomsColumns
}

const DataTable = () => {
  const limit = 9
  const { state } = useLocation()
  const [selectionModel, setSelectionModel] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const title = state?.data || 'users'
  const { enqueueSnackbar } = useSnackbar()
  const { data, isLoading, isError, error } = useQuery(
    [title],
    fetchDataObj[title]
  )
  const { deleteItem } = useRemoveItemData({
    mutationFunc: deleteDataObj[title],
    label: title,
    disabledNotifications: true
  })
  useHandleError(isError, error)

  const columns = useMemo(() => renderColumnsObj[title](title), [title])
  const rows = data?.data[title]

  const handleClose = () => {
    setIsDialogOpen(false)
  }

  const handleClickOpen = () => {
    setIsDialogOpen(true)
  }

  function onError(e) {
    enqueueSnackbar(e.message || 'Something went wrong!', {
      variant: 'error'
    })
  }

  function onSuccess(res) {
    const successMsg = capitalizedString(title) + ' ' + 'have been removed!'
    if (res.data && res.status === 200)
      enqueueSnackbar(successMsg, {
        variant: 'success'
      })
  }

  function deleteItems() {
    handleClose()
    selectionModel.forEach((itemId) => {
      deleteItem(itemId, {
        onSuccess,
        onError
      })
    })
  }

  if (isLoading || isError) return <TableSkeleton />

  return (
    <>
      <ConfirmDialog
        isDialogOpen={isDialogOpen}
        handleClose={handleClose}
        removeData={deleteItems}
        multiple
      />
      <Card sx={{ p: 2, mt: 3 }}>
        <CardHeader
          title={`All ${title}`}
          titleTypographyProps={{
            color: 'text.secondary',
            textTransform: 'capitalize'
          }}
          action={
            <div>
              <Tooltip title="Remove selected items">
                <span>
                  <IconButton
                    size="large"
                    disabled={selectionModel.length < 1}
                    onClick={handleClickOpen}
                  >
                    <DeleteOutline />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={`Add new ${title}`}>
                <StyledLink to={`/create/${title}`}>
                  <IconButton size="large">
                    <Add />
                  </IconButton>
                </StyledLink>
              </Tooltip>
            </div>
          }
          sx={{ p: 0 }}
          color={'text.secondary'}
        />
        <CardContent sx={{ p: 0, mt: 2, height: 603 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={limit}
            disableSelectionOnClick
            rowsPerPageOptions={[limit]}
            pagination
            checkboxSelection
            experimentalFeatures={{ newEditingApi: true }}
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel)
            }}
            selectionModel={selectionModel}
            getRowId={(row) => row._id}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default DataTable
