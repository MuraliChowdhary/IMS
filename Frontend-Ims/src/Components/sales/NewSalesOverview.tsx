import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";
import { NavBar } from "../sales/NavBar";

const NewSalesOverview = () => {
  interface FormattedData {
    date: string;
    amount: number;
  }

  const [data, setData] = useState<FormattedData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          "https://ims-clxd.onrender.com/api/sales/overview",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        interface SalesEntry {
          createdAt: string;
          _sum: {
            total: number;
          };
        }

        const salesTrend: SalesEntry[] = response.data.salesTrend;

        const formattedData: FormattedData[] = salesTrend.map((entry) => ({
          date: new Date(entry.createdAt).toLocaleDateString(),
          amount: entry._sum.total,
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="w-full md:w-1/5 bg-white shadow-md p-4">
        <NavBar />
      </div>

      <div className="flex flex-col flex-grow items-center justify-center p-4 w-full md:w-4/5">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="text-blue-600" size={30} />
              <h2 className="text-xl font-bold">Sales Overview</h2>
            </div>
            <div className="flex items-center space-x-2 mt-3 md:mt-0">
              <button className="flex items-center text-sm text-gray-500 hover:text-blue-600">
                <Calendar size={16} className="mr-1" />
                <span>2025</span>
              </button>
              <button className="flex items-center text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                <TrendingUp size={16} className="mr-1" />
                <span>Daily</span>
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading sales data...</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data}
                margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
              >
                <YAxis
                  tick={{ fill: "#888" }}
                  tickFormatter={(value) => `$${value}`}
                />
                <XAxis dataKey="date" tick={{ fill: "#888" }} />
                <Tooltip
                  formatter={(value) => [`$${value}`, "Sales"]}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  dataKey="amount"
                  fill="#2bf801"
                  barSize={30}
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewSalesOverview;
