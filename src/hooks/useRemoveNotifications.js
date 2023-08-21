import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'

export const useRemoveNotifications = ({ mutationFunc, label }) => {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const { mutate: deleteNotifications } = useMutation(mutationFunc, {
    onMutate: async () => {
      await queryClient.cancelQueries(label)
      const prevData = queryClient.getQueryData([label])
      queryClient.setQueryData([label], (oldData) => {
        return {
          ...oldData,
          data: { [label]: [] }
        }
      })

      return { prevData }
    },
    onError: (e, _hero, context) => {
      enqueueSnackbar(e.message || 'Something went wrong!', {
        variant: 'error'
      })
      queryClient.setQueriesData([label], context.prevData)
    }
  })

  return { deleteNotifications }
}
