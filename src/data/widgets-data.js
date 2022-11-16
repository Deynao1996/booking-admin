import {
  AddBusiness,
  AddCard,
  Apartment,
  DomainAdd,
  Hotel,
  PermIdentity,
  PersonAddAlt,
  ShoppingCart
} from '@mui/icons-material'
import { green, orange, purple, red } from '@mui/material/colors'

export const widgetsData = [
  {
    title: 'users',
    value: 100,
    link: 'See all users',
    icon: <PermIdentity />,
    btnColor: red,
    addIcon: <PersonAddAlt />
  },
  {
    title: 'orders',
    value: 100,
    link: 'View all orders',
    icon: <ShoppingCart />,
    btnColor: orange,
    addIcon: <AddCard />
  },
  {
    title: 'hotels',
    value: '100',
    link: 'View all hotels',
    icon: <Apartment />,
    btnColor: green,
    addIcon: <DomainAdd />
  },
  {
    title: 'rooms',
    value: '100',
    link: 'View all rooms',
    icon: <Hotel />,
    btnColor: purple,
    addIcon: <AddBusiness />
  }
]
