import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { formatPrice, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  MapPin, 
  Filter,
  Grid3X3,
  List,
  Zap,
  SlidersHorizontal
} from "lucide-react"

interface SearchParams {
  q?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  condition?: string
  location?: string
  sortBy?: string
  view?: string
}

async function getListings(searchParams: SearchParams) {
  const where: any = { status: "APPROVED" }

  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: "insensitive" } },
      { description: { contains: searchParams.q, mode: "insensitive" } },
    ]
  }

  if (searchParams.category) {
    where.category = { slug: searchParams.category }
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {}
    if (searchParams.minPrice) where.price.gte = parseFloat(searchParams.minPrice)
    if (searchParams.maxPrice) where.price.lte = parseFloat(searchParams.maxPrice)
  }

  if (searchParams.condition) {
    where.condition = searchParams.condition.toUpperCase()
  }

  if (searchParams.location) {
    where.location = { contains: searchParams.location, mode: "insensitive" }
  }

  const orderBy: any = {}
  switch (searchParams.sortBy) {
    case "price-asc":
      orderBy.price = "asc"
      break
    case "price-desc":
      orderBy.price = "desc"
      break
    case "popular":
      orderBy.viewCount = "desc"
      break
    default:
      orderBy.createdAt = "desc"
  }

  const listings = await prisma.listing.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      category: true,
      _count: { select: { reviews: true } },
    },
    orderBy,
    take: 24,
  })

  return listings
}

async function getCategories() {
  return await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
  })
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const [listings, categories] = await Promise.all([
    getListings(searchParams),
    getCategories(),
  ])

  const viewMode = searchParams.view || "grid"

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Listings</h1>
        <p className="text-muted-foreground">
          {listings.length} {listings.length === 1 ? "listing" : "listings"} available
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="h-5 w-5" />
            <h2 className="font-semibold">Filters</h2>
          </div>

          {/* Search */}
          <form action="/listings" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="q"
                  placeholder="Search..."
                  defaultValue={searchParams.q}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select name="category" defaultValue={searchParams.category}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Price Range</label>
              <div className="flex gap-2">
                <Input
                  name="minPrice"
                  type="number"
                  placeholder="Min"
                  defaultValue={searchParams.minPrice}
                />
                <Input
                  name="maxPrice"
                  type="number"
                  placeholder="Max"
                  defaultValue={searchParams.maxPrice}
                />
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="text-sm font-medium mb-2 block">Condition</label>
              <Select name="condition" defaultValue={searchParams.condition}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Condition</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="USED">Used</SelectItem>
                  <SelectItem value="REFURBISHED">Refurbished</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input
                name="location"
                placeholder="e.g. Lagos"
                defaultValue={searchParams.location}
              />
            </div>

            <Button type="submit" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </form>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <Select name="sortBy" defaultValue={searchParams.sortBy || "newest"}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Link href={`/listings?${new URLSearchParams({ ...searchParams, view: "grid" }).toString()}`}>
                <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon">
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/listings?${new URLSearchParams({ ...searchParams, view: "list" }).toString()}`}>
                <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon">
                  <List className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Listings Grid */}
          {listings.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className={cn(
              "grid gap-6",
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1"
            )}>
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ListingCard({ listing, viewMode }: { listing: any; viewMode: string }) {
  const isGrid = viewMode === "grid"

  return (
    <Link href={`/listing/${listing.slug}`}>
      <Card className={cn(
        "group overflow-hidden hover:shadow-lg transition-all duration-300",
        !isGrid && "flex flex-row"
      )}>
        <div className={cn(
          "relative overflow-hidden bg-muted",
          isGrid ? "aspect-[4/3]" : "w-48 h-48 shrink-0"
        )}>
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
        <CardContent className={cn("p-4", !isGrid && "flex-1")}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
            <span className="font-bold text-primary whitespace-nowrap">
              {formatPrice(Number(listing.price))}
            </span>
          </div>
          <p className={cn("text-sm text-muted-foreground mb-3", isGrid && "line-clamp-2")}>
            {listing.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {listing.location}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {listing.condition}
              </Badge>
              {listing.negotiable && (
                <Badge variant="secondary" className="text-xs">
                  Negotiable
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
