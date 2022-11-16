import { useParams } from 'react-router-dom'
import Charts from '../components/Wrappers/ChartsWrapper.js'
import RoomInfo from '../components/Info/RoomInfo'
import TransactionsList from '../components/Tables/TransactionsList'
import { MainContainer } from './HomePage'
import { useQuery } from '@tanstack/react-query'
import { useHandleError } from '../hooks/useHandleError.js'
import { fetchRoom, fetchRoomFrequently } from '../utils/service-utils.js'
import { useMemo } from 'react'

const RoomPage = () => {
  const { roomId } = useParams()
  const {
    data: frequentlyData,
    isFetching: isFrequentlyFetching,
    isError: isFrequentlyError,
    error: frequentlyError
  } = useQuery(['room-frequently', roomId], () => fetchRoomFrequently(roomId), {
    enabled: !!roomId
  })

  const {
    data: roomData,
    isLoading: isRoomLoading,
    isError,
    error
  } = useQuery(['room', roomId], () => fetchRoom(roomId), {
    enabled: !!roomId
  })
  useHandleError(isError, error)
  useHandleError(isFrequentlyError, frequentlyError)

  const isLoading = isRoomLoading || isFrequentlyFetching
  const roomNumbers = useMemo(() => stringifyReserveRooms(), [roomData])

  function stringifyReserveRooms() {
    const rooms = roomData?.data?.roomNumbers.map((num) => num._id)
    if (!rooms) return
    return JSON.stringify({ $in: rooms })
  }

  return (
    <MainContainer>
      <Charts
        title="Room Booking Frequency ( Last 6 Months )"
        aspect={3 / 1}
        roomId={roomId}
        data={frequentlyData}
        isLoading={isLoading}
      >
        <RoomInfo roomData={roomData} />
      </Charts>
      <TransactionsList
        createdAt={-1}
        limit={5}
        reserveRooms={roomNumbers}
        requiredQuery={!roomNumbers}
      />
    </MainContainer>
  )
}

export default RoomPage
