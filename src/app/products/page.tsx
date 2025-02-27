"use client";
import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  TableProps,
  Tag,
  Select,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
  DeleteFilled,
} from "@ant-design/icons";

import { useFetchData } from "../_components/hooks/useFetchData";
import { constants } from "../_constants/constants";
import {
  CategoryData,
  CategoryPostData,
  GetCategoryData,
  SliderImage,
} from "./types";
import { usePostData } from "../_components/hooks/useMutationData";
import { useState } from "react";
import axiosInstance from "../_components/utils/axiosInstance";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
const postData = async (
  url: string,
  data: { username: string; password: string }
) => {
  const response = await axiosInstance.patch(url, data);
  return response.data;
};
interface SliderImageGet {
  image: string;
  altText: string;
  id: number;
}
export default function Product() {
  const { data: productData } = useFetchData(constants.products);
  const { data: categoryData } = useFetchData<CategoryData[]>(
    constants.category
  );
  const [fileList, setFileList] = useState([]);
  const { isMutating, mutatePost } = usePostData(constants.products);
  const { mutatePost: deleteMutateSlider } = usePostData(constants.slider);
  const { mutatePost: mutateSliderImage } = usePostData(constants.slider);
  const [sliderId, setSliderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sliderImage, setSliderImage] = useState<SliderImageGet[]>();
  const [issliderModalOpen, setIsSliderModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModal] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const [formSlider] = Form.useForm();

  const { trigger: mutateEditProduct } = useSWRMutation(
    `${constants.products}/${editProductId}`,
    (url: string, { arg }: any) => postData(url, arg)
  );

  const categorySelectData: { lable: string; value: number }[] =
    categoryData?.map((category) => ({
      label: category.category_name,
      value: category.id,
    })) as never;

  const props = {
    accept: ".jpg,.png,.gif,.html,.pdf,.doc,docx",
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };
  const deleteShowModal = (record: any) => {
    setProductId(record.id);
    setIsDeleteModal(true);
  };
  const deleteHandleCancel = () => {
    setIsDeleteModal(false);
    setProductId(null);
  };
  const deleteHandleOk = () => {
    mutatePost({ data: { id: productId }, method: "DELETE" } as never);
    setProductId(null);
    setIsDeleteModal(false);
  };

  const sliderDeleteHandler = async (id: number) => {
    await deleteMutateSlider({ data: { id: id }, method: "DELETE" } as never);
    setIsSliderModalOpen(false);
    setSliderImage([]);
    await mutate(constants.products);
  };

  const showAddModal = (record?: any) => {
    form.resetFields();
    setEditProductId(record.id);
    setIsModalOpen(true);
  };
  const showSliderModal = (record?: any) => {
    console.log("record", record);
    setSliderImage(record.sliderImage);
    setSliderId(record.id);
    setIsSliderModalOpen(true);
  };
  const showEditModal = (record?: any) => {
    setEditProductId(record.id);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    formSlider.resetFields();
    setFileList([]);
    setSliderImage([]);
    setIsModalOpen(false);
    setIsSliderModalOpen(false);
  };

  const columns: TableProps["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <p className="max-w-56">{text}</p>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (source) => (
        <img src={source} alt="donuts" className="w-20 h-20" />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Category",
      dataIndex: "categories",
      key: "categories",
      render: (categories: { category_name: string }[]) => (
        <div className="max-w-40 ">
          {Array.isArray(categories) &&
            categories?.map((product, index) => {
              return (
                <Tag color="green" className="mb-2" key={index}>
                  {product?.category_name}
                </Tag>
              );
            })}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record: GetCategoryData) => (
        <div className="flex gap-3">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              showEditModal(record);

              form.setFieldsValue({
                name: record.name,
                description: record.description,
                price: record.price,
                rating: record.rating,
                categoryIds: record.categories.map((value) => value?.id),
              });
            }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => deleteShowModal(record)}
          >
            Delete
          </Button>
          <Button
            icon={<PlusOutlined />}
            onClick={() => showSliderModal(record)}
          >
            Slider Image
          </Button>
        </div>
      ),
    },
  ];

  const onFinish = async (values: CategoryPostData) => {
    const formData = new FormData();
    formData.append("image", fileList[0]);
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("rating", values.rating);
    formData.append("categoryIds", JSON.stringify(values.categoryIds));
    if (editProductId) {
      // formData.append("id", editProductId);
      await mutateEditProduct(formData as never);
    } else {
      await mutatePost({
        data: formData,
      } as never);
      console.log("add block");
    }
    setIsModalOpen(false);
    form.resetFields();
    setFileList([]);
    await mutate(constants.products);
  };
  const sliderImageHandler = async (values: SliderImage) => {
    const formData = new FormData();
    formData.append("altText", values.altText);
    formData.append("image", fileList[0]);
    formData.append("product_id", String(sliderId));
    await mutateSliderImage({
      data: formData,
    } as never);
    setIsSliderModalOpen(false);
    formSlider.resetFields();
    await mutate(constants.products);
    setFileList([]);
  };
  console.log("image", sliderImage);
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold ">Product</h1>
        <Button
          type="default"
          icon={<PlusOutlined />}
          className="font-bold"
          onClick={showAddModal}
        >
          Add Product
        </Button>
      </div>

      <Modal
        title="Add Products"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        {" "}
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input donuts name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input description" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input price" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Rating"
            name="rating"
            rules={[{ required: true, message: "Please input rating" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Category"
            name="categoryIds"
            rules={[{ required: true, message: "Please input category" }]}
          >
            <Select
              showSearch
              mode="multiple"
              allowClear
              placeholder="Please select Category"
              options={categorySelectData}
            />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: "Please input image" }]}
          >
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="DeleteCategory"
        open={isDeleteModalOpen}
        onOk={deleteHandleOk}
        onCancel={deleteHandleCancel}
      >
        <p>Are you sure want to delete product</p>
      </Modal>
      <Modal
        title=" Slider Image"
        open={issliderModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        <section className="mb-6">
          <h1 className="font-bold text-xl "> Product slider Image List</h1>
          <div className="flex gap-12 flex-wrap">
            {sliderImage?.map((value: SliderImageGet) => (
              <div key={value.id} className="text-center">
                <img
                  src={value.image}
                  alt={value.altText}
                  className="w-20 h-20"
                />
                <DeleteFilled
                  className="text-red-700 cursor-pointer"
                  onClick={() => sliderDeleteHandler(value.id)}
                />
              </div>
            ))}
          </div>
        </section>
        <h1 className="font-bold text-xl ">Add Product slider Image</h1>
        <Form
          form={formSlider}
          name="basic"
          layout="vertical"
          onFinish={sliderImageHandler}
          autoComplete="off"
        >
          <Form.Item
            label="Alternative text"
            name="altText"
            rules={[
              { required: true, message: "Please input alternative text" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: "Please input image" }]}
          >
            <Upload {...props}>
              <Button icon={<UploadOutlined />}> Upload Slider Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table columns={columns} dataSource={productData as never} />
    </div>
  );
}
