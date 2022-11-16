import { useMutation, useQueryClient } from '@tanstack/react-query'
import { capitalizedString } from '../utils/capitalized-string-utils'
import { useSnackbar } from 'notistack'

export const useRemoveItemData = ({
  mutationFunc,
  label,
  disabledNotifications = false
}) => {
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const { mutate: deleteItem } = useMutation(mutationFunc, {
    onMutate: async (newItem) => {
      const itemId = newItem.split(' ')[0]
      await queryClient.cancelQueries(label)
      const prevData = queryClient.getQueryData([label])
      queryClient.setQueryData([label], (oldData) => {
        const filteredData = oldData.data[label].filter(
          (item) => item._id !== itemId
        )
        return {
          ...oldData,
          data: { [label]: filteredData }
        }
      })

      return { prevData }
    },
    onError: (e, _hero, context) => {
      !disabledNotifications && showErrorMessage(e)
      queryClient.setQueriesData([label], context.prevData)
    },
    onSettled: (data) => {
      data && !disabledNotifications && showSuccessMessage(label)
      queryClient.invalidateQueries(label)
    }
  })

  function showSuccessMessage(label) {
    const successMsg =
      capitalizedString(label).slice(0, -1) + ' ' + 'has been removed!'
    enqueueSnackbar(successMsg, {
      variant: 'success'
    })
  }

  function showErrorMessage(e) {
    enqueueSnackbar(e.message || 'Something went wrong!', {
      variant: 'error'
    })
  }

  return { deleteItem }
}
