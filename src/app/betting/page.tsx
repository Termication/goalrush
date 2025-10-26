import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket } from "lucide-react" 

// This sets the page's <title> tag and meta description
export const metadata = {
  title: "Betting - Coming Soon",
  description: "Our new football betting section is launching soon!",
}


// Betting Page Component
export default function BettingPage() {
  return (

    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Rocket className="h-8 w-8 text-primary" />
          </div>

          <CardTitle className="text-3xl font-bold">
            Coming Soon!
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-1">
            Our New Football Betting Section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-base text-muted-foreground">
            We are working hard to build this new feature. We'll be 
            launching very soon with the best odds, tips, and analysis for all 
            your favorite matches.
          </p>
        </CardContent>
        <CardFooter>
          {/* The `asChild` prop passes the Link's properties to the Button,
            so the entire button becomes a client-side <Link>.
          */}
          <Button asChild className="w-full" size="lg">
            <Link href="/">Go Back to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}