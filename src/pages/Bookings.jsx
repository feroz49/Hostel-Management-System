import { useCallback } from 'react'
import Badge from '../components/common/Badge'
import ResourcePage from '../components/admin/ResourcePage'
import { bookingsService } from '../services/adminService'
import { formatCurrency, formatDateTime } from '../utils/helpers'

const columns = [
  { header: 'Booking ID', key: 'booking_transaction_id', sortable: true },
  { header: 'Student', key: 'student_name', sortable: true },
  {
    header: 'Contact',
    key: 'student_email',
    render: (row) => (
      <div className="space-y-1">
        <p>{row.student_email || '-'}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{row.student_phone || 'No phone'}</p>
      </div>
    ),
  },
  {
    header: 'Requested Room',
    key: 'requested_room_name',
    render: (row) => (
      <div>
        <p className="font-medium">{row.requested_room_name || '-'}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{row.requested_room_category || '-'}</p>
      </div>
    ),
  },
  {
    header: 'Allocated Room',
    key: 'allocated_room_number',
    render: (row) => (
      <div>
        <p className="font-medium">
          {row.allocated_room_number ? `Room ${row.allocated_room_number}` : '-'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {row.allocated_block_name || 'Block pending'} {row.allocated_room_type ? `- ${row.allocated_room_type}` : ''}
        </p>
      </div>
    ),
  },
  {
    header: 'Payment',
    key: 'amount',
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-semibold">{formatCurrency(row.amount)}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {row.card_brand || 'Card'} {row.card_last4 ? `ending ${row.card_last4}` : ''}
        </p>
      </div>
    ),
  },
  {
    header: 'Booked At',
    key: 'booked_at',
    sortable: true,
    render: (row) => formatDateTime(row.booked_at),
  },
  {
    header: 'Status',
    key: 'status',
    render: (row) => (
      <Badge variant={row.status === 'Completed' ? 'success' : 'warning'}>
        {row.status || 'Pending'}
      </Badge>
    ),
  },
]

const summaryItems = (rows) => [
  { label: 'Total Bookings', value: rows.length, tone: 'blue' },
  {
    label: 'Total Collected',
    value: formatCurrency(rows.reduce((sum, row) => sum + Number(row.amount || 0), 0)),
    tone: 'emerald',
  },
  {
    label: 'Completed',
    value: rows.filter((row) => row.status === 'Completed').length,
    tone: 'amber',
  },
]

const Bookings = () => {
  const fetchData = useCallback(() => bookingsService.getAll(), [])

  return (
    <ResourcePage
      title="Booking Transactions"
      description="Track every student booking and payment transaction directly from backend records."
      fetchData={fetchData}
      columns={columns}
      summaryItems={summaryItems}
      searchPlaceholder="Search bookings by student, room, email, payment, or status..."
      emptyMessage="No booking transactions have been recorded yet."
    />
  )
}

export default Bookings

