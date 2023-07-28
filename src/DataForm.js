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
    id: "",
    payment: "",
    amount: "",
    currency: "",
    time: "",
    notes: "",
  });
  const modal = new Modal($targetEl, options);
  const [data, setData] = useState([]);
  const [invalidPayment, setInvalidPayment] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [invalidCurrency, setInvalidCurrency] = useState(false);
  const [totalTarjeta, setTotalTarjeta] = useState(0);
  const [totalEfectivo, setTotalEfectivo] = useState(0);
  const [saving, setSaving] = useState(false);

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "caja"));
    const array = [];
    querySnapshot.forEach((data) => {
      // console.log(`${data.id} => ${data.data()}`);
      array.push({ id: data.id, ...data.data() });
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
    setTotalTarjeta(totalT);
    setTotalEfectivo(totalE);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    validateForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
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
        setSaving(false);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      console.log("Please fill out all fields.");
      validateForm();
    }
  };

  const hideModal = () => {
    modal.hide();
    let btn = document.getElementById("formModal");
    btn.click();
  };

  const showModal = () => {
    modal.show();
  };

  const validateForm = () => {
    !formData.payment ? setInvalidPayment(true) : setInvalidPayment(false);
    !formData.amount ? setInvalidAmount(true) : setInvalidAmount(false);
    !formData.currency ? setInvalidCurrency(true) : setInvalidCurrency(false);
  };

  useEffect(() => {
    getData();
    // setInterval(() => {
    //   setTime(new Date().toLocaleTimeString());
    // }, 1000);
  }, []);

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
                  {!saving ? (
                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                      Salvar
                    </button>
                  ) : (
                    <button disabled type="button" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center justify-center">
                      <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                      </svg>
                      Salvando...
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {data.length > 0 ? <DataList data={data} tarjeta={totalTarjeta} efectivo={totalEfectivo} getData={getData} /> : <p className="p-4 text-center">No hay datos</p>}
    </>
  );
};

export default DataForm;
