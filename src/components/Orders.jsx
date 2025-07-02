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
  const [message, setMessage] = useState("");
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
      const res = await api.post("/", { drink, milk, syrup, decaf, extraShot });
      setMessage("Order successfully created!");
      setLastOrderId(res.data._id);
      // Reset form
      switch (activeTab) {
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
      setDecaf(false);
      setExtraShot(false);
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.error || err.message));
    }
  }

  async function repeatLastOrder() {
    try {
      const res = await api.get("/last-order");
      const lastOrder = res.data;

      let newActiveTab = "coffee";
      if (teaLattes.includes(lastOrder.drink)) {
        newActiveTab = "teaLatte";
      } else if (teas.includes(lastOrder.drink)) {
        newActiveTab = "teas";
      } else if (icedDrinks.includes(lastOrder.drink)) {
        newActiveTab = "iced";
      }

      setActiveTab(newActiveTab);
      setDrink(lastOrder.drink);
      setMilk(lastOrder.milk);
      setSyrup(lastOrder.syrup);
      setDecaf(lastOrder.decaf || false);
      setExtraShot(lastOrder.extraShot || false);
      setMessage("Last order loaded into form.");
      setLastOrderId(lastOrder._id);
    } catch (err) {
      if (err.response?.status === 404) {
        setMessage("No previous orders found.");
      } else {
        setMessage("Error loading last order: " + err.message);
      }
    }
  }

  async function deleteLastOrder() {
    if (!lastOrderId) {
      setMessage("No order to delete.");
      return;
    }
    try {
      await api.delete(`/${lastOrderId}`);
      setMessage("Last order deleted.");
      setLastOrderId(null);
      setDrink(coffeeDrinks[0]);
      setMilk(null);
      setSyrup(null);
      setDecaf(false);
      setExtraShot(false);
    } catch (err) {
      setMessage("Error deleting last order: " + err.message);
    }
  }

  let drinksList;
  switch (activeTab) {
    case "coffee":
      drinksList = coffeeDrinks;
      break;
    case "teaLatte":
      drinksList = teaLattes;
      break;
    case "teas":
      drinksList = teas;
      break;
    case "iced":
      drinksList = icedDrinks;
      break;
    default:
      drinksList = coffeeDrinks;
  }

  function RenderOptions({ options, selected, setSelected, label }) {
    function handleClick(option) {
      if (selected === option) {
        setSelected(null);
      } else {
        setSelected(option);
      }
    }

    return (
      <div className="mb-4">
        <p className="font-medium mb-2">{label}:</p>
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleClick(opt)}
              className={`px-3 py-1 rounded border cursor-pointer
            ${
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
    <div>
      <h2 className="text-2xl font-semibold mb-4">Register Order</h2>

      <nav className="flex flex-wrap gap-3 mb-6">
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
            className={`px-4 py-2 rounded-md font-medium transition 
          ${
            activeTab === key
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-blue-100"
          }
          cursor-pointer`}
          >
            {label}
          </button>
        ))}
      </nav>

      {activeTab === "totalOrders" ? (
        <TotalOrders />
      ) : (
        <>
          <form onSubmit={handleSubmit}>
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

            <label className="block mt-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={decaf}
                onChange={(e) => setDecaf(e.target.checked)}
                className="mr-2 w-4 h-4 rounded border-gray-300 focus:ring- focus:ring-blue-500"
              />
              Decaf
            </label>

            <label className="block mt-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={extraShot}
                onChange={(e) => setExtraShot(e.target.checked)}
                className="mr-2 w-4 h-4 rounded border-gray-300 focus:ring-1 focus:ring-blue-500"
              />
              Extra Espresso Shot
            </label>

            <div className="flex items-center justify-between mt-4">
  <button
    type="submit"
    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors cursor-pointer"
  >
    Submit Order
  </button>

  <div>
    <button
      type="button"
      onClick={repeatLastOrder}
      className="mr-2 px-4 py-2 bg-green-200 hover:bg-green-300 rounded cursor-pointer"
    >
      Repeat Last Order
    </button>
    <button
      type="button"
      onClick={deleteLastOrder}
      className="px-4 py-2 bg-green-200 hover:bg-green-300 rounded cursor-pointer"
    >
      Delete Last Order
    </button>
  </div>
</div>

          </form>
        </>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}
