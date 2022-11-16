import { endRangeDate, today } from './data'

const booleanOptions = {
  yes: 'Yes',
  no: 'No'
}

const hotelTypeOptions = {
  hotel: 'Hotel',
  apartments: 'Apartment',
  resorts: 'Resort',
  villas: 'Villa',
  cabins: 'Cabin'
}

const orderStatusOptions = {
  pending: 'Pending',
  done: 'Done'
}

export const createUserVariants = [
  {
    id: 'name',
    label: 'First Name',
    name: 'name',
    required: true,
    variant: 'standard',
    category: 'text'
  },
  {
    id: 'lastName',
    label: 'Last Name',
    name: 'lastName',
    variant: 'standard',
    required: true,
    category: 'text'
  },
  {
    id: 'userName',
    label: 'Username',
    name: 'userName',
    variant: 'standard',
    required: true,
    category: 'text'
  },
  {
    id: 'email',
    label: 'Email',
    name: 'email',
    type: 'email',
    variant: 'standard',
    required: true,
    category: 'text'
  },
  {
    id: 'password',
    label: 'Password',
    name: 'password',
    type: 'password',
    variant: 'standard',
    required: true,
    category: 'text'
  },
  {
    name: 'hasNewsletter',
    id: 'hasNewsletter',
    label: 'Has Newsletter',
    options: booleanOptions,
    variant: 'standard',
    category: 'select'
  },
  {
    name: 'isVerified',
    id: 'isVerified',
    label: 'Verified',
    options: booleanOptions,
    variant: 'standard',
    category: 'select'
  },
  {
    name: 'isAdmin',
    id: 'isAdmin',
    label: 'Admin',
    options: booleanOptions,
    variant: 'standard',
    category: 'select'
  }
]

export const createHotelVariants = [
  {
    id: 'hotelName',
    label: 'Hotel Name',
    name: 'hotelName',
    required: true,
    variant: 'standard',
    category: 'text'
  },

  {
    id: 'address',
    label: 'Address',
    name: 'address',
    variant: 'standard',
    required: true,
    category: 'text'
  },
  {
    id: 'distance',
    label: 'Distance From Center',
    name: 'distance',
    type: 'distance',
    variant: 'standard',
    required: true,
    category: 'text'
  },
  {
    id: 'hotelPrice',
    label: 'Price',
    name: 'hotelPrice',
    variant: 'standard',
    required: true,
    category: 'price'
  },
  {
    id: 'hotelTitle',
    label: 'Title',
    name: 'hotelTitle',
    variant: 'standard',
    required: true,
    category: 'text'
  },
  {
    id: 'hotelCity',
    label: 'City',
    name: 'hotelCity',
    variant: 'standard',
    required: true,
    category: 'text'
  },
  {
    id: 'rating',
    label: 'Rating',
    name: 'rating',
    variant: 'standard',
    required: true,
    category: 'text'
  },
  {
    name: 'type',
    id: 'type',
    label: 'Type',
    options: hotelTypeOptions,
    variant: 'standard',
    category: 'select'
  },
  {
    id: 'features',
    label: 'Features',
    name: 'features',
    variant: 'standard',
    category: 'text',
    multiline: true,
    rows: 2
  },
  {
    id: 'subDescription',
    label: 'Additional Info',
    name: 'subDescription',
    variant: 'standard',
    required: true,
    category: 'text',
    multiline: true,
    rows: 2
  },
  {
    id: 'hotelDescription',
    label: 'Description',
    name: 'hotelDescription',
    variant: 'standard',
    required: true,
    category: 'text',
    multiline: true,
    rows: 3,
    fullWidth: true
  }
]

export const createOrderVariants = [
  {
    name: 'user',
    id: 'user',
    label: 'User',
    category: 'autocomplete'
  },
  {
    name: 'hotel',
    id: 'hotel',
    label: 'Hotel',
    category: 'autocomplete'
  },
  {
    name: 'room',
    id: 'room',
    label: 'Room',
    category: 'room-autocomplete'
  },
  {
    id: 'orderPrice',
    label: 'Price',
    name: 'orderPrice',
    required: true,
    variant: 'standard',
    category: 'price'
  },
  {
    name: 'status',
    id: 'status',
    label: 'Status',
    options: orderStatusOptions,
    variant: 'standard',
    category: 'select'
  },
  {
    name: 'paid',
    id: 'paid',
    label: 'Paid',
    options: booleanOptions,
    variant: 'standard',
    category: 'select'
  },
  {
    id: 'descr',
    label: 'Description',
    name: 'descr',
    variant: 'standard',
    required: true,
    category: 'text',
    multiline: true,
    rows: 4,
    fullWidth: true
  }
]

export const createDateVariants = [
  {
    name: 'arrivalDate',
    id: 'arrivalDate',
    label: 'Arrival Date',
    maxPickedDate: endRangeDate,
    minPickedDate: today
  },
  {
    name: 'departureDate',
    id: 'departureDate',
    label: 'Departure Date',
    maxPickedDate: endRangeDate,
    minPickedDate: today
  }
]

export const createRoomVariants = [
  {
    id: 'roomTitle',
    label: 'Room Title',
    name: 'roomTitle',
    required: true,
    variant: 'standard',
    category: 'text'
  },
  {
    id: 'roomPrice',
    label: 'Price',
    name: 'roomPrice',
    variant: 'standard',
    required: true,
    category: 'price'
  },
  {
    id: 'maxPeople',
    label: 'Max people',
    name: 'maxPeople',
    variant: 'standard',
    required: true,
    category: 'text'
  },
  {
    name: 'hotel',
    id: 'roomHotel',
    label: 'Hotel',
    category: 'autocomplete'
  },
  {
    id: 'roomNumbers',
    label: 'Room Numbers',
    name: 'roomNumbers',
    required: true,
    variant: 'standard',
    category: 'text',
    texthelper: 'Write the room numbers separated by a comma',
    fullWidth: true
  },
  {
    id: 'roomDescription',
    label: 'Description',
    name: 'roomDescription',
    variant: 'standard',
    required: true,
    category: 'text',
    multiline: true,
    rows: 4,
    fullWidth: true
  }
]
