import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  MapPin, 
  TrendingUp, 
  Shield, 
  Zap, 
  ChevronRight,
  Smartphone,
  Car,
  Home,
  Shirt,
  Sofa,
  Wrench
} from "lucide-react"

const categoryIcons: Record<string, React.ReactNode> = {
  smartphone: <Smartphone className="h-6 w-6" />,
  car: <Car className="h-6 w-6" />,
  home: <Home className="h-6 w-6" />,
  shirt: <Shirt className="h-6 w-6" />,
  sofa: <Sofa className="h-6 w-6" />,
  wrench: <Wrench className="h-6 w-6" />,
}

async function getFeaturedListings() {
  return await prisma.listing.findMany({
    where: {
      status: "APPROVED",
      featured: true,
      featuredUntil: { gte: new Date() },
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      category: true,
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  })
}

async function getRecentListings() {
  return await prisma.listing.findMany({
    where: { status: "APPROVED" },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      category: true,
    },
    orderBy: { createdAt: "desc" },
    take: 12,
  })
}

async function getCategories() {
  return await prisma.category.findMany({
    where: { parentId: null },
    include: {
      _count: { select: { listings: true } },
    },
    orderBy: { name: "asc" },
  })
}

export default async function HomePage() {
  const [featured, recent, categories] = await Promise.all([
    getFeaturedListings(),
    getRecentListings(),
    getCategories(),
  ])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-nija-500 via-nija-600 to-nija-700 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200')] opacity-10 bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Zap className="h-3 w-3 mr-1" />
              Nigeria's #1 Marketplace
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Buy & Sell Anything in{" "}
              <span className="text-nija-200">Nigeria</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of Nigerians buying and selling cars, electronics, 
              real estate, fashion, and more. Safe, secure, and hassle-free.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <form action="/search" className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    name="q"
                    placeholder="What are you looking for?"
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-nija-400"
                  />
                </div>
                <Button type="submit" size="lg" className="h-14 px-8 bg-foreground text-primary hover:bg-foreground/90">
                  Search
                </Button>
              </form>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4" /> Secure Payments
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" /> 50K+ Active Users
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-4 w-4" /> Instant Delivery
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Browse Categories</h2>
              <p className="text-muted-foreground mt-1">Find exactly what you need</p>
            </div>
            <Link href="/categories">
              <Button variant="ghost" className="gap-2">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {categoryIcons[category.icon || "wrench"] || <Wrench className="h-6 w-6" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {category._count.listings} listings
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Featured Listings</h2>
                <p className="text-muted-foreground mt-1">Premium items handpicked for you</p>
              </div>
              <Link href="/listings?featured=true">
                <Button variant="ghost" className="gap-2">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Listings */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Fresh Arrivals</h2>
              <p className="text-muted-foreground mt-1">New listings added daily</p>
            </div>
            <Link href="/listings">
              <Button variant="ghost" className="gap-2">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recent.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">How NijaSwap Works</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Start buying and selling in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up for free and verify your profile to start trading safely.",
                icon: <Shield className="h-8 w-8" />,
              },
              {
                step: "02",
                title: "List or Browse",
                description: "Post your items with photos or browse thousands of verified listings.",
                icon: <Search className="h-8 w-8" />,
              },
              {
                step: "03",
                title: "Secure Transaction",
                description: "Connect with buyers/sellers and complete secure payments via Paystack or Flutterwave.",
                icon: <Zap className="h-8 w-8" />,
              },
            ].map((item) => (
              <Card key={item.step} className="relative overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-muted/20">
                    {item.step}
                  </div>
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-nija-600 to-nija-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join 50,000+ sellers on NijaSwap. List your first item for free and reach 
            thousands of buyers across Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-nija-700 hover:bg-white/90 px-8">
                Get Started Free
              </Button>
            </Link>
            <Link href="/my-listings/create">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                List an Item
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Listing Card Component
function ListingCard({ listing }: { listing: any }) {
  return (
    <Link href={`/listing/${listing.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
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
          {listing.negotiable && (
            <Badge variant="secondary" className="absolute top-3 right-3">
              Negotiable
            </Badge>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <p className="text-white text-sm font-semibold">
              {formatPrice(Number(listing.price))}
            </p>
          </div>
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
            {listing.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {listing.location}
            </span>
            <span>{listing.category.name}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
