import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Activity
} from "lucide-react"

async function getDashboardStats() {
  const [
    totalUsers,
    totalListings,
    totalTransactions,
    pendingListings,
    recentUsers,
    recentListings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.transaction.count(),
    prisma.listing.count({ where: { status: "PENDING" } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, createdAt: true } }),
    prisma.listing.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "desc" }, take: 5, include: { user: { select: { name: true } }, category: true } }),
  ])

  return {
    totalUsers,
    totalListings,
    totalTransactions,
    pendingListings,
    recentUsers,
    recentListings,
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.role || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    redirect("/")
  }

  const stats = await getDashboardStats()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your marketplace</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalListings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingListings} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingListings}</div>
            <p className="text-xs text-muted-foreground">Pending approvals</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.name || "Anonymous"}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentListings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{listing.title}</p>
                    <p className="text-sm text-muted-foreground">
                      by {listing.user.name} • {listing.category.name}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    {formatPrice(Number(listing.price))}
                  </span>
                </div>
              ))}
              {stats.recentListings.length === 0 && (
                <p className="text-muted-foreground">No pending listings</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
