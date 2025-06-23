import Image from "next/image"
import Link from "next/link"

const moreHeadlines = [
  {
    title: "🇧🇷 Neymar Returns to Training",
    image: "https://picsum.photos/seed/neymar/100/100",
    date: "Jun 22, 2025",
  },
  {
    title: "🇩🇪 Musiala Named Player of the Year",
    image: "https://picsum.photos/seed/musiala/100/100",
    date: "Jun 21, 2025",
  },
  {
    title: "🏆 Champions League Draw Announced",
    image: "https://picsum.photos/seed/ucl/100/100",
    date: "Jun 20, 2025",
  },
  {
    title: "📢 VAR Rule Updates Incoming",
    image: "https://picsum.photos/seed/var/100/100",
    date: "Jun 19, 2025",
  },
  {
    title: "👟 Adidas Releases Euro 2025 Ball",
    image: "https://picsum.photos/seed/adidas/100/100",
    date: "Jun 18, 2025",
  },
  {
    title: "📈 Rising Star: Lamine Yamal",
    image: "https://picsum.photos/seed/yamal/100/100",
    date: "Jun 17, 2025",
  },
]

export default function MoreHeadlinesSection() {
  return (
    <section className="px-4 py-6">
      <h2 className="text-lg font-bold mb-4">More Headlines</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {moreHeadlines.map((item, idx) => (
          <div
            key={idx}
            className="card card-compact bg-base-100 border rounded-md shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 ease-in-out cursor-pointer"
          >
            <div className="card-body flex-row items-center space-x-3 p-2">
              <div className="w-12 h-12 rounded overflow-hidden relative flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-[11px] text-muted-foreground">{item.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* More Button */}
      <div className="mt-6 text-center">
        <Link
          href="/news"
          className="btn btn-soft btn-primary"
        >
          More News →
        </Link>
      </div>
    </section>
  )
}
