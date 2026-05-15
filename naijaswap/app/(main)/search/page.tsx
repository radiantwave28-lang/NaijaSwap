import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Zap } from "lucide-react"

interface SearchParams {
  q?: string
}

async function searchListings(query: string) {
  if (!query.trim()) return []

  return await prisma.listing.findMany({
    where: {
      status: "APPROVED",
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { location: { contains: query, mode: "insensitive" } },
        { category: { name: { contains: query, mode: "insensitive" } } },
      ],
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      category: true,
    },
    orderBy: [
      { featured: "desc" },
      { createdAt: "desc" },
    ],
    take: 24,
  })
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const query = searchParams.q || ""
  const listings = query ? await searchListings(query) : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-4 text-center">Search Listings</h1>
        <form action="/search" className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Search for anything..."
            defaultValue={query}
            className="h-14 pl-12 pr-4 text-lg"
            autoFocus
          />
          <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
            Search
          </Button>
        </form>
      </div>

      {query && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            {listings.length} {listings.length === 1 ? "result" : "results"} for "{query}"
          </p>
        </div>
      )}

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Link key={listing.id} href={`/listing/${listing.slug}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={listing.images[0] || "/placeholder.jpg"}
                    alt={listing.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {listing.featured && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      <Zap className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-1">
                    {listing.title}
                  </h3>
                  <p className="text-lg font-bold text-primary mb-2">
                    {formatPrice(Number(listing.price))}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {listing.location}
                    </span>
                    <span>{listing.category.name}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-16">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We couldn't find any listings matching "{query}". Try different keywords or browse categories.
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <Link href="/listings">
              <Button variant="outline">Browse All Listings</Button>
            </Link>
            <Link href="/categories">
              <Button>Browse Categories</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
