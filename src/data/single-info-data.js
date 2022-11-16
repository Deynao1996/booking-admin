export const customerInfoVariants = [
  { title: 'Email', label: 'email' },
  { title: 'Username', label: 'userName', isCapitalized: true },
  {
    title: 'Has a Newsletter',
    label: 'hasNewsletter',
    type: 'boolean',
    isCapitalized: true
  },
  {
    title: 'Email Verified',
    label: 'isVerified',
    type: 'boolean',
    isCapitalized: true
  },
  { title: 'Date Of Registration', label: 'createdAt', type: 'date' }
]

export const hotelInfoVariants = [
  { title: 'City', label: 'city' },
  { title: 'Address', label: 'address' },
  { title: 'Features', label: 'featured', type: 'boolean' },
  { title: 'Distance From Center', label: 'distance', postfix: 'm' },
  { title: 'Cheapest Price', label: 'cheapestPrice', postfix: '$' }
]

export const orderInfoVariants = [
  { title: 'Hotel', label: 'hotelName', isCapitalized: true },
  { title: 'Price', label: 'price', postfix: '$', isCapitalized: true },
  { title: 'Is Paid', label: 'isPaid', type: 'boolean', isCapitalized: true },
  { title: 'Status', label: 'status', isCapitalized: true },
  {
    title: 'Date of Order',
    label: 'createdAt',
    type: 'date',
    isCapitalized: true
  },
  { title: 'Description', label: 'descr' },
  { title: 'Settling Dates', label: 'dates', type: 'dates' },
  { title: 'Flat Number', type: 'rooms' }
]

export const roomInfoVariants = [
  { title: 'Room', label: 'title', isCapitalized: true },
  { title: 'Max People', label: 'maxPeople' },
  { title: 'Price', label: 'price', postfix: '$' },
  { title: 'Date Of Creation', label: 'createdAt', type: 'date' },
  { title: 'Flats', label: 'descr', type: 'rooms' },
  { title: 'Description', label: 'descr' }
]
