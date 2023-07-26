import React, { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import DataList from "./DataList";

const DataForm = () => {
  const [formData, setFormData] = useState({
    payment: "",
    amount: "",
    time: "",
    notes: "",
  });
  const [data, setData] = useState([]);
  // const [payment, setPayment] = useState("");
  // const [amount, setAmount] = useState("");
  const [time, setTime] = useState("");
  const [disabled, setDisabled] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.payment && formData.amount) {
      console.log("Form submitted successfully!");
      try {
        const docRef = await addDoc(collection(db, "caja"), {
          payment: formData.payment,
          amount: formData.amount,
          time: time,
          notes: formData.notes,
        });
        console.log("Document written with ID: ", docRef.id);
        setFormData({
          payment: "",
          amount: "",
          time: "",
          notes: "",
        }); // Clear form
        setDisabled(true);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      console.log("Please fill out all fields.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    if (formData.payment && formData.amount) {
      setDisabled(false);
    }
  };

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "caja"));
    const array = [];
    querySnapshot.forEach((data) => {
      // console.log("doc...", data.data());
      console.log(`${data.id} => ${data.data()}`);
      array.push(data.data());
    });
    console.log("array...", array);
    setData(array);
    console.log("dbData...", data);
  };

  useEffect(() => {
    getData();
    setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="payment">
            Tipo de pago:
          </label>
          <select id="payment" name="payment" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" value={formData.payment} onChange={handleChange}>
            <option>Seleccione el tipo de pago</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="efectivo">Efectivo</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Monto:
          </label>
          <input type="text" id="amount" name="amount" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" placeholder="Monto" value={formData.amount} onChange={handleChange} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
            Hora:
          </label>
          <input type="text" id="time" name="time" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" placeholder="Hora" value={time} disabled />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
            Notas
          </label>
          <textarea id="notes" name="notes" rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring focus:ring-indigo-200" placeholder="Alguna nota en especial..." value={formData.notes} onChange={handleChange}></textarea>
        </div>
        <div className="flex justify-center">
          <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md focus:outline-none focus:ring focus:ring-indigo-200" disabled={disabled}>
            Agregar
          </button>
        </div>
      </form>
      <DataList data={data} />
    </div>
  );
};

export default DataForm;
