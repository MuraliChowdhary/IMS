// HowItWorksPage.tsx
import React from 'react';
// import Image from 'next/image'; // Assuming Next.js for Image component
import { Button } from '../ui/button'; // Assuming shadcn/ui Button component
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'; // Assuming shadcn/ui Card components
import { DollarSign, ShoppingCart, Users, Truck, Factory, HeartPulse, Store, ChartBar } from 'lucide-react'; // Example icons from lucide-react

const HowItWorksPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Streamline Your Business with Inventory Solutions
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover how our intelligent inventory management system simplifies operations, boosts efficiency, and drives growth for your business.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          A Glimpse into Our Workflow
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Users className="mr-2 text-primary" /> Customer Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Customers can effortlessly browse and purchase products by logging into their personalized accounts. Our user-friendly interface ensures a smooth shopping journey.
              </p>
              <p className="text-gray-700">
                <strong>Test it out:</strong> <a href="https://inventorysolutions.vercel.app/login" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Customer Dashboard</a>
                <br />
                Email: <code className="bg-gray-100 p-1 rounded">customer@gmail.com</code>
                <br />
                Password: <code className="bg-gray-100 p-1 rounded">customer@123</code>
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <ShoppingCart className="mr-2 text-primary" /> Cashier & Seamless Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Once an order is placed, our Cashier role efficiently prepares it. Customers can then conveniently pay their bills through our integrated Razorpay (test mode) payment gateway.
              </p>
              <p className="text-gray-700">
                Upon successful payment, our system automatically updates stock levels in real-time.
              </p>
              <p className="text-gray-700">
                <strong>Test it out:</strong> <a href="https://inventorysolutions.vercel.app/login" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Cashier Login</a>
                <br />
                Email: <code className="bg-gray-100 p-1 rounded">cashier@gmail.com</code>
                <br />
                Password: <code className="bg-gray-100 p-1 rounded">cashier@123</code>
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <DollarSign className="mr-2 text-primary" /> Manager's Command Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                The Manager Dashboard provides a comprehensive overview of your inventory. It highlights critical information such as:
              </p>
              <ul className="list-disc list-inside text-gray-700">
                <li>Low Stock Items: Instantly notified when product quantities fall below set thresholds.</li>
                <li>Reorder Recommendations: Smart suggestions for items that need replenishment.</li>
                <li>Expiry Items: Keep track of products nearing their expiry dates.</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Test it out:</strong> <a href="https://inventorysolutions.vercel.app/login" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Manager Login</a>
                <br />
                Email: <code className="bg-gray-100 p-1 rounded">manager@gmail.com</code>
                <br />
                Password: <code className="bg-gray-100 p-1 rounded">manager@123</code>
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Truck className="mr-2 text-primary" /> Supplier Engagement (Static)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Our system also considers supplier interactions. While our current supplier page is static, it's designed to eventually integrate seamless communication and order management with your suppliers.
              </p>
              <p className="text-gray-700">
                <a href="https://inventorysolutions.vercel.app/supplier" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Supplier Page</a>
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <ChartBar className="mr-2 text-primary" /> Advanced Analytics & Sales Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Gain valuable insights with our integrated analytics and Sales Dashboard.
              </p>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Daily Summary:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  <li><strong>Daily Sales:</strong> Currently ₹0, with percentage change from yesterday.</li>
                  <li><strong>Transactions:</strong> Shows the number of items sold.</li>
                  <li><strong>Inventory Value:</strong> Displays total inventory worth, highlighting low stock and expiring items.</li>
                  <li><strong>Turnover Rate:</strong> Provides weekly and monthly turnover percentages.</li>
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Performance & Demand:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  <li><strong>Reorder Recommendations:</strong> Identifies items needing immediate attention.</li>
                  <li><strong>Top Performers:</strong> Highlights highest revenue-generating products.</li>
                  <li><strong>High Demand Items:</strong> Shows products with the highest demand.</li>
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Financial Insights:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  <li><strong>Profit Margin Analysis:</strong> Displays overall margin and total profit.</li>
                  <li><strong>Seasonal Analysis:</strong> Identifies current peak categories.</li>
                </ul>
              </div>
              <p className="text-gray-700 mt-4">
                Our Sales Dashboard provides a detailed "Sales Overview" with a bar chart visualizing sales data, along with "Total Sales," "Total Revenue," "Total Customers," and "Low Stock" metrics. You'll also see "Top Customers" for the month.
              </p>
              <p className="text-gray-700">
                <strong>Test it out:</strong> <a href="https://inventorysolutions.vercel.app/login" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Sales Login</a>
                <br />
                Email: <code className="bg-gray-100 p-1 rounded">sales@gmail.com</code>
                <br />
                Password: <code className="bg-gray-100 p-1 rounded">sales@123</code>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Versatility Across Industries
        </h2>
        <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto mb-8">
          While primarily designed for the <strong className="text-primary">retail industry</strong>, the flexible architecture of Inventory Solutions makes it adaptable to various sectors, including:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 text-center">
          <Card className="p-4 flex flex-col items-center shadow-sm">
            <Store className="text-primary h-12 w-12 mb-3" />
            <p className="font-medium text-gray-800">Retail</p>
          </Card>
          <Card className="p-4 flex flex-col items-center shadow-sm">
            <HeartPulse className="text-primary h-12 w-12 mb-3" />
            <p className="font-medium text-gray-800">Medical</p>
          </Card>
          <Card className="p-4 flex flex-col items-center shadow-sm">
            <Factory className="text-primary h-12 w-12 mb-3" />
            <p className="font-medium text-gray-800">Manufacturing</p>
          </Card>
          <Card className="p-4 flex flex-col items-center shadow-sm">
            <Users className="text-primary h-12 w-12 mb-3" />
            <p className="font-medium text-gray-800">Healthcare</p>
          </Card>
          <Card className="p-4 flex flex-col items-center shadow-sm">
            <ShoppingCart className="text-primary h-12 w-12 mb-3" />
            <p className="font-medium text-gray-800">E-commerce</p>
          </Card>
        </div>
      </section>

      <section className="text-center mb-16">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">
          Your Feedback Matters!
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
          We are constantly striving to improve and evolve Inventory Solutions. We welcome your thoughts and suggestions! Feel free to share your feedback through the contact form at the bottom of our main page.
        </p>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          What's Next for Inventory Solutions?
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
          We're excited about the future! Our next version is being built with a focus on a more robust architecture using Turborepo and an even stronger tech stack, ensuring a seamless and efficient workflow.
        </p>
        <Button asChild className="px-8 py-3 text-lg">
          <a href="/new-version-under-dev" target="_blank" rel="noopener noreferrer">
            Explore the Next Version (Coming Soon!)
          </a>
        </Button>
      </section>
    </div>
  );
};

export default HowItWorksPage;