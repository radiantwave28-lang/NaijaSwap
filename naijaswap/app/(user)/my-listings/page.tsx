import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Eye, Pencil, Zap } from "lucide-react"

async function getUserListings(userId: string) {
  return await prisma.listing.findMany({
    where: { userId },
    include: {
      category: true,
      _count: { select: { reviews: true, messages: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function MyListingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const listings = await getUserListings(session.user.id)

  const activeListings = listings.filter(l => l.status === "APPROVED")
  const pendingListings = listings.filter(l => l.status === "PENDING")
  const soldListings = listings.filter(l => l.status === "SOLD")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Listings</h1>
          <p className="text-muted-foreground">Manage your listings and track performance</p>
        </div>
        <Link href="/my-listings/create">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Listing
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeListings.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingListings.length})
          </TabsTrigger>
          <TabsTrigger value="sold">
            Sold ({soldListings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <ListingsGrid listings={activeListings} />
        </TabsContent>

        <TabsContent value="pending">
          <ListingsGrid listings={pendingListings} />
        </TabsContent>

        <TabsContent value="sold">
          <ListingsGrid listings={soldListings} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ListingsGrid({ listings }: { listings: any[] }) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No listings in this category</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <Card key={listing.id} className="overflow-hidden">
          <div className="relative aspect-[4/3]">
            <Image
              src={listing.images[0] || "/placeholder.jpg"}
              alt={listing.title}
              fill
              className="object-cover"
            />
            <Badge 
              className="absolute top-3 left-3"
              variant={listing.status === "APPROVED" ? "default" : "secondary"}
            >
              {listing.status}
            </Badge>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-1">{listing.title}</h3>
            <p className="text-lg font-bold text-primary mb-2">
              {formatPrice(Number(listing.price))}
            </p>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>{listing.category.name}</span>
              <span>{formatDate(listing.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/listing/${listing.slug}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              </Link>
              <Link href={`/my-listings/edit/${listing.id}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
              {!listing.featured && (
                <Link href={`/my-listings/boost/${listing.id}`}>
                  <Button size="sm" className="gap-2">
                    <Zap className="h-4 w-4" />
                    Boost
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
