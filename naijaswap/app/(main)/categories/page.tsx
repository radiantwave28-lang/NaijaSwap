import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Smartphone, Car, Home, Shirt, Sofa, Wrench, 
  ChevronRight, ArrowRight 
} from "lucide-react"

const categoryIcons: Record<string, React.ReactNode> = {
  smartphone: <Smartphone className="h-8 w-8" />,
  car: <Car className="h-8 w-8" />,
  home: <Home className="h-8 w-8" />,
  shirt: <Shirt className="h-8 w-8" />,
  sofa: <Sofa className="h-8 w-8" />,
  wrench: <Wrench className="h-8 w-8" />,
}

async function getCategories() {
  return await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: {
          _count: { select: { listings: true } },
        },
      },
      _count: { select: { listings: true } },
    },
    orderBy: { name: "asc" },
  })
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground">
          Browse items by category to find exactly what you need
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {categoryIcons[category.icon || "wrench"] || <Wrench className="h-8 w-8" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <Badge variant="secondary">
                      {category._count.listings + category.children.reduce((acc, c) => acc + c._count.listings, 0)} items
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.description}
                  </p>

                  {category.children.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {category.children.slice(0, 4).map((sub) => (
                        <Link key={sub.id} href={`/categories/${sub.slug}`}>
                          <Badge variant="outline" className="text-xs hover:bg-muted cursor-pointer">
                            {sub.name} ({sub._count.listings})
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link 
                    href={`/categories/${category.slug}`}
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    Browse {category.name}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
