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

  function countByField(field) {
    return orders.reduce((acc, order) => {
      const key = order[field] ?? "None";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  const drinksCount = countByField("drink");
  const milksCount = countByField("milk");
  const syrupsCount = countByField("syrup");
  const decafCount = countByField("decaf");
  const extraShotCount = countByField("extraShot");

  function exportToExcel(orders) {
    const formatted = orders.map(order => ({
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
    <div>
      <h3>Total Orders</h3>

      <label>
        Select Date:{" "}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </label>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found for the selected date.</p>
      ) : (
        <>
          <p>Total: {orders.length}</p>

          <h4>By Drink:</h4>
          <ul>
            {Object.entries(drinksCount).map(([key, val]) => (
              <li key={key}>
                {key}: {val}
              </li>
            ))}
          </ul>

          <h4>By Milk:</h4>
          <ul>
            {Object.entries(milksCount).map(([key, val]) => (
              <li key={key}>
                {key}: {val}
              </li>
            ))}
          </ul>

          <h4>By Syrup:</h4>
          <ul>
            {Object.entries(syrupsCount).map(([key, val]) => (
              <li key={key}>
                {key}: {val}
              </li>
            ))}
          </ul>

          <h4>Decaf:</h4>
          <ul>
            {Object.entries(decafCount).map(([key, val]) => (
              <li key={key === "true" ? "Yes" : "No"}>
                {key === "true" ? "Yes" : "No"}: {val}
              </li>
            ))}
          </ul>

          <h4>Extra Espresso Shot:</h4>
          <ul>
            {Object.entries(extraShotCount).map(([key, val]) => (
              <li key={key === "true" ? "Yes" : "No"}>
                {key === "true" ? "Yes" : "No"}: {val}
              </li>
            ))}
          </ul>

          <button onClick={() => exportToExcel(orders)}>Export to Excel</button>
        </>
      )}
    </div>
  );
}
