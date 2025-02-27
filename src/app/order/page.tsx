"use client";
import { constants } from "@/app/_constants/constants";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Select, Modal, Table, TableColumnType } from "antd";
import { useFetchData } from "../_components/hooks/useFetchData";
import { CustomerOrder, OrderData, Product } from "./types";
import { useState } from "react";
import axiosInstance from "../_components/utils/axiosInstance";
import { usePostData } from "../_components/hooks/useMutationData";
import { mutate } from "swr";
export default function Order() {
  const { isMutating, mutatePost } = usePostData(constants.order);

  const { data: customerData } = useFetchData<CustomerOrder[]>(
    constants.customer
  );
  const [selectedValue, setSelectedValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("data", customerData);
  const [orderId, setOrderId] = useState(0);
  const columns: TableColumnType<CustomerOrder>[] = [
    { title: "First Name", dataIndex: "first_name", key: "first_name" },
    { title: "Last Name", dataIndex: "last_name", key: "last_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "City", dataIndex: "city", key: "city" },
  ];
  const isHandleOk = async () => {
    await mutatePost({
      data: { id: orderId, status: selectedValue } as never,
      method: "PATCH",
    } as never);
    setIsModalOpen(false);
    setSelectedValue("");
    mutate(constants.customer);
  };
  const isHandleCancel = () => {
    setIsModalOpen(false);
    setSelectedValue("");
  };
  const showSliderModal = (record: OrderData) => {
    setSelectedValue(record.status);
    setOrderId(record.id);
    setIsModalOpen(true);
  };
  const expandableColumn: TableColumnType<OrderData>[] = [
    { title: "Order Date", dataIndex: "order_date", key: "order_date" },
    { title: "Total Amount", dataIndex: "total_amount", key: "total_amount" },
    { title: "Order Status", dataIndex: "status", key: "order_status" },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <div className="flex gap-3">
          <Button
            icon={<PlusOutlined />}
            onClick={() => showSliderModal(record)}
          >
            Edit Order Status
          </Button>
        </div>
      ),
    },
  ];

  const nestedExpandedColumn: TableColumnType<Product>[] = [
    { title: "Product Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) => record.OrderProduct.quantity,
    },
  ];

  const nestedExpandedRowRender = (record: OrderData) => (
    <Table
      columns={nestedExpandedColumn}
      dataSource={record.product}
      pagination={false}
      rowKey={(record) => record.id}
    />
  );

  const expandedRowRender = (record: CustomerOrder) => (
    <Table
      columns={expandableColumn}
      expandable={{
        expandedRowRender: nestedExpandedRowRender,
      }}
      dataSource={record.order}
      pagination={false}
      rowKey={(record) => record.id}
    />
  );
  const onChange = (value: string) => {
    setSelectedValue(value);
  };
  const onSubmitHandler = () => {};
  console.log("selected value", selectedValue);
  return (
    <div>
      <h1 className="text-3xl font-bold ">Order</h1>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender,
        }}
        dataSource={customerData}
        rowKey={(record) => record.id}
      />
      <Modal
        title="Edit Order Status"
        open={isModalOpen}
        onOk={isHandleOk}
        onCancel={isHandleCancel}
      >
        <Select
          style={{ width: 300 }}
          placeholder="Select Order Status"
          value={selectedValue}
          onChange={onChange}
          options={[
            { value: "", label: "Select Order Status " },
            { value: "pending", label: "pending" },
            { value: "cancelled", label: "cancelled" },
            { value: "shipped", label: "shipped" },
            { value: "completed", label: "completed" },
          ]}
        />
      </Modal>
    </div>
  );
}
