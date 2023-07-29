import React, { useEffect, useState } from "react";
import { Modal } from "flowbite";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const DataList = ({ data, tarjeta, efectivo, getData, deleteAll }) => {
  const [modalOptions, setModalOptions] = useState({
    backdrop: "dynamic",
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
  });
  const [detailsModal, setDetailsModal] = useState(null);
  const [editsModal, setEditsModal] = useState(null);
  const [details, setDetails] = useState([]);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [invalidPayment, setInvalidPayment] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [invalidCurrency, setInvalidCurrency] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Event handler for updating the viewport width on resize
  const handleResize = () => {
    setViewportHeight(window.innerHeight);
  };

  const deleteData = async (index, docId) => {
    if (window.confirm("¿Está seguro que desea borrar este registro?")) {
      // let btn = document.getElementById("delete-" + index);
      // btn.innerText = "Borrando...";
      console.log("docId", docId);
      setDeleting(true);
      await deleteDoc(doc(db, "caja", docId));
      getData();
      // btn.innerText = "Borrar";
      setDeleting(false);
    }
  };
  const showEditsModal = (data) => {
    setDetails(data);
    editsModal.show();
  };

  const showDetailsModal = (data) => {
    setDetails(data);
    detailsModal.show();
  };

  const hideDetailsModal = () => {
    detailsModal.hide();
    let btn = document.getElementById("detailsModal");
    btn.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("name", name);
    console.log("value", value);
    setDetails((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    validateForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("details", details);
    if (details.payment && details.amount && details.currency) {
      try {
        const docRef = doc(db, "caja", details.id);

        // Set the "capital" field of the city 'DC'
        await updateDoc(docRef, details);
        getData();
        hideEditsModal();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      console.log("Please fill out all fields.");
      validateForm();
    }
  };

  const validateForm = () => {
    !details.payment ? setInvalidPayment(true) : setInvalidPayment(false);
    !details.amount ? setInvalidAmount(true) : setInvalidAmount(false);
    !details.currency ? setInvalidCurrency(true) : setInvalidCurrency(false);
  };

  const hideEditsModal = () => {
    editsModal.hide();
    let btn = document.getElementById("editsModal");
    btn.click();
  };

  useEffect(() => {
    setDetailsModal(new Modal(document.getElementById("detailsModal"), modalOptions));
    setEditsModal(new Modal(document.getElementById("editsModal"), modalOptions));
    // Add event listener when the component mounts
    window.addEventListener("resize", handleResize);

    // Remove event listener when the component unmounts to avoid memory leaks
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="relative overflow-x-auto border-t" style={{ height: viewportHeight - (89 + 114) }}>
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-sm text-black uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">
                Pago
              </th>
              <th scope="col" className="px-6 py-3">
                Monto
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((data, index) => (
              <tr key={index} className={` border-b  ${data.payment === "tarjeta" ? "bg-white" : "bg-green-100 border-b-white"}`}>
                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                  <span className="capitalize">{data.payment}</span>
                </th>
                <td className="px-6 py-4">₡{Intl.NumberFormat("en-US").format(data.amount)}</td>
                <td className="px-6 py-4 text-right">
                  <button data-modal-target="detailsModal" className=" hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2 py-2.5 text-center mr-2 mb-2 w-24 bg-white" onClick={() => showDetailsModal(data)}>
                    Detalles
                  </button>
                  <button data-modal-target="detailsModal" className=" text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-24 bg-white" onClick={() => showEditsModal(data)}>
                    Editar
                  </button>
                  <button id={"delete-" + index} data-modal-target="detailsModal" className=" text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2.5 text-center mr-2 w-24 bg-white" onClick={() => deleteData(index, data.id)} disabled={deleting}>
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div id="detailsModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div className="relative w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-start justify-between p-4 border-b rounded-t">
                <h3 className="text-xl font-semibold">Detalles de la orden</h3>
                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover: rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="detailsModal" onClick={hideDetailsModal}>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <p className="text-base leading-relaxed text-gray-500 capi">
                  Tipo de pago: <span className="capitalize">{details.payment}</span>
                </p>
                <p className="text-base leading-relaxed text-gray-500">Monto: ₡{Intl.NumberFormat("en-US").format(details.amount)}</p>
                <p className="text-base leading-relaxed text-gray-500">Notas: {details.notes ? details.notes : "Ninguna"}</p>
                <p className="text-base leading-relaxed text-gray-500">Hora de la compra: {details.time}</p>
              </div>
            </div>
          </div>
        </div>
        <div id="editsModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <button id="close-form-modal" type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="editsModal" onClick={hideEditsModal}>
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
                    <select id="payment" name="payment" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" value={details.payment} onChange={handleChange}>
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
                    <input type="number" id="amount" name="amount" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" placeholder="Monto" value={details.amount} onChange={handleChange} />
                    {invalidAmount && (
                      <div id="currency-error" className="px-2 py-2 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 " role="alert">
                        <span className="font-medium">*</span> Monto requerido!
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <div className="flex gap-5">
                      <div className="flex items-center">
                        <input id="currency-1" type="radio" name="currency" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" value="colones" onClick={handleChange} onChange={handleChange} checked={details.currency === "colones"} />
                        <label htmlFor="currency-1" className="ml-2 text-sm font-medium text-gray-900">
                          Colones
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input id="currency-2" type="radio" name="currency" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" value="dolares" onClick={handleChange} onChange={handleChange} checked={details.currency === "dolares"} />
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
                    <textarea id="notes" name="notes" rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring focus:ring-indigo-200" placeholder="Alguna nota especial para esta orden..." value={details.notes} onChange={handleChange}></textarea>
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
      </div>

      <table className="w-full text-md text-left bg-slate-900 text-white absolute left-0 right-0 bottom-0">
        <tbody>
          <tr className="bg-slate-100 text-white border-t">
            <td colSpan={2} className="px-6 py-4 text-center">
              <button id="open-form-modal" data-modal-target="formModal" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 border-b" type="button" onClick={deleteAll}>
                Borrar Todo
              </button>
            </td>
          </tr>
          <tr className="bg-slate-900 text-white border-t">
            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
              <span className="capitalize">Total en Tarjeta:</span>
            </th>
            <td className="px-6 py-4">₡{Intl.NumberFormat("en-US").format(tarjeta)}</td>
          </tr>
          <tr className="border-t">
            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
              <span className="capitalize">Total en Efectivo:</span>
            </th>
            <td className="px-6 py-4">₡{Intl.NumberFormat("en-US").format(efectivo)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default DataList;
