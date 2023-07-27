import React, { useEffect, useState } from "react";
import { Modal } from "flowbite";

const DataList = ({ data, tarjeta, efectivo }) => {
  const $targetEl = document.getElementById("detailsModal");
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
  const modal = new Modal($targetEl, options);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    console.log("data", data);
    console.log("tarjeta", tarjeta);
    console.log("efectivo", efectivo);
  });

  const showModal = (data) => {
    console.log("data", data);
    setDetails(data);
    console.log("details", details);
    modal.show();
  };

  const hideModal = () => {
    modal.hide();
    let btn = document.getElementById("detailsModal");
    btn.click();
  };
  return (
    <div className="p-4">
      <div className="relative overflow-x-auto max-h-96">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Pago
              </th>
              <th scope="col" className="px-6 py-3">
                Monto
              </th>
              {/* <th scope="col" className="px-6 py-3">
                Hora
              </th>
              <th scope="col" className="px-6 py-3">
                Notas
              </th> */}
              <th scope="col" className="px-6 py-3">
                Accion
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((data, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <span className="capitalize">{data.payment}</span>
                </th>
                <td className="px-6 py-4">₡{Intl.NumberFormat("en-US").format(data.amount)}</td>
                {/* <td className="px-6 py-4">{data.time}</td>
                <td className="px-6 py-4">{data.notes ? data.notes : "N/A"}</td> */}
                <td className="px-6 py-4">
                  <button data-modal-target="detailsModal" className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => showModal(data)}>
                    Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div id="detailsModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div className="relative w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Detalles de la orden</h3>
                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="detailsModal" onClick={hideModal}>
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
                <p className="text-base leading-relaxed text-gray-500">Notas: {details.notes ? details.note : "Ninguna"}</p>
                <p className="text-base leading-relaxed text-gray-500">Hora de la compra: {details.time}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-0">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 absolute bottom-0">
          <tbody>
            <tr class="bg-white border-t dark:bg-gray-900 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <span className="capitalize">Tarjeta</span>
              </th>
              <td className="px-6 py-4">₡{tarjeta}</td>
            </tr>
            <tr class="border-t bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <span className="capitalize">Efectivo</span>
              </th>
              <td className="px-6 py-4">₡{efectivo}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataList;
