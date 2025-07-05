import type { Metadata } from 'next';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, QuestionMarkCircleIcon, ChatBubbleLeftRightIcon, NewspaperIcon } from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Metadata for this page for SEO
export const metadata: Metadata = {
  title: "Support Center | GoalRush",
  description: "Get help and support from the GoalRush team. Find answers in our FAQ or contact us directly with your questions, feedback, or news tips.",
};

export default function SupportPage() {
  return (
    <div className="bg-base-200/60">
      {/* --- HERO SECTION --- */}
      <div className="hero h-80" style={{ backgroundImage: 'url(https://placehold.co/1600x600/1a2a3a/ffffff?text=Support+Center)' }}>
        <div className="hero-overlay bg-black bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-2xl">
            <h1 className="mb-5 text-6xl font-poppins font-extrabold">We're Here to Help</h1>
            <p className="mb-5 text-xl font-light">Have a question, feedback, or a news tip? Reach out to us.</p>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto max-w-5xl p-6 md:p-12 -mt-16">
        <div className="bg-base-100 rounded-2xl shadow-xl p-8 md:p-12 space-y-16">
          
          {/* Contact Form Section */}
          <section>
            <h2 className="text-4xl font-poppins font-bold text-center mb-2">Get in Touch</h2>
            <p className="text-center text-base-content/70 mb-8">Fill out the form below and our team will get back to you as soon as possible.</p>
            <form className="space-y-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="e.g., Feedback, News Tip, Technical Issue" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Tell us how we can help..." className="h-32" />
              </div>
              <div className="text-right">
                <Button type="submit">Send Message</Button>
              </div>
            </form>
          </section>

          {/* FAQ Section */}
          <section>
             <h2 className="text-4xl font-poppins font-bold text-center mb-10">Frequently Asked Questions</h2>
             <div className="space-y-4 max-w-3xl mx-auto">
                <div className="collapse collapse-plus bg-base-200">
                  <input type="radio" name="my-accordion-3" defaultChecked /> 
                  <div className="collapse-title text-xl font-medium">
                    How do I report a correction or a news tip?
                  </div>
                  <div className="collapse-content"> 
                    <p>We appreciate your help in keeping our news accurate! Please use the contact form above with the subject "News Tip" or "Correction Request" and provide as much detail as possible, including links to sources if available.</p>
                  </div>
                </div>
                <div className="collapse collapse-plus bg-base-200">
                  <input type="radio" name="my-accordion-3" /> 
                  <div className="collapse-title text-xl font-medium">
                    Do you have a mobile app?
                  </div>
                  <div className="collapse-content"> 
                    <p>A dedicated mobile app for GoalRush is currently in development. Stay tuned for announcements on our homepage and social media channels for its release on iOS and Android.</p>
                  </div>
                </div>
                <div className="collapse collapse-plus bg-base-200">
                  <input type="radio" name="my-accordion-3" /> 
                  <div className="collapse-title text-xl font-medium">
                    Can I write for GoalRush?
                  </div>
                  <div className="collapse-content"> 
                    <p>We are always looking for passionate football writers to join our team. Please send an email to <a href="mailto:careers@goalrush.com" className="text-primary hover:underline">careers@goalrush.com</a> with your resume and a few writing samples.</p>
                  </div>
                </div>
             </div>
          </section>

           {/* Direct Contact Section */}
          <section>
             <h2 className="text-4xl font-poppins font-bold text-center mb-10">Direct Contact</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="card bg-base-200/50 p-6">
                    <EnvelopeIcon className="h-12 w-12 text-primary mx-auto mb-4"/>
                    <h3 className="text-2xl font-poppins font-bold">Email Us</h3>
                    <p className="mt-2 text-base-content/80">For general inquiries and support.</p>
                    <a href="mailto:support@goalrush.com" className="text-primary hover:underline mt-2">support@goalrush.com</a>
                </div>
                <div className="card bg-base-200/50 p-6">
                    <PhoneIcon className="h-12 w-12 text-primary mx-auto mb-4"/>
                    <h3 className="text-2xl font-poppins font-bold">Call Us</h3>
                    <p className="mt-2 text-base-content/80">Mon-Fri, 9am - 5pm SAST.</p>
                    <a href="tel:+27111234567" className="text-primary hover:underline mt-2">+27 11 123 4567</a>
                </div>
                 <div className="card bg-base-200/50 p-6">
                    <MapPinIcon className="h-12 w-12 text-primary mx-auto mb-4"/>
                    <h3 className="text-2xl font-poppins font-bold">Our Office</h3>
                    <p className="mt-2 text-base-content/80">430 Football Lane,<br/>Germiston, Gauteng</p>
                 </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  )
}
