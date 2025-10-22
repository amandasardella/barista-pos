import React, { useState } from "react";
import api from "../../services/api";
import TotalOrders from "./TotalOrders";

const coffeeDrinks = [
  "Americano",
  "Cappuccino",
  "Espresso",
  "Latte",
  "Mocha",
].sort();
const teaLattes = [
  "Chai",
  "English Breakfast Tea Latte",
  "London Fog",
  "Matcha",
  "Syrup Cream",
  "Hot Chocolate",
].sort();
const teas = ["Berry", "Breakfast", "Earl Grey", "Jasmine", "Mint"].sort();
const icedDrinks = [
  "Iced Americano",
  "Iced Chai",
  "Iced Latte",
  "Iced Matcha",
  "Iced Mocha",
  "Iced Syrup Cream",
].sort();
const milks = ["2%", "Oat", "Lactose Free"];
const syrups = [
  "Vanilla",
  "Hazelnut",
  "Caramel",
  "Sugar Cane",
  "Sugar-Free Vanilla",
  "Sugar-Free Hazelnut",
  "Chai",
];

export default function Orders() {
  const [activeTab, setActiveTab] = useState("coffee");
  const [drink, setDrink] = useState(coffeeDrinks[0]);
  const [milk, setMilk] = useState(null);
  const [syrup, setSyrup] = useState(null);
  const [decaf, setDecaf] = useState(false);
  const [extraShot, setExtraShot] = useState(false);
  const [message, setMessage] = useState(" ");
  const [lastOrderId, setLastOrderId] = useState(null);

  function handleTabChange(tab) {
    setActiveTab(tab);
    setDecaf(false);
    setExtraShot(false);
    setMessage("");
    switch (tab) {
      case "coffee":
        setDrink(coffeeDrinks[0]);
        break;
      case "teaLatte":
        setDrink(teaLattes[0]);
        break;
      case "teas":
        setDrink(teas[0]);
        break;
      case "iced":
        setDrink(icedDrinks[0]);
        break;
      default:
        setDrink(coffeeDrinks[0]);
    }
    setMilk(null);
    setSyrup(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/orders", {
        drink,
        milk,
        syrup,
        decaf,
        extraShot,
      });
      setMessage("Order successfully created!");
      setLastOrderId(res.data._id);
      handleTabChange(activeTab);
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.error || err.message));
    }
  }

  async function repeatLastOrder() {
    try {
      const res = await api.get("/orders/last");
      const lastOrder = res.data;

      const newTab = teaLattes.includes(lastOrder.drink)
        ? "teaLatte"
        : teas.includes(lastOrder.drink)
        ? "teas"
        : icedDrinks.includes(lastOrder.drink)
        ? "iced"
        : "coffee";

      setActiveTab(newTab);
      setDrink(lastOrder.drink);
      setMilk(lastOrder.milk);
      setSyrup(lastOrder.syrup);
      setDecaf(!!lastOrder.decaf);
      setExtraShot(!!lastOrder.extraShot);
      setLastOrderId(lastOrder._id);

      const duplicate = await api.post("/orders", {
        drink: lastOrder.drink,
        milk: lastOrder.milk,
        syrup: lastOrder.syrup,
        decaf: lastOrder.decaf,
        extraShot: lastOrder.extraShot,
      });

      setMessage(
        `☕ Last order repeated successfully! (New ID: ${duplicate.data._id})`
      );
    } catch (err) {
      setMessage(
        err.response?.status === 404
          ? "ℹ️ No previous orders found."
          : "❌ Error repeating last order."
      );
    }
  }

  async function deleteLastOrder() {
    if (!lastOrderId) return setMessage("No order to delete.");
    try {
      await api.delete(`/${lastOrderId}`);
      setMessage("Last order deleted.");
      setLastOrderId(null);
      handleTabChange(activeTab);
    } catch (err) {
      setMessage("Error deleting last order: " + err.message);
    }
  }

  const drinksList =
    {
      coffee: coffeeDrinks,
      teaLatte: teaLattes,
      teas: teas,
      iced: icedDrinks,
    }[activeTab] || coffeeDrinks;

  function RenderOptions({ options, selected, setSelected, label }) {
    return (
      <div className="mb-4">
        <p className="font-medium mb-2">{label}:</p>
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setSelected(selected === opt ? null : opt)}
              className={`px-3 py-1 rounded border text-sm cursor-pointer ${
                selected === opt
                  ? "bg-blue-200 border-blue-500"
                  : "bg-white border-gray-400"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto px-2 py-3">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
        Register Order
      </h1>

      <nav className="flex flex-wrap justify-center gap-3 mb-8">
        {[
          { key: "coffee", label: "Hot Espresso Beverages" },
          { key: "teaLatte", label: "Tea Lattes" },
          { key: "teas", label: "Brewed Teas" },
          { key: "iced", label: "Iced Beverages" },
          { key: "totalOrders", label: "Total Orders" },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              activeTab === key
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-blue-100"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {activeTab === "totalOrders" ? (
        <TotalOrders />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <RenderOptions
            label="Drink"
            options={drinksList}
            selected={drink}
            setSelected={setDrink}
          />
          <RenderOptions
            label="Milk"
            options={milks}
            selected={milk}
            setSelected={setMilk}
          />
          <RenderOptions
            label="Syrup"
            options={syrups}
            selected={syrup}
            setSelected={setSyrup}
          />

          {/* Options Section */}
          <div className="mb-4">
            <p className="font-medium mb-2">Options:</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDecaf(!decaf)}
                className={`px-3 py-1 rounded border text-sm cursor-pointer ${
                  decaf
                    ? "bg-blue-200 border-blue-500"
                    : "bg-white border-gray-400"
                }`}
              >
                Decaf
              </button>
              <button
                type="button"
                onClick={() => setExtraShot(!extraShot)}
                className={`px-3 py-1 rounded border text-sm cursor-pointer ${
                  extraShot
                    ? "bg-blue-200 border-blue-500"
                    : "bg-white border-gray-400"
                }`}
              >
                Extra Shot
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mt-6">
            {/* Botão Submit alinhado à direita */}
            <div className="w-full sm:w-auto order-2 sm:order-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
              >
                Submit Order
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-start order-1 sm:order-1">
              <button
                type="button"
                onClick={repeatLastOrder}
                className="px-4 py-2 bg-green-200 hover:bg-green-300 rounded w-full sm:w-auto"
              >
                Repeat Last Order
              </button>
              <button
                type="button"
                onClick={deleteLastOrder}
                className="px-4 py-2 bg-green-200 hover:bg-green-300 rounded w-full sm:w-auto"
              >
                Delete Last Order
              </button>
            </div>
          </div>
        </form>
      )}

      {message && (
        <p className="mt-4 text-center text-blue-700 font-medium">{message}</p>
      )}
    </div>
  );
}
