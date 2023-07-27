import React, { useEffect } from "react";
import { Modal } from "flowbite";

const DataList = ({ data }) => {
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

  useEffect(() => {});

  const showModal = (e) => {
    modal.show();
  };

  const hideModal = () => {
    modal.hide();
    let btn = document.getElementById("formModal");
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
                Cantidad
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
                  <button data-modal-target="detailsModal" className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={showModal}>
                    Editar
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
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Terms of Service</h3>
                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="detailsModal" onClick={hideModal}>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.</p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.</p>
              </div>

              <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button data-modal-hide="detailsModal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  I accept
                </button>
                <button data-modal-hide="detailsModal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataList;
