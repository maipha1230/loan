import React, { useEffect } from 'react';
import { Button, Form, FormProps, Input, Modal } from 'antd';
import { SuccessDialog } from '@/utils/SweetAlert';
import { CreateCustomer, FindCustomerOneById, UpdateCustomer } from '@/service/customer';

type FieldType = {
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    address: string;
};

type CustomerModelProps = {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
    title?: string;
    customerId?: number
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const CustomerModal: React.FC<CustomerModelProps> = ({ open, onOk, onCancel, title, customerId }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (customerId) {
            getCustomerInformation(customerId)
        }
    }, [])

    async function getCustomerInformation(customerId: number) {
        try {
            const response = await FindCustomerOneById(customerId)
            const customerData: FieldType = response.data
            form.setFieldsValue(customerData)
        } catch (error) {

        }
    }

    const BuildCustomerData = async (value: FieldType): Promise<FieldType> => {
        return {
            firstname: value.firstname,
            lastname: value.lastname,
            phone: value.phone,
            email: value.email,
            address: value.address
        }
    }

    const onFinish = async (values: FieldType) => {
        try {
            const payload = await BuildCustomerData(values)
            if (customerId) {
                const response = await UpdateCustomer(customerId, payload)
                if (response) {
                    await SuccessDialog({
                        title: "Update Customer Success",
                        showConfirmButton: false,
                        showCancelText: false,
                        text: "",
                        timer: 3000
                    })
                }
            } else {
                const response = await CreateCustomer(payload)
                if (response) {
                    await SuccessDialog({
                        title: "Create Customer Success",
                        showConfirmButton: false,
                        showCancelText: false,
                        text: "",
                        timer: 3000
                    })
                }
            }
            onOk()
        } catch (error) {

        }
    }

    return (
        <Modal
            title={title || ''}
            open={open}
            footer={null}
            onOk={onOk}
            onCancel={onCancel}
            okText="Save"
            cancelText="Cancel"
        >
            <Form
                name="customer-form"
                form={form}
                className='gap-3'
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{
                    firstname: "",
                    lastname: "",
                    phone: "",
                    email: "",
                    address: ""
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="First Name"
                    name="firstname"
                    rules={[{ required: true, message: 'Please input your First Name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Last Name"
                    name="lastname"
                    rules={[{ required: true, message: 'Please input your Last Name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Phone"
                    name="phone"

                    rules={[{ required: true, message: 'Please input your Phone!' }, { min: 10, max: 10, message: "Phone Length must be 10" }]}
                >
                    <Input maxLength={10} minLength={10} />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your Last Name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="address"
                    label="Address"
                    rules={[{ required: true, message: 'Please input your Address!' }]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="default" onClick={onCancel} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CustomerModal;
