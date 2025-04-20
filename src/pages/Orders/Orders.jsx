import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteOrder, fetchUserOrders } from "../../features/orderSlice";
import Navbar from "../../components/Navbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

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
                <td>$ {order.totalAmount.toFixed(2)}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(order._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-end mt-3 fs-5 fw-bold">
        Total Paid:{" "}
        <span className="text-success">$ {totalPayable.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderTable;
