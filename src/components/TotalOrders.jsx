import React, { useState, useEffect } from "react";
import api from "../../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function TotalOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (selectedDate) {
      fetchOrdersByDate(selectedDate);
    }
  }, [selectedDate]);

  async function fetchOrdersByDate(dateStr) {
    setLoading(true);
    try {
      const res = await api.get(`/by-date?date=${dateStr}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  // Agora retorna count e latestDate (data do pedido mais recente)
  function countFullOrders(orders) {
    return orders.reduce((acc, order) => {
      const keyObj = {
        drink: order.drink || "",
        milk: order.milk || "",
        syrup: order.syrup || "",
        decaf: !!order.decaf,
        extraShot: !!order.extraShot,
      };

      const key = JSON.stringify(keyObj);
      const orderDate = new Date(order.date);

      if (!acc[key]) {
        acc[key] = { count: 0, latestDate: orderDate };
      }
      acc[key].count += 1;

      if (orderDate > acc[key].latestDate) {
        acc[key].latestDate = orderDate;
      }
      return acc;
    }, {});
  }

  const fullOrdersCount = countFullOrders(orders);

  function exportToExcel(orders) {
    const formatted = orders.map((order) => ({
      Drink: order.drink,
      Milk: order.milk || "",
      Syrup: order.syrup || "",
      Decaf: order.decaf ? "Yes" : "No",
      ExtraShot: order.extraShot ? "Yes" : "No",
      Date: new Date(order.date).toLocaleString("en-CA", {
        timeZone: "America/Toronto",
      }),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, `orders_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  return (
    <div className="max-w-6xl mx-auto p-4 w-full">
      <h3 className="text-xl font-semibold mb-4 text-center">Total Orders</h3>

      <div className="flex justify-center mb-4">
        <label className="block">
          <span className="mr-2">Select Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-3 py-1"
          />
        </label>
      </div>

      {loading ? (
        <p className="text-center">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center">No orders found for the selected date.</p>
      ) : (
        <>
          <p className="mb-2 text-center font-medium">Total: {orders.length}</p>
          <h4 className="font-semibold mb-4 text-center">Orders Summary:</h4>

          {/* Scrollable Table */}
          <div className="w-full overflow-x-auto rounded-md shadow border">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-2">Drink</th>
                  <th className="px-4 py-2">Milk</th>
                  <th className="px-4 py-2">Syrup</th>
                  <th className="px-4 py-2 text-center">Decaf</th>
                  <th className="px-4 py-2 text-center">Extra Shot</th>
                  <th className="px-4 py-2 text-right">Count</th>
                  <th className="px-4 py-2 text-right">Latest Order Date/Time</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(fullOrdersCount)
                  .sort((a, b) => b[1].count - a[1].count) // Ordena do maior para o menor count
                  .map(([desc, data]) => {
                    const obj = JSON.parse(desc);
                    return (
                      <tr key={desc} className="even:bg-gray-50">
                        <td className="px-4 py-2">{obj.drink}</td>
                        <td className="px-4 py-2">{obj.milk || "-"}</td>
                        <td className="px-4 py-2">{obj.syrup || "-"}</td>
                        <td className="text-center px-4 py-2">{obj.decaf ? "Yes" : "No"}</td>
                        <td className="text-center px-4 py-2">{obj.extraShot ? "Yes" : "No"}</td>
                        <td className="text-right px-4 py-2">{data.count}</td>
                        <td className="px-4 py-2 text-right">
                          {data.latestDate.toLocaleString("en-CA", {
                            timeZone: "America/Toronto",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => exportToExcel(orders)}
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Export to Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
