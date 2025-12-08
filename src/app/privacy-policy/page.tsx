import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MoveLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: "Privacy Policy | GoalRush",
  description: "Read the Privacy Policy for GoalRush to understand how we collect, use, and protect your personal information.",
  robots: {
    index: false,
    follow: true,
  }
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white rounded-lg shadow-md">
        <div className="mb-8">
          <Button asChild variant="outline" className="group">
            <Link href="/">
              <MoveLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <article className="prose dark:prose-invert max-w-none prose-lg">
          <h1>Privacy Policy for GoalRush</h1>
          <p>
            <strong>Last updated: August 11, 2025</strong>
          </p>

          <p>
            At GoalRush, accessible from https://www.goal-rush.live, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by GoalRush and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>

          <h2>Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
          
          <h2>Information We Collect</h2>
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <p>
            If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
          </p>

          <h2>Log Files</h2>
          <p>
            GoalRush follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
          </p>

          <h2>Cookies and Web Beacons</h2>
          <p>
            Like any other website, GoalRush uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          <h2>Advertising Partners Privacy Policies</h2>
          <p>
            You may consult this list to find the Privacy Policy for each of the advertising partners of GoalRush.
          </p>
          
          <h2>Children's Information</h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
          </p>
          <p>
            GoalRush does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
          </p>
        </article>
      </div>
    </main>
  );
}
