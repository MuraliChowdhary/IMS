import Sidebar from "./Sidebar";
import useFetch from "./useFetch";

interface InventoryProp {
  id: string;
  name: string;
  currentQuantity: number;
  threshold: number;
  reorderLevel: number;
  needsReorder: boolean;
  lastUpdated: string;
}

// {
//     "success": true,
//     "data": {
//         "items": [
//             {
//                 "id": "cm7byes410003v1d4axtveexc",
//                 "name": "Oneplus",
//                 "currentQuantity": 4,
//                 "threshold": 5,
//                 "reorderLevel": 10,
//                 "needsReorder": true,
//                 "lastUpdated": "2025-02-28T17:15:09.170Z"
//             }
//         ],
//         "summary": {
//             "totalLowStock": 1,
//             "needingReorder": 1,
//             "criticalItems": 0
//         }
//     }
// }
interface FetchResponse {
  data: {
    items: InventoryProp[];
    summary: Summary;
  };
}

interface Summary {
  totalLowStock: number;
  needingReorder: number;
  criticalItems: number;
}

// const { data = {} as FetchResponse, loading, error } = useFetch(
//   "https://ims-clxd.onrender.commanager/inventory"
// );

const Reorder = () => {
  const {
    data = {} as FetchResponse,
    loading,
    error,
  } = useFetch("https://ims-clxd.onrender.com/api/manager/lowstock");
  console.log(data);

  const reorderItem: InventoryProp[] = Array.isArray(data?.data.items)
    ? data.data.items
    : [];

  const summary: Summary[] = Array.isArray(data?.data.summary)
    ? data.data.summary
    : [];
  console.log(summary);
  console.log(reorderItem);

  if (loading) {
    return (
      <div className="flex justify-center h-screen flex-col items-center">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  if (error)
    return <p className="text-center text-red-500">Error loading inventory</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 ">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Inventory Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reorderItem.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-700">
                {item.name}
              </h3>

              <div className="mt-4">
                <p className="text-gray-700">
                  <span className="font-medium">Product ID:</span> {item.id}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">ReorderLevel:</span>{" "}
                  {item.reorderLevel}{" "}
                </p>
                <p className="text-sm  text-gray-700">
                  <span className="font-medium">Current Quantity:</span>
                  {item.currentQuantity}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">threshold:</span> $
                  {item.threshold}
                </p>
              </div>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Reorder Inventory
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reorder;
