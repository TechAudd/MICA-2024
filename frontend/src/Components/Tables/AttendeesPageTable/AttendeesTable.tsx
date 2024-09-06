import { Form, Input, Pagination, Popconfirm, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { IGetRegistrationDetailsData } from "../../../types/types";
import type { TableProps } from "antd";
import type { PaginationProps } from 'antd';
import EditAttende from "../../Modals/EditAttende";

interface AttendeesTableProps {
  originalData: IGetRegistrationDetailsData[];
  totalPages: number;
  handlePageChange: (requestedPage: number) => void;
  currentPage: number
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "number" | "text";
  record: IGetRegistrationDetailsData;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const AttendeesTable: React.FC<AttendeesTableProps> = ({ originalData, totalPages, handlePageChange, currentPage }) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string | undefined>(undefined);
  const [data, setData] = useState<IGetRegistrationDetailsData[]>(originalData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [attendeesData, setAttendeesData] = useState<IGetRegistrationDetailsData | undefined>();

  useEffect(() => {
    setData(originalData);

  }, [originalData]);

  const isEditing = (record: IGetRegistrationDetailsData) => record._id === editingKey;

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as IGetRegistrationDetailsData;
      const newData = [...data];
      const index = newData.findIndex((item) => key === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey(undefined);
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey(undefined);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  // const edit = (record: IGetRegistrationDetailsData) => {
  //   form.setFieldsValue({ ...record });
  //   setEditingKey(record._id);
  // };

  const view = (record: IGetRegistrationDetailsData, edit : boolean) => {
    setIsModalOpen(true);
    setAttendeesData(record);
    if(edit){      
      setIsEdit(true);
    }
  }

  const cancel = () => {
    setEditingKey(undefined);
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "txnid",
      key: "txnid",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Mail ID",
      dataIndex: "mailId",
      key: "mailId",
    },
    {
      title: "Registration Type",
      dataIndex: "registerType",
      key: "registerType",
    },
    {
      title: "Registration Date",
      dataIndex: "createdAt",
      key: "createdAt",
    },    
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },

    // {
    //   title: "Created At",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    // },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: IGetRegistrationDetailsData) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record._id)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== undefined}
              onClick={() => view(record,true)}
              className="mr-4"
            >
              Edit
            </Typography.Link>

            <Typography.Link
              onClick={() => view(record,false)}
            >
              View
            </Typography.Link>
          </>
        );
      },
    },
  ];

  const mergedColumns: TableProps<IGetRegistrationDetailsData>["columns"] = columns.map(
    (col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: IGetRegistrationDetailsData) => ({
          record,
          inputType: "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    }
  );



  const handleTableChange: PaginationProps['onChange'] = (page) => {
    handlePageChange(page)
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEdit(false);
  };

  return (
    <>
      <EditAttende
        isOpen={isModalOpen}
        data={attendeesData}
        onClose={handleCloseModal}
        title="Sample Modal"
        isEdit={isEdit}
      />
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          pagination={false}
          rowClassName="hover:bg-gray-100"
        />
        <Pagination className="flex justify-end" current={currentPage} defaultCurrent={1} total={totalPages * 10} onChange={handleTableChange} />
      </Form>
    </>
  );
};

export default AttendeesTable;
