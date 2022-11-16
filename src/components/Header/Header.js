import { useCallback, useState } from 'react'
import AsideDrawer from '../Aside/AsideDrawer'
import CustomAppBar from './CustomAppBar'

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const toggleDrawer = useCallback(
    () => setIsDrawerOpen((isDrawerOpen) => !isDrawerOpen),
    [setIsDrawerOpen]
  )

  const onDrawerClose = () => setIsDrawerOpen(false)

  return (
    <>
      <CustomAppBar toggleDrawer={toggleDrawer} />
      <AsideDrawer isDrawerOpen={isDrawerOpen} onDrawerClose={onDrawerClose} />
    </>
  )
}

export default Header
