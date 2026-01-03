import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function Terms() {
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
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 3, 2025</p>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using QuantumAI's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground">
                  QuantumAI provides an AI-powered chatbot platform that allows users to create, train, and deploy intelligent chatbots. Our services include knowledge base management, conversation analytics, and widget embedding capabilities.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                <p className="text-muted-foreground mb-4">To use our services, you must:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Create an account with accurate information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Be at least 18 years old or have parental consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
                <p className="text-muted-foreground mb-4">You agree not to use our services to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit malicious code or harmful content</li>
                  <li>Harass, abuse, or harm others</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated systems to scrape or extract data</li>
                  <li>Engage in fraudulent or deceptive practices</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Content and Data</h2>
                <p className="text-muted-foreground">
                  You retain ownership of content you upload to our platform. By uploading content, you grant us a license to use, process, and display that content as necessary to provide our services. You are responsible for ensuring you have the right to upload any content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Subscription and Payment</h2>
                <p className="text-muted-foreground mb-4">For paid services:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Fees are billed in advance on a monthly or annual basis</li>
                  <li>All payments are non-refundable except as required by law</li>
                  <li>We may change pricing with 30 days notice</li>
                  <li>Failure to pay may result in service suspension</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Service Availability</h2>
                <p className="text-muted-foreground">
                  We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. We may perform maintenance that temporarily affects availability. We are not liable for any downtime or service interruptions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  QuantumAI and its original content, features, and functionality are owned by Quantum Institute and are protected by international copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  To the maximum extent permitted by law, QuantumAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
                <p className="text-muted-foreground">
                  You agree to indemnify and hold harmless QuantumAI, its affiliates, and their respective officers, directors, and employees from any claims arising from your use of our services or violation of these terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
                <p className="text-muted-foreground">
                  We may terminate or suspend your account at any time for violations of these terms. Upon termination, your right to use our services ceases immediately. You may export your data within 30 days of termination.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. We will notify users of significant changes via email or platform notification. Continued use after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
                <p className="text-muted-foreground">
                  These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-muted p-4 rounded-lg mt-4">
                  <p className="text-foreground font-medium">Quantum Institute</p>
                  <p className="text-muted-foreground">Email: legal@quantumai.com</p>
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
