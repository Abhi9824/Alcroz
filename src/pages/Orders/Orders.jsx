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
    <div className="container py-4 ">
      <Navbar />

      <div className="py-2">
        <h2>Order List</h2>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Order Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) =>
              order?.items?.map((item, index) => (
                <tr key={`${order?._id}-${index}`}>
                  <td>{order?._id}</td>
                  <td>{item.productId.title}</td>
                  <td>{item.quantity}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(order?._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-end mt-3 fs-5 fw-bold">
        Total Payable:{" "}
        <span className="text-success">${totalPayable.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderTable;
