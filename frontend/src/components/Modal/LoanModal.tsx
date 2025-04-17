import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, FormProps, Input, Modal } from 'antd';
import { CreateLoan, FindLoanOneById, UpdateLoan } from '@/service/loan';
import { SuccessDialog } from '@/utils/SweetAlert';

type FieldType = {
    loanName: string;
    minAmount: number;
    maxAmount: number;
    minRange: number;
    maxRange: number;
};

type LoanModalProps = {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
    title?: string;
    loanId?: number
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const LoanModal: React.FC<LoanModalProps> = ({ open, onOk, onCancel, title, loanId }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (loanId) {
            getLoanInformation(loanId)
        }
    }, [])

    async function getLoanInformation(loanId: number) {
        try {
            const response = await FindLoanOneById(loanId)
            const loanData: FieldType = response.data
            form.setFieldsValue(loanData)
        } catch (error) {

        }
    }

    const BuildLoanData = async(value: FieldType): Promise<FieldType>  => {
        return {
            loanName: value.loanName,
            minAmount: Number(value.minAmount),
            maxAmount: Number(value.maxAmount),
            minRange: Number(value.minRange),
            maxRange: Number(value.maxRange),
        }
    }

    const onFinish = async (values: FieldType) => {
        try {
            const payload = await BuildLoanData(values)
            if (loanId) {
                const response = await UpdateLoan(loanId, payload)
                if (response) {
                    await SuccessDialog({
                        title: "Update Loan Success",
                        showConfirmButton: false,
                        showCancelText: false,
                        text: "",
                        timer: 3000
                    })
                }
            } else {
                const response = await CreateLoan(payload)
                if (response) {
                    await SuccessDialog({
                        title: "Create Loan Success",
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
                name="loan-form"
                form={form}
                className='gap-3'
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{
                    loanName: "",
                    minAmount: "",
                    maxAmount: "",
                    minRange: "",
                    maxRange: "",
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Name"
                    name="loanName"
                    rules={[{ required: true, message: 'Please input your Loan Name!' }, { min: 6, message: "Character must greater than 5" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Minimum Amount"
                    name="minAmount"
                    dependencies={['maxAmount']}
                    rules={[{ required: true, message: 'Please input your Minimum Amount!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            const max = Number(getFieldValue('maxAmount'));
                            const min = Number(value);
                            if (isNaN(min)) {
                                return Promise.reject(new Error('Value must be number, if not required enter 0'));
                            }
                            if (min <= max) {
                                return Promise.resolve(min);
                            }
                            return Promise.reject(new Error('Maximum Amount must be greater than Minimum Amount.'));
                        },
                    })
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Maximum Amount"
                    name="maxAmount"
                    dependencies={['minAmount']}
                    rules={[{ required: true, message: 'Please input your Maximum Amount!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            const min = Number(getFieldValue('minAmount'));
                            const max = Number(value);
                            if (isNaN(max)) {
                                return Promise.reject(new Error('Value must be number, if not required enter 0'));
                            }
                            if (min <= max) {
                                return Promise.resolve(max);
                            }
                            return Promise.reject(new Error('Maximum Amount must be greater than Minimum Amount.'));
                        },
                    }),
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Minimum Range"
                    name="minRange"
                    dependencies={['maxRange']}
                    rules={[{ required: true, message: 'Please input your Minimum Range!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            const max = Number(getFieldValue('maxRange'));
                            const min = Number(value);
                            if (!Number.isInteger(min)) {
                                return Promise.reject(new Error('Value must be integer'));
                            }
                            if (isNaN(min)) {
                                return Promise.reject(new Error('Value must be number, if not required enter 0'));
                            }
                            if (min <= max) {
                                return Promise.resolve(min);
                            }
                            return Promise.reject(new Error('Maximum Range must be greater than Minimum Range.'));
                        },
                    })
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Maximum Range"
                    name="maxRange"
                    dependencies={['minRange']}
                    rules={[{ required: true, message: 'Please input your Maximum Range!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            const min = Number(getFieldValue('minRange'));
                            const max = Number(value);
                            if (!Number.isInteger(max)) {
                                return Promise.reject(new Error('Value must be integer'));
                            }
                            if (isNaN(max)) {
                                return Promise.reject(new Error('Value must be number, if not required enter 0'));
                            }
                            if (min <= max) {
                                return Promise.resolve(max);
                            }
                            return Promise.reject(new Error('Maximum Range must be greater than Minimum Range.'));
                        },
                    })
                    ]}
                >
                    <Input />
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

export default LoanModal;
