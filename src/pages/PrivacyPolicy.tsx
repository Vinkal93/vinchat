import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 3, 2025</p>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground">
                  Welcome to QuantumAI ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI chatbot platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">We collect information that you provide directly to us:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Account information (name, email address, password)</li>
                  <li>Profile information (company name, job title)</li>
                  <li>Payment information (processed securely through our payment provider)</li>
                  <li>Content you upload (documents, files for knowledge base)</li>
                  <li>Communications with us (support requests, feedback)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Automatically Collected Information</h2>
                <p className="text-muted-foreground mb-4">When you use our platform, we automatically collect:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Device information (browser type, operating system)</li>
                  <li>Usage data (pages visited, features used, time spent)</li>
                  <li>Log data (IP address, access times, error logs)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">We use the collected information to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Detect and prevent fraud and abuse</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
                <p className="text-muted-foreground mb-4">We may share your information with:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Service providers who assist in our operations</li>
                  <li>Professional advisors (lawyers, accountants)</li>
                  <li>Law enforcement when required by law</li>
                  <li>Business partners with your consent</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  We do not sell your personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational security measures to protect your personal information. This includes encryption, secure servers, and regular security audits. However, no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
                <p className="text-muted-foreground mb-4">You have the right to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Cookies Policy</h2>
                <p className="text-muted-foreground">
                  We use cookies and similar technologies to enhance your experience. You can control cookies through your browser settings. Disabling cookies may limit some features of our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy, please contact us at:
                </p>
                <div className="bg-muted p-4 rounded-lg mt-4">
                  <p className="text-foreground font-medium">Quantum Institute</p>
                  <p className="text-muted-foreground">Email: privacy@quantumai.com</p>
                  <p className="text-muted-foreground">Website: www.quantumai.com</p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
