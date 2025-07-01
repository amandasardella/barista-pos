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
      <div>
        <p>{label}:</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleClick(opt)}
              style={{
                border: selected === opt ? "2px solid blue" : "1px solid gray",
                backgroundColor: selected === opt ? "#cce4ff" : "white",
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: "4px",
              }}
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
      <h2>Register Order</h2>

      <div style={{ marginBottom: "12px" }}>
        <button type="button" onClick={() => handleTabChange("coffee")}>
          Hot Espresso Beverages
        </button>
        <button type="button" onClick={() => handleTabChange("teaLatte")}>
          Tea Lattes
        </button>
        <button type="button" onClick={() => handleTabChange("teas")}>
          Brewed Teas
        </button>
        <button type="button" onClick={() => handleTabChange("iced")}>
          Iced Beverages
        </button>
        <button type="button" onClick={() => setActiveTab("totalOrders")}>
          Total Orders
        </button>
      </div>

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

            <label style={{ display: "block", marginTop: "12px" }}>
              <input
                type="checkbox"
                checked={decaf}
                onChange={(e) => setDecaf(e.target.checked)}
              />{" "}
              Decaf
            </label>

            <label style={{ display: "block", marginTop: "12px" }}>
              <input
                type="checkbox"
                checked={extraShot}
                onChange={(e) => setExtraShot(e.target.checked)}
              />{" "}
              Extra Espresso Shot
            </label>

            <button
              type="submit"
              style={{ marginTop: "12px", padding: "8px 16px", cursor: "pointer" }}
            >
              Submit Order
            </button>
          </form>

          <div style={{ marginTop: "12px" }}>
            <button
              type="button"
              onClick={repeatLastOrder}
              style={{ marginRight: "8px", padding: "8px 16px", cursor: "pointer" }}
            >
              Repeat Last Order
            </button>
            <button
              type="button"
              onClick={deleteLastOrder}
              style={{ padding: "8px 16px", cursor: "pointer" }}
            >
              Delete Last Order
            </button>
          </div>
        </>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}
