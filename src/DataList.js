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
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  // Event handler for updating the viewport width on resize
  const handleResize = () => {
    setViewportHeight(window.innerHeight);
  };

  useEffect(() => {
    // Add event listener when the component mounts
    window.addEventListener("resize", handleResize);

    // Remove event listener when the component unmounts to avoid memory leaks
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    <>
      <div className="relative overflow-x-auto border-t" style={{ height: viewportHeight - (84 + 89 + 114) }}>
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-sm text-black uppercase bg-gray-100">
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
                {/* <td className="px-6 py-4">{data.time}</td>
        <td className="px-6 py-4">{data.notes ? data.notes : "N/A"}</td> */}
                <td className="px-6 py-4 text-right">
                  <button data-modal-target="detailsModal" className=" hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 bg-white" onClick={() => showModal(data)}>
                    Detalles
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
                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover: rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="detailsModal" onClick={hideModal}>
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

      <table className="w-full text-md text-left bg-slate-900 text-white absolute left-0 right-0 bottom-0">
        <tbody>
          <tr className="bg-slate-900 text-white border-t">
            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
              <span className="capitalize">Tarjeta</span>
            </th>
            <td className="px-6 py-4">₡{Intl.NumberFormat("en-US").format(tarjeta)}</td>
          </tr>
          <tr className="border-t">
            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
              <span className="capitalize">Efectivo</span>
            </th>
            <td className="px-6 py-4">₡{Intl.NumberFormat("en-US").format(efectivo)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default DataList;
