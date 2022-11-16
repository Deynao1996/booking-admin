import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useHandleError } from './useHandleError'

export const useRemoveNotifications = ({ mutationFunc, label }) => {
  const queryClient = useQueryClient()
  const {
    mutate: deleteNotifications,
    isError,
    error
  } = useMutation(mutationFunc, {
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
    onError: (_e, _hero, context) => {
      queryClient.setQueriesData([label], context.prevData)
    }
  })
  useHandleError(isError, error)

  return { deleteNotifications }
}
