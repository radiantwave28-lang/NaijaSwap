import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MapPin, 
  Calendar, 
  Eye, 
  MessageSquare, 
  Share2, 
  Flag,
  Heart,
  Phone,
  Mail,
  CheckCircle2,
  Zap,
  ArrowLeft
} from "lucide-react"

async function getListing(slug: string) {
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, avatar: true, createdAt: true } },
      category: true,
      reviews: {
        include: {
          reviewer: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      _count: {
        select: { reviews: true, messages: true },
      },
    },
  })

  if (!listing || listing.status !== "APPROVED") {
    return null
  }

  // Increment view count
  await prisma.listing.update({
    where: { id: listing.id },
    data: { viewCount: { increment: 1 } },
  })

  return listing
}

export default async function ListingDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const session = await getServerSession(authOptions)
  const listing = await getListing(params.slug)

  if (!listing) {
    notFound()
  }

  const isOwner = session?.user?.id === listing.userId
  const avgRating = listing.reviews.length > 0
    ? listing.reviews.reduce((acc, r) => acc + r.rating, 0) / listing.reviews.length
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/listings" className="hover:text-foreground">Listings</Link>
        <span>/</span>
        <Link href={`/categories/${listing.category.slug}`} className="hover:text-foreground">
          {listing.category.name}
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-[200px]">{listing.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card className="overflow-hidden">
            <div className="relative aspect-[16/10] bg-muted">
              <Image
                src={listing.images[0] || "/placeholder.jpg"}
                alt={listing.title}
                fill
                className="object-cover"
                priority
              />
              {listing.featured && (
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  <Zap className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            {listing.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {listing.images.map((img, idx) => (
                  <div key={idx} className="relative h-20 w-20 rounded-lg overflow-hidden shrink-0 border-2 border-transparent hover:border-primary cursor-pointer">
                    <Image src={img} alt={`${listing.title} ${idx + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Listing Info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {listing.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(listing.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {listing.viewCount.toLocaleString()} views
              </span>
              <Badge variant={listing.condition === "NEW" ? "default" : "secondary"}>
                {listing.condition}
              </Badge>
              {listing.negotiable && (
                <Badge variant="outline">Negotiable</Badge>
              )}
            </div>

            <div className="text-3xl font-bold text-primary mb-6">
              {formatPrice(Number(listing.price))}
              {listing.negotiable && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Negotiable)
                </span>
              )}
            </div>

            <Separator className="my-6" />

            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            <Separator className="my-6" />

            {/* Reviews */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Reviews ({listing._count.reviews})
                {avgRating > 0 && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    Average: {avgRating.toFixed(1)}/5
                  </span>
                )}
              </h3>

              {listing.reviews.length > 0 ? (
                <div className="space-y-4">
                  {listing.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={review.reviewer.avatar || ""} />
                            <AvatarFallback>{review.reviewer.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{review.reviewer.name}</p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seller Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={listing.user.avatar || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {listing.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{listing.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Member since {formatDate(listing.user.createdAt)}
                  </p>
                </div>
              </div>

              {!isOwner && (
                <div className="space-y-2">
                  <Link href={`/messages?listing=${listing.id}&seller=${listing.userId}`}>
                    <Button className="w-full gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Message Seller
                    </Button>
                  </Link>

                  {listing.user.phone && (
                    <Button variant="outline" className="w-full gap-2">
                      <Phone className="h-4 w-4" />
                      {listing.user.phone}
                    </Button>
                  )}

                  <Link href={`/api/payments/initiate?listingId=${listing.id}`}>
                    <Button variant="secondary" className="w-full gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Buy Now
                    </Button>
                  </Link>
                </div>
              )}

              {isOwner && (
                <div className="space-y-2">
                  <Link href={`/my-listings/edit/${listing.id}`}>
                    <Button variant="outline" className="w-full">Edit Listing</Button>
                  </Link>
                  <Link href={`/my-listings/boost/${listing.id}`}>
                    <Button className="w-full gap-2">
                      <Zap className="h-4 w-4" />
                      Boost Listing
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Safety Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Safety Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  Meet in a safe public place
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  Inspect the item before payment
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  Use secure payment methods
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  Never pay in advance
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
