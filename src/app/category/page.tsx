"use client";
import { Table } from "antd";
import type { TableProps } from "antd";
import { useFetchData } from "../_components/hooks/useFetchData";
import { constants } from "../_constants/constants";
import { Button, Modal, Input } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { usePostData } from "../_components/hooks/useMutationData";

export default function Category() {
  const { data: categoryData } = useFetchData(constants.category);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModal] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const { isMutating, mutatePost } = usePostData(constants.category);

  const addShowModal = () => {
    setCategory("");
    setCategoryId(null);
    setIsModalOpen(true);
  };
  const editShowModal = (record: any) => {
    setCategory(record.category_name);
    setCategoryId(record.id);
    setIsModalOpen(true);
  };
  const deleteShowModal = (record: any) => {
    setCategoryId(record.id);
    setIsDeleteModal(true);
  };

  const addHandleOk = () => {
    if (categoryId) {
      mutatePost({
        data: { id: categoryId, category_name: category },
        method: "PATCH",
      } as never);
    } else {
      mutatePost({ data: { category_name: category } } as never);
    }
    setIsModalOpen(false);
    setCategory("");
  };

  const addHandleCancel = () => {
    setIsModalOpen(false);
    setCategory("");
    setCategoryId(null);
  };

  const deleteHandleCancel = () => {
    setIsDeleteModal(false);
    setCategoryId(null);
  };

  const deleteHandleOk = () => {
    mutatePost({ data: { id: categoryId }, method: "DELETE" } as never);
    setCategoryId(null);
    setIsDeleteModal(false);
  };

  const columns: TableProps["columns"] = [
    {
      title: "Category Name",
      dataIndex: "category_name",
      key: "category_name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <div className="flex gap-3">
          <Button icon={<EditOutlined />} onClick={() => editShowModal(record)}>
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => deleteShowModal(record)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className=" text-3xl font-bold ">Category</h1>
        <Button
          type="default"
          icon={<PlusOutlined style={{ fontWeight: 700 }} />}
          className="font-bold  "
          onClick={addShowModal}
        >
          Add Category
        </Button>
      </div>
      <Modal
        title="Add/ Edit Category"
        open={isModalOpen}
        onOk={addHandleOk}
        onCancel={addHandleCancel}
      >
        <Input
          placeholder="category name"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </Modal>
      <Modal
        title="DeleteCategory"
        open={isDeleteModalOpen}
        onOk={deleteHandleOk}
        onCancel={deleteHandleCancel}
      >
        <p>Are you sure want to delete category</p>
      </Modal>
      <section>
        <Table columns={columns} dataSource={categoryData as never} />
      </section>
    </div>
  );
}
