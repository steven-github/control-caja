import React, { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import DataList from "./DataList";
import { Modal } from "flowbite";

const DataForm = () => {
  // set the modal menu element
  const $targetEl = document.getElementById("formModal");

  // options with default values
  const options = {
    // placement: "bottom-right",
    backdrop: "dynamic",
    // backdropClasses: "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40",
    closable: true,
    onHide: () => {
      console.log("modal is hidden");
    },
    onShow: () => {
      console.log("modal is shown");
    },
    onToggle: () => {
      console.log("modal has been toggled");
    },
  };
  const [formData, setFormData] = useState({
    payment: "",
    amount: "",
    currency: "",
    time: "",
    notes: "",
  });
  const [data, setData] = useState([]);
  const [invalidPayment, setInvalidPayment] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [invalidCurrency, setInvalidCurrency] = useState(false);
  const modal = new Modal($targetEl, options);
  const [totalTarjeta, setTotalTarjeta] = useState(0);
  const [totalEfectivo, setTotalEfectivo] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.payment && formData.amount && formData.currency) {
      try {
        const time = new Date().toLocaleTimeString();
        const docRef = await addDoc(collection(db, "caja"), {
          payment: formData.payment,
          amount: formData.amount,
          currency: formData.currency,
          time: time,
          notes: formData.notes,
        });
        console.log("Document written with ID: ", docRef.id);
        getData();
        hideModal();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      console.log("Please fill out all fields.");
      validateForm();
    }
  };

  const validateForm = () => {
    !formData.payment ? setInvalidPayment(true) : setInvalidPayment(false);
    !formData.amount ? setInvalidAmount(true) : setInvalidAmount(false);
    !formData.currency ? setInvalidCurrency(true) : setInvalidCurrency(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    validateForm();
  };

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "caja"));
    const array = [];
    querySnapshot.forEach((data) => {
      // console.log("doc...", data.data());
      console.log(`${data.id} => ${data.data()}`);
      array.push(data.data());
    });
    setData(array);
    console.log("array...", array);
    setTotalTarjeta(0);
    setTotalEfectivo(0);
    let totalT = 0;
    let totalE = 0;
    array.forEach((data) => {
      if (data.payment === "tarjeta") {
        totalT = totalT + parseInt(data.amount);
      } else {
        totalE = totalE + parseInt(data.amount);
      }
    });
    console.log("totalT...", totalT);
    console.log("totalE...", totalE);
    setTotalTarjeta(totalT);
    setTotalEfectivo(totalE);
  };

  useEffect(() => {
    console.log("useEffect...");
    getData();
    // setInterval(() => {
    //   setTime(new Date().toLocaleTimeString());
    // }, 1000);
  }, []);

  const hideModal = () => {
    modal.hide();
    let btn = document.getElementById("formModal");
    btn.click();
  };

  const showModal = () => {
    modal.show();
  };

  return (
    <>
      <div className="flex items-center justify-center p-6">
        <button id="open-form-modal" data-modal-target="formModal" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 border-b" type="button" onClick={showModal}>
          Agregar Registro
        </button>
      </div>
      <div id="formModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className="relative w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <button id="close-form-modal" type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="formModal" onClick={hideModal}>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="px-6 py-6 lg:px-8">
              <h3 className="mb-4 text-xl font-medium text-gray-900">Registrar nueva orden</h3>
              <form onSubmit={handleSubmit} className="space-y-6 mb-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="payment">
                    Tipo de pago:
                  </label>
                  <select id="payment" name="payment" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" value={formData.payment} onChange={handleChange}>
                    <option>Seleccione el tipo de pago</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                  {invalidPayment && (
                    <div id="payment-error" className="px-2 py-2 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 " role="alert">
                      <span className="font-medium">*</span> Tipo de pago requerido!
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                    Monto:
                  </label>
                  <input type="number" id="amount" name="amount" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" placeholder="Monto" value={formData.amount} onChange={handleChange} />
                  {invalidAmount && (
                    <div id="currency-error" className="px-2 py-2 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 " role="alert">
                      <span className="font-medium">*</span> Monto requerido!
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <div className="flex gap-5">
                    <div className="flex items-center">
                      <input id="currency-1" type="radio" name="currency" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" value="colones" onClick={handleChange} />
                      <label htmlFor="currency-1" className="ml-2 text-sm font-medium text-gray-900">
                        Colones
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input id="currency-2" type="radio" name="currency" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" value="dolares" onClick={handleChange} />
                      <label htmlFor="currency-2" className="ml-2 text-sm font-medium text-gray-900">
                        Dolares
                      </label>
                    </div>
                  </div>
                  {invalidCurrency && (
                    <div id="currency-error" className="px-2 py-2 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 " role="alert">
                      <span className="font-medium">*</span> Moneda requerida!
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                    Notas:
                  </label>
                  <textarea id="notes" name="notes" rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring focus:ring-indigo-200" placeholder="Alguna nota especial para esta orden..." value={formData.notes} onChange={handleChange}></textarea>
                </div>
                {/* <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
                    Hora: {time}
                  </label>
                  <input type="hidden" id="time" name="time" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" placeholder="Hora" value={time} />
                </div> */}
                <div className="flex justify-center">
                  <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {data.length > 0 ? <DataList data={data} tarjeta={totalTarjeta} efectivo={totalEfectivo} /> : <p className="p-4 text-center">No hay datos</p>}
    </>
  );
};

export default DataForm;
