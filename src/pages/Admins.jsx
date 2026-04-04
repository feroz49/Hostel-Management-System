import { useEffect, useState } from 'react'
import { Shield, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Table from '../components/common/Table'
import { adminsService } from '../services/adminService'
import { getApiErrorMessage } from '../services/api'
import { formatDateTime } from '../utils/helpers'

const columns = (deletingId, onDelete) => [
  { header: 'Admin ID', key: 'id', sortable: true },
  { header: 'Name', key: 'name', sortable: true },
  { header: 'Email', key: 'email', sortable: true },
  {
    header: 'Role',
    key: 'role',
    sortable: true,
    render: (row) => (
      <Badge variant="info">
        {row.role}
      </Badge>
    ),
  },
  {
    header: 'Last Login',
    key: 'lastLogin',
    render: (row) => formatDateTime(row.lastLogin),
  },
  {
    header: 'Created At',
    key: 'createdAt',
    sortable: true,
    render: (row) => formatDateTime(row.createdAt),
  },
  {
    header: 'Actions',
    key: 'actions',
    render: (row) => (
      <Button
        type="button"
        size="sm"
        variant="danger"
        loading={deletingId === row.id}
        onClick={() => onDelete(row)}
      >
        <Trash2 className="mr-1.5 h-4 w-4" />
        Remove
      </Button>
    ),
  },
]

const summaryItems = (rows) => [
  { label: 'Normal Admins', value: rows.length, tone: 'blue' },
  { label: 'Active Logins', value: rows.filter((row) => row.lastLogin).length, tone: 'emerald' },
]

const toneClasses = {
  blue: 'bg-sky-50 text-sky-900 border-sky-100 dark:bg-sky-950/30 dark:text-sky-100 dark:border-sky-900/40',
  emerald: 'bg-emerald-50 text-emerald-900 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-100 dark:border-emerald-900/40',
}

const Admins = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')

  const loadAdmins = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await adminsService.getAll()
      setRows(Array.isArray(data) ? data : [])
    } catch (fetchError) {
      const message = getApiErrorMessage(fetchError, 'Failed to load admin accounts.')
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdmins()
  }, [])

  const handleDelete = async (row) => {
    if (!window.confirm(`Remove admin account for ${row.email}? This action cannot be undone.`)) {
      return
    }

    setDeletingId(row.id)

    try {
      const response = await adminsService.remove(row.id)
      toast.success(response.message || 'Admin removed successfully.')
      await loadAdmins()
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError, 'Failed to remove admin account.'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Accounts</h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Super Admin can review and remove standard admin accounts from this panel.
          </p>
        </div>

        <Button type="button" variant="outline" onClick={loadAdmins}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {summaryItems(rows).map((metric) => (
          <div
            key={metric.label}
            className={`rounded-2xl border p-5 shadow-sm ${toneClasses[metric.tone || 'blue']}`}
          >
            <p className="text-sm font-medium opacity-80">{metric.label}</p>
            <p className="mt-3 text-3xl font-bold">{metric.value}</p>
          </div>
        ))}
      </div>

      {error && (
        <Card className="border-red-100 dark:border-red-900/40">
          <div className="flex items-start gap-3 text-red-700 dark:text-red-300">
            <Shield className="mt-0.5 h-5 w-5" />
            <div>
              <p className="font-semibold">Could not load admin accounts</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        </Card>
      )}

      <Table
        columns={columns(deletingId, handleDelete)}
        data={rows}
        loading={loading}
        emptyMessage="No standard admin accounts found."
        searchPlaceholder="Search admins by ID, name, email, or login time..."
      />
    </div>
  )
}

export default Admins
