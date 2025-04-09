"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

import { CheckCircle } from "lucide-react";
import {DialogDemo} from "./Contact";
import { ROICalculator } from "./ROICal";

// Key Features Section with visualization
export const KeyFeaturesSection = () => {
  const features = [
    {
      title: "Real-time Tracking",
      description:
        "Monitor inventory levels and movements across locations in real-time",
      icon: "chart-line",
      color: "#4D90FE",
    },
    {
      title: "Barcode Integration",
      description:
        "Scan, create and print barcodes for seamless inventory management",
      icon: "barcode",
      color: "#4D90FE",
    },
    {
      title: "Smart Analytics",
      description:
        "Gain actionable insights with comprehensive inventory reports and forecasts",
      icon: "chart-bar",
      color: "#00C853",
    },
    {
      title: "Automated Alerts",
      description:
        "Get instant notifications for low stock, expiring items, and order status changes",
      icon: "bell",
      color: "#4D90FE",
    },
    {
      title: "Multi-location Support",
      description:
        "Manage inventory across multiple warehouses and retail locations",
      icon: "building",
      color: "#00C853",
    },
    {
      title: "Order Management",
      description:
        "Create and track purchase orders with automated reordering capabilities",
      icon: "clipboard-list",
      color: "#4D90FE",
    },
  ];

  return (
    <section className="py-16 bg-[#121212] w-full px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful Features for Complete Control
          </h2>
          <p className="text-[#ABABAB] max-w-3xl mx-auto text-lg">
            Our inventory management system provides all the tools you need to
            streamline operations and boost productivity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-[#1E1E1E] border-gray-800 h-full">
                <CardHeader>
                  <div
                    className="rounded-full w-12 h-12 flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <span className={`text-${feature.color} text-xl`}>
                      <i className={`fas fa-${feature.icon}`}></i>
                    </span>
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#ABABAB]">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Benefits & Value Proposition Section
export const BenefitsSection = () => {
  const benefits = [
    {
      title: "Reduce Costs",
      description:
        "Cut inventory carrying costs by up to 30% through optimized stock levels and reduced waste",
      stats: "30% Savings",
      color: "#00C853",
    },
    {
      title: "Save Time",
      description:
        "Automate manual processes and reduce inventory counting time by up to 75%",
      stats: "75% Faster",
      color: "#4D90FE",
    },
    {
      title: "Eliminate Errors",
      description:
        "Achieve 99.9% accuracy with barcode scanning and automated data entry",
      stats: "99.9% Accuracy",
      color: "#0066CC",
    },
    {
      title: "Increase Sales",
      description:
        "Prevent stockouts and capitalize on trends with AI-powered forecasting",
      stats: "15% Growth",
      color: "#00C853",
    },
  ];

  return (
    <section className="py-16 bg-[#121212] w-full px-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Transform Your Inventory Management
          </h2>
          <p className="text-[#ABABAB] max-w-3xl mx-auto text-lg">
            See immediate returns on your investment with measurable
            improvements across your operations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#1E1E1E] p-6 rounded-lg border border-gray-800 flex flex-col"
            >
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: benefit.color }}
              >
                {benefit.stats}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-[#ABABAB] flex-grow">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 flex justify-center"
        >
          <Card className="bg-[#0066CC] border-none max-w-4xl w-full">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Calculate Your ROI
                  </h3>
                  <p className="text-white opacity-90 mb-6">
                    See how much you could save by implementing our inventory
                    management system.
                  </p>
                  <ROICalculator />
                </div>
                <div className="bg-[#4D90FE] p-6 rounded-lg">
                  <div className="text-white mb-4">
                    <div className="text-sm uppercase tracking-wider mb-1">
                      Average Annual Savings
                    </div>
                    <div className="text-4xl font-bold">$42,500</div>
                  </div>
                  <div className="flex gap-2 items-center mb-2">
                    <CheckCircle size={16} className="text-white" />
                    <span className="text-white text-sm">
                      Reduced carrying costs
                    </span>
                  </div>
                  <div className="flex gap-2 items-center mb-2">
                    <CheckCircle size={16} className="text-white" />
                    <span className="text-white text-sm">
                      Lower labor expenses
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <CheckCircle size={16} className="text-white" />
                    <span className="text-white text-sm">
                      Minimized stockouts
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

// Use Cases & Industry Applications Section
export const UseCasesSection = () => {
  return (
    <section className="py-16 bg-[#121212] w-full px-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Solutions for Every Industry
          </h2>
          <p className="text-[#ABABAB] max-w-3xl mx-auto text-lg">
            Our inventory management system is tailored to meet the specific
            needs of diverse industries.
          </p>
        </motion.div>

        <Tabs defaultValue="retail" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-center bg-[#121212] mb-8">
            <TabsTrigger
              value="retail"
              className="flex-grow text-[#ABABAB] data-[state=active]:text-white data-[state=active]:bg-[#0066CC]"
            >
              Retail
            </TabsTrigger>
            <TabsTrigger
              value="manufacturing"
              className="flex-grow text-[#ABABAB] data-[state=active]:text-white data-[state=active]:bg-[#0066CC]"
            >
              Manufacturing
            </TabsTrigger>
            <TabsTrigger
              value="wholesale"
              className="flex-grow text-[#ABABAB] data-[state=active]:text-white data-[state=active]:bg-[#0066CC]"
            >
              Wholesale
            </TabsTrigger>
            <TabsTrigger
              value="healthcare"
              className="flex-grow text-[#ABABAB] data-[state=active]:text-white data-[state=active]:bg-[#0066CC]"
            >
              Healthcare
            </TabsTrigger>
            <TabsTrigger
              value="ecommerce"
              className="flex-grow text-[#ABABAB] data-[state=active]:text-white data-[state=active]:bg-[#0066CC]"
            >
              E-commerce
            </TabsTrigger>
          </TabsList>

          <TabsContent value="retail" className="mt-0">
            <Card className="bg-[#1E1E1E] border-gray-800">
              <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Retail Inventory Solutions
                    </h3>
                    <p className="text-[#ABABAB] mb-6">
                      Optimize your store inventory with powerful POS
                      integration, multi-location tracking, and seasonal demand
                      forecasting.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex gap-3">
                        <CheckCircle
                          className="text-[#00C853] flex-shrink-0"
                          size={20}
                        />
                        <span className="text-[#ABABAB]">
                          Seamless POS system integration
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle
                          className="text-[#00C853] flex-shrink-0"
                          size={20}
                        />
                        <span className="text-[#ABABAB]">
                          In-store and online inventory synchronization
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle
                          className="text-[#00C853] flex-shrink-0"
                          size={20}
                        />
                        <span className="text-[#ABABAB]">
                          Mobile barcode scanning for quick inventory counts
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle
                          className="text-[#00C853] flex-shrink-0"
                          size={20}
                        />
                        <span className="text-[#ABABAB]">
                          Sales trend analysis and forecasting
                        </span>
                      </li>
                    </ul>
                    <button className="mt-6 px-6 py-2 bg-[#0066CC] text-white font-medium rounded-lg hover:bg-[#4D90FE] transition-colors">
                      Learn More About Retail Solutions
                    </button>
                  </div>
                  <div className="bg-[#121212] p-6 rounded-lg border border-gray-800">
                    <div className="text-lg font-medium text-white mb-4">
                      Case Study: Metro Retailer
                    </div>
                    <p className="text-[#ABABAB] mb-4">
                      A multi-location retail chain reduced inventory costs by
                      23% and increased sales by 18% after implementing our
                      system.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-[#1E1E1E] p-4 rounded-lg">
                        <div className="text-[#00C853] text-2xl font-bold">
                          23%
                        </div>
                        <div className="text-[#ABABAB] text-sm">
                          Cost Reduction
                        </div>
                      </div>
                      <div className="bg-[#1E1E1E] p-4 rounded-lg">
                        <div className="text-[#4D90FE] text-2xl font-bold">
                          18%
                        </div>
                        <div className="text-[#ABABAB] text-sm">
                          Sales Growth
                        </div>
                      </div>
                    </div>
                    <div className="italic text-[#ABABAB]">
                      "The inventory management system has transformed how we
                      operate. We can now make data-driven decisions and respond
                      to market changes faster than ever."
                    </div>
                    <div className="mt-2 text-white">
                      — Sarah Chen, Operations Director
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional tabs would be implemented similarly */}
          <TabsContent value="manufacturing" className="mt-0">
            {/* Manufacturing content */}
          </TabsContent>
          <TabsContent value="wholesale" className="mt-0">
            {/* Wholesale content */}
          </TabsContent>
          <TabsContent value="healthcare" className="mt-0">
            {/* Healthcare content */}
          </TabsContent>
          <TabsContent value="ecommerce" className="mt-0">
            {/* E-commerce content */}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

// Integration Capabilities, Security & Reliability Section
export const IntegrationSecuritySection = () => {
//   const integrations = [
//     "QuickBooks",
//     "Shopify",
//     "WooCommerce",
//     "Amazon",
//     "SAP",
//     "Square",
//     "FedEx",
//     "UPS",
//     "Xero",
//     "Salesforce",
//     "NetSuite",
//     "Zapier",
//   ];

  return (
    <section className="py-16 bg-[#121212] w-full px-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Integrations Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Seamless Integrations
            </h2>
            <p className="text-[#ABABAB] mb-8">
              Our inventory management system connects with your existing tools
              and platforms, providing a unified workflow without disruption.
            </p>
{/* 
            <div className="flex flex-wrap gap-3 mb-8">
              {integrations.map((integration, index) => (
                <Badge
                  key={index}
                  className="bg-[#1E1E1E] text-white hover:bg-[#4D90FE] transition-colors border-gray-700 px-3 py-1"
                >
                  {integration}
                </Badge>
              ))}
            </div> */}

            <Card className="bg-[#1E1E1E] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">API Access</CardTitle>
                <CardDescription className="text-[#ABABAB]">
                  Full API documentation for custom integrations and workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-[#121212] p-4 rounded-lg border border-gray-800 font-mono text-sm text-[#ABABAB]">
                  <pre>
                    {`GET /api/v1/inventory/items\nAUTH: Bearer {api_key}\n\n// Response\n{\n  "items": [...],\n  "total": 247,\n  "page": 1\n}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Enterprise-Grade Security
            </h2>
            <p className="text-[#ABABAB] mb-8">
              Your inventory data is critical to your business. Our platform
              employs industry-leading security measures to ensure your data
              remains safe.
            </p>

            <div className="space-y-6">
              <Card className="bg-[#1E1E1E] border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-[#0066CC] p-2 mt-1">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        End-to-End Encryption
                      </h3>
                      <p className="text-[#ABABAB]">
                        All data is encrypted in transit and at rest using
                        AES-256 encryption standards.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1E1E1E] border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-[#0066CC] p-2 mt-1">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        Role-Based Access Control
                      </h3>
                      <p className="text-[#ABABAB]">
                        Define precise permissions for each team member with
                        granular access controls.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1E1E1E] border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-[#0066CC] p-2 mt-1">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        Data Backups
                      </h3>
                      <p className="text-[#ABABAB]">
                        Automated daily backups with point-in-time recovery
                        options and geo-redundant storage.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* <div className="flex items-center gap-2 text-[#ABABAB]">
                <svg
                  className="h-5 w-5 text-[#00C853]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>SOC 2 Type II Compliant</span>

                <svg
                  className="h-5 w-5 text-[#00C853] ml-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>GDPR Compliant</span>

                <svg
                  className="h-5 w-5 text-[#00C853] ml-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>99.9% Uptime SLA</span>
              </div> */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// FAQ Section
export const FAQSection = () => {
  return (
    <section className="py-16 bg-[#121212] w-full px-4 border-t border-gray-800">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#ABABAB] max-w-3xl mx-auto text-lg">
            Got questions? We've got answers. If you can't find what you're
            looking for, contact our support team.
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-gray-800">
            <AccordionTrigger className="text-white hover:text-[#4D90FE] hover:no-underline">
              How easy is it to migrate from my current system?
            </AccordionTrigger>
            <AccordionContent className="text-[#ABABAB]">
              Our team provides full migration support with data import tools
              for most popular inventory systems. The typical migration takes
              1-3 days depending on the complexity and volume of your inventory
              data. We provide detailed documentation and dedicated support
              throughout the process.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-gray-800">
            <AccordionTrigger className="text-white hover:text-[#4D90FE] hover:no-underline">
              What hardware is required for barcode scanning?
            </AccordionTrigger>
            <AccordionContent className="text-[#ABABAB]">
              Our system works with most standard USB and Bluetooth barcode
              scanners. Additionally, our mobile app turns any smartphone into a
              barcode scanner, eliminating the need for specialized hardware in
              many cases. We also offer compatible hardware packages if needed.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-gray-800">
            <AccordionTrigger className="text-white hover:text-[#4D90FE] hover:no-underline">
              Can I customize the system for my specific business needs?
            </AccordionTrigger>
            <AccordionContent className="text-[#ABABAB]">
              Yes, our system offers extensive customization options. You can
              create custom fields, adjust workflows, design personalized
              reports, and configure alerts based on your unique requirements.
              Our Enterprise plan includes access to our API for deeper
              customization and integration needs.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-gray-800">
            <AccordionTrigger className="text-white hover:text-[#4D90FE] hover:no-underline">
              How does the pricing structure work?
            </AccordionTrigger>
            <AccordionContent className="text-[#ABABAB]">
              We offer tiered pricing based on your business size and needs. Our
              Starter plan begins at $99/month for up to 1,000 SKUs and 3 users.
              Professional plan is $249/month with 10,000 SKUs and 10 users.
              Enterprise plans are custom-priced based on specific requirements.
              All plans include free updates and standard support.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border-gray-800">
            <AccordionTrigger className="text-white hover:text-[#4D90FE] hover:no-underline">
              What kind of support is available?
            </AccordionTrigger>
            <AccordionContent className="text-[#ABABAB]">
              All plans include email support with 24-hour response time and
              access to our knowledge base. Professional plans add live chat
              support during business hours. Enterprise customers receive
              priority support with dedicated account managers and phone
              support. We also offer optional enhanced support packages for all
              tiers.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="border-gray-800">
            <AccordionTrigger className="text-white hover:text-[#4D90FE] hover:no-underline">
              Can I try the system before purchasing?
            </AccordionTrigger>
            <AccordionContent className="text-[#ABABAB]">
              Yes, we offer a 14-day free trial with full access to all
              features. No credit card is required to start your trial. We also
              provide a personalized demo with our product specialists who can
              walk you through the system and answer any specific questions
              about your implementation.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-[#ABABAB] mb-6">
            Still have questions? Our team is ready to help.
          </p>
          <DialogDemo/>
        </motion.div>
      </div>
    </section>
  );
};
