import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteOrder, fetchUserOrders } from "../../features/orderSlice";
import Navbar from "../../components/Navbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import html2pdf from "html2pdf.js";
import { FaTrashAlt } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";

const OrderTable = () => {
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const handleDelete = (id) => {
    dispatch(deleteOrder(id));
  };
  const totalPayable = orders?.reduce(
    (acc, order) => acc + order.totalAmount,
    0
  );
  const handleDownloadPDF = (order) => {
    const { name, email } = order.userId || {};
    const { contact, address } = order.deliveryAddress || {};
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      order.paymentInfo || {};

    const productList = order.items
      .map((item) => {
        const title = item?.productId?.title || "Unnamed Product";
        const quantity = item.quantity;
        return `<tr>
          <td style="padding: 8px; border: 1px solid #dee2e6;">${title}</td>
          <td style="padding: 8px; border: 1px solid #dee2e6; text-align: center;">${quantity}</td>
        </tr>`;
      })
      .join("");

    const htmlContent = `
      <div style="font-family: 'Helvetica', sans-serif; padding: 20px; width: 650px; margin: auto; font-size: 14px; color: #212529;">
        <div style="text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          <h2 style="margin: 0; color: #007bff;">Alcroz</h2>
          <p style="margin: 0; font-size: 12px;">Premium Shopping Experience</p>
        </div>
  
        <div style="margin-top: 20px;">
          <h4 style="color: #343a40;">Order Receipt</h4>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Date:</strong> ${new Date(
            order.orderDate
          ).toLocaleDateString()}</p>
        </div>
  
        <div style="margin-top: 15px;">
          <h5 style="color: #343a40;">Customer Info</h5>
          <p><strong>Name:</strong> ${name || "Guest"}</p>
          <p><strong>Email:</strong> ${email || "N/A"}</p>
        </div>
  
        <div style="margin-top: 15px;">
          <h5 style="color: #343a40;">Shipping Details</h5>
          <p>${contact?.name || ""}</p>
          <p> ${contact?.phoneNumber || ""}</p>
          <p>${address?.locality || ""},${address?.street || ""}, ${
      address?.city || ""
    }, ${address?.state || ""} - ${address?.pinCode || ""}</p>
          <p>${address?.country || "India"}</p>
        </div>
  
        <div style="margin-top: 15px;">
          <h5 style="color: #343a40;">Products Ordered</h5>
          <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 8px; border: 1px solid #dee2e6;">Product</th>
                <th style="padding: 8px; border: 1px solid #dee2e6;">Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${productList}
            </tbody>
          </table>
        </div>
  
        <div style="margin-top: 20px; text-align: right;">
          <h5 style="color: #28a745;">Total: ₹ ${order.totalAmount.toFixed(
            2
          )}</h5>
        </div>
  
        <div style="margin-top: 15px;">
          <h5 style="color: #343a40;">Payment Details</h5>
          <p><strong>Payment ID:</strong> ${razorpayPaymentId}</p>
        </div>
  
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #6c757d;">
          <p>Thank you for shopping with <strong>Alcroz</strong>!</p>
          <p>Visit us again at <a href="https://ecommerce-app-frontend-phi.vercel.app" style="color: #007bff; text-decoration: none;">www.alcroz.com</a></p>
        </div>
      </div>
    `;

    const options = {
      margin: 0.2,
      filename: `Alcroz-Order-${order._id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(htmlContent).set(options).save();
  };

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  return (
    <div className="container py-4">
      <Navbar />

      <div className="py-2">
        <h2>Order List</h2>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Products</th>
              <th>Quantities</th>
              <th>Total Amount</th>
              <th>Order Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.items
                    .map((item) => item?.productId?.title || "Unnamed Product")
                    .join(", ")}
                </td>
                <td>{order.items.map((item) => item.quantity).join(", ")}</td>
                <td>₹ {order.totalAmount.toFixed(2)}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => handleDelete(order._id)}
                    title="Delete Order"
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    className="btn btn-success btn-sm ms-2"
                    onClick={() => handleDownloadPDF(order)}
                    title="Download PDF Receipt"
                  >
                    <FaFilePdf />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-end mt-3 fs-5 fw-bold">
        Total Paid:{" "}
        <span className="text-success">₹ {totalPayable.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderTable;
