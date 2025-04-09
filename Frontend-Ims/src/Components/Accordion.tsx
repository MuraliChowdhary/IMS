import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion"

export function InventoryAccordion() {
    return (
        <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
                {/* Stock Optimization */}
                <AccordionItem value="stock-optimization">
                    <AccordionTrigger className="text-lg font-medium">
                        Stock Level Optimization Alerts
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold mb-2">Low Stock</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>SKU-2049: Widget X (3 left, 15 needed)</li>
                                    <li>SKU-3072: Gizmo Y (5 left, 20 needed)</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Overstock</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>SKU-1055: Component Z (120 in stock, 40 needed)</li>
                                    <li>SKU-4088: Part A (85 in stock, 30 needed)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 rounded">
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">Recommendation:</span> 
                                Automate reorder points based on 30-day sales velocity.
                            </p>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Expiry Alerts */}
                <AccordionItem value="expiry-alerts">
                    <AccordionTrigger className="text-lg font-medium">
                        Expiry Date Monitoring
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2">
                        <div className="mb-4">
                            <h4 className="font-semibold mb-2">Items Expiring Soon (Next 30 Days)</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">SKU</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Expiry</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-3 py-2">SKU-5011</td>
                                            <td className="px-3 py-2">Battery Pack</td>
                                            <td className="px-3 py-2">45</td>
                                            <td className="px-3 py-2 text-red-600">2023-12-15</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-2">SKU-6022</td>
                                            <td className="px-3 py-2">Adhesive</td>
                                            <td className="px-3 py-2">32</td>
                                            <td className="px-3 py-2 text-red-600">2023-12-28</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="p-3 bg-amber-50 rounded">
                            <p className="text-sm text-amber-800">
                                <span className="font-semibold">Action Required:</span> 
                                Consider discounting or bundling expiring items.
                            </p>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Demand Forecasting */}
                <AccordionItem value="demand-forecasting">
                    <AccordionTrigger className="text-lg font-medium">
                        Demand Forecasting Insights
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2">
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Seasonal Demand Spikes</h4>
                                <p className="text-sm">
                                    Upcoming holiday season expected to increase demand by 35% for:
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>SKU-7033: Holiday Decorations</li>
                                    <li>SKU-8044: Gift Boxes</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Trending Products</h4>
                                <p className="text-sm">
                                    Social media trend increasing demand for:
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>SKU-9055: Eco-friendly Packaging (+120% last month)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-purple-50 rounded">
                            <p className="text-sm text-purple-800">
                                <span className="font-semibold">Suggestion:</span> 
                                Increase safety stock levels for trending items by 25%.
                            </p>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Warehouse Optimization */}
                <AccordionItem value="warehouse-optimization">
                    <AccordionTrigger className="text-lg font-medium">
                        Warehouse Efficiency
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold mb-2">Storage Utilization</h4>
                                <div className="h-4 w-full bg-gray-200 rounded-full mt-2">
                                    <div 
                                        className="h-4 bg-green-500 rounded-full" 
                                        style={{ width: '78%' }}
                                    ></div>
                                </div>
                                <p className="text-sm mt-1">78% capacity used</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Pick Path Efficiency</h4>
                                <div className="h-4 w-full bg-gray-200 rounded-full mt-2">
                                    <div 
                                        className="h-4 bg-blue-500 rounded-full" 
                                        style={{ width: '65%' }}
                                    ></div>
                                </div>
                                <p className="text-sm mt-1">65% optimal routing</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Suggested Reorganization</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Move high-velocity items (A1-A5) closer to packing stations</li>
                                <li>Combine slow-moving items in Zone D</li>
                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Supplier Performance */}
                <AccordionItem value="supplier-performance">
                    <AccordionTrigger className="text-lg font-medium">
                        Supplier Performance Metrics
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-2">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Supplier</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">On-Time %</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Quality %</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Rating</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-3 py-2">Acme Supplies</td>
                                        <td className="px-3 py-2">94%</td>
                                        <td className="px-3 py-2">98%</td>
                                        <td className="px-3 py-2 text-green-600 font-medium">Excellent</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2">Global Parts</td>
                                        <td className="px-3 py-2">82%</td>
                                        <td className="px-3 py-2">91%</td>
                                        <td className="px-3 py-2 text-amber-600 font-medium">Average</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2">Budget Materials</td>
                                        <td className="px-3 py-2">76%</td>
                                        <td className="px-3 py-2">85%</td>
                                        <td className="px-3 py-2 text-red-600 font-medium">Needs Improvement</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 p-3 bg-green-50 rounded">
                            <p className="text-sm text-green-800">
                                <span className="font-semibold">Recommendation:</span> 
                                Increase orders with Acme Supplies by 15% and negotiate with Global Parts for better terms.
                            </p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}