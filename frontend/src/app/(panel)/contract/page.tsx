"use client"
import { useLoading } from '@/provider/loading';
import { GetCustomerList } from '@/service/customer';
import { CancelContract, CreateContract, FindContractOneById, GetLoanList, UpdateContract } from '@/service/loan';
import { ConfirmDialog, SuccessDialog } from '@/utils/SweetAlert';
import { useQuery } from '@tanstack/react-query';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { DatePicker, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter, useSearchParams } from 'next/navigation';

const { RangePicker } = DatePicker;
import React, { useEffect, useMemo, useState } from 'react'


type LoanForm = {
    id: number;
    loanName: string;
    minAmount: number;
    maxAmount: number;
    minRange: number;
    maxRange: number;
};

type CustomerForm = {
    id: number;
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    address: string;
};

type ContractForm = {
    totalAmount: number
    rate: number
    dateRange: [Dayjs, Dayjs],
    status: string
}


function ContractPage() {
    const router = useRouter()
    const { startLoading, stopLoading } = useLoading()
    const [loanForm] = Form.useForm();
    const [customerForm] = Form.useForm();
    const [contractForm] = Form.useForm();
    const status = Form.useWatch('status', contractForm);
    const dateRange = Form.useWatch('dateRange', contractForm);
    const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null)
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)
    const searchParams = useSearchParams();
    const ParamId = searchParams.get('id');

    const queryLoan = useQuery({
        queryKey: ['loans'],
        queryFn: GetLoanList
    })
    const queryCustomer = useQuery({
        queryKey: ['customers'],
        queryFn: GetCustomerList
    })

    useEffect(() => {
        if (ParamId && !isNaN(Number(ParamId))) {
            GetContractInformation(Number(ParamId))
        }
    }, [queryCustomer.data, queryLoan.data])

    useEffect(() => {
        if (queryLoan.isFetching || queryCustomer.isFetching) {
            startLoading()
        } else {
            stopLoading()
        }
    }, [queryLoan, queryCustomer])

    async function GetContractInformation(id: number) {
        try {
            startLoading()
            const response = await FindContractOneById(id)
            startLoading()
            if (response) {
                const contractData: ContractModel = response.data
                await patchContractForm(contractData)
            }
        } catch (error) {
            startLoading()
            router.push("/dashboard")
        }
    }

    async function patchContractForm(data: ContractModel) {
        await HandleSelectCustomer(data.Customer.id)
        await HandleSelectLoan(data.Loan.id)
        contractForm.setFieldsValue({
            totalAmount: data.totalAmount,
            rate: data.rate,
            dateRange: [dayjs(data.startDate), dayjs(data.endDate)],
            status: data.status
        })
    }


    async function HandleSelectLoan(value: number) {
        const Loan = queryLoan.data?.data?.find((item: any) => item.id == value)
        if (Loan) {
            loanForm.setFieldsValue(Loan)
            setSelectedLoanId(Loan.id)
        } else {
            loanForm.setFieldsValue({
                minAmount: '',
                maxAmount: '',
                minRange: '',
                maxRange: '',
            })
            setSelectedLoanId(null)
        }
    }

    async function HandleSelectCustomer(value: number) {
        const Customer = queryCustomer.data?.data?.find((item: any) => item.id == value)
        if (Customer) {
            customerForm.setFieldsValue(Customer)
            setSelectedCustomerId(Customer.id)
        } else {
            customerForm.setFieldsValue({
                firstname: "",
                lastname: "",
                phone: "",
                email: "",
                address: ""
            })
            setSelectedCustomerId(null)
        }
    }

    async function HandleSubmitAllForm() {
        try {
            const loanValues = await loanForm.validateFields();
            const customerValues = await customerForm.validateFields();
            const contractValues = await contractForm.validateFields();

            const contractPayload = {
                loanId: selectedLoanId,
                customerId: selectedCustomerId,
                totalAmount: Number(contractValues.totalAmount),
                rate: Number(contractValues.rate),
                startDate: dayjs(contractValues.dateRange[0]).toDate(),
                endDate: dayjs(contractValues.dateRange[1]).toDate()
            }
            if (ParamId) {
                const response = await UpdateContract(Number(ParamId), contractPayload)
                if (response) {
                    await SuccessDialog({
                        title: "Update Contract Success",
                        text: "",
                        timer: 3000,
                        showConfirmButton: false,
                        showCancelText: false
                    })
                    router.replace(`/contract?id=${response.data.id}`)
                }
            } else {
                const response = await CreateContract(contractPayload)
                if (response) {
                    await SuccessDialog({
                        title: "Create Contract Success",
                        text: "",
                        timer: 3000,
                        showConfirmButton: false,
                        showCancelText: false
                    })
                    router.replace(`/contract?id=${response.data.id}`)
                }

            }
        } catch (error) {

        }
    }

    async function HandleDeactivateLoan() {
        try {
            const result = await ConfirmDialog({
                text: `Do you want to Deactivate`,
                title: "Are you sure ?",
                showConfirmButton: true,
                showCancelText: true,
                confirmText: "Yes",
                cancelText: "No",
            })
            if (result.isConfirmed) {
                const response = await CancelContract(Number(ParamId), {})
                if (response) {
                    await SuccessDialog({
                        title: "Deactivate Contract Success",
                        text: "",
                        timer: 3000,
                        showConfirmButton: false,
                        showCancelText: false
                    })
                    router.replace(`/dashboard`)
                }
            }
        } catch (error) {

        }
    }

    const isDisableDeactivate = useMemo(() => {
        if (!!ParamId) {
            const now = new Date();
            if (!status || !dateRange || dateRange.length !== 2) return true;

            const endDate = dayjs(dateRange[1]).toDate();
            return status !== 'ACTIVE' || now > endDate;
        }
        return false
    }, [ParamId, status, dateRange]);
    return (
        <div className='w-full h-auto flex flex-col items-center gap-3 p-3'>
            <h2 className='text-cyan-500 font-bold text-2xl'>Contract</h2>

            <Form
                name="loan-form"
                form={loanForm}
                className="gap-3 w-full max-w-[800px]"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                initialValues={{
                    id: '',
                    minAmount: '',
                    maxAmount: '',
                    minRange: '',
                    maxRange: '',
                }}
                autoComplete="off"
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <h1 className='text-cyan-500 text-lg'>Loan Form</h1>
                    </Col>
                    <Col span={24}>
                        <Form.Item<LoanForm> wrapperCol={{ span: 24 }} name="id">
                            <Select
                                className='w-full my-2 max-w-[800px]'
                                showSearch
                                allowClear
                                onClear={() => {
                                    loanForm.setFieldsValue({
                                        minAmount: '',
                                        maxAmount: '',
                                        minRange: '',
                                        maxRange: '',
                                    })
                                }}
                                disabled={!!ParamId}
                                placeholder="Select a Loan"
                                onSelect={HandleSelectLoan}
                                filterOption={(input, option) => {
                                    if (option?.label) {
                                        const label = String(option.label);
                                        return label.toLowerCase().includes(input.toLowerCase());
                                    }
                                    return false;
                                }
                                }
                                options={queryLoan.data ? queryLoan.data.data.map((item: any) => {
                                    return { value: item.id, label: item.loanName }
                                }) : []}
                            />
                        </Form.Item>

                    </Col>
                    {/* Minimum Amount */}
                    <Col span={12}>
                        <Form.Item<LoanForm>
                            label="Minimum Amount"
                            name="minAmount"
                            dependencies={['maxAmount']}
                            rules={[
                                { required: true, message: 'Please input your Minimum Amount!' },
                            ]}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    {/* Maximum Amount */}
                    <Col span={12}>
                        <Form.Item<LoanForm>
                            label="Maximum Amount"
                            name="maxAmount"
                            dependencies={['minAmount']}
                            rules={[{ required: true, message: 'Please input your Maximum Amount!' }]}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    {/* Minimum Range */}
                    <Col span={12}>
                        <Form.Item<LoanForm>
                            label="Minimum Range"
                            name="minRange"
                            dependencies={['maxRange']}
                            rules={[{ required: true, message: 'Please input your Minimum Range!' }]}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    {/* Maximum Range */}
                    <Col span={12}>
                        <Form.Item<LoanForm>
                            label="Maximum Range"
                            name="maxRange"
                            dependencies={['minRange']}
                            rules={[{ required: true, message: 'Please input your Maximum Range!' }]}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Form
                name="customer-form"
                form={customerForm}
                className='gap-3'
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 800 }}
                initialValues={{
                    id: "",
                    firstname: "",
                    lastname: "",
                    phone: "",
                    email: "",
                    address: ""
                }}
                autoComplete="off"
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <h1 className='text-cyan-500 text-lg'>Customer Form</h1>
                    </Col>
                    <Col span={24}>
                        <Form.Item<LoanForm> wrapperCol={{ span: 24 }} name="id">
                            <Select
                                className='w-full my-2 max-w-[800px]'
                                allowClear
                                onClear={() => {
                                    customerForm.setFieldsValue({
                                        firstname: "",
                                        lastname: "",
                                        phone: "",
                                        email: "",
                                        address: ""
                                    })
                                }}
                                disabled={!!ParamId}
                                showSearch
                                placeholder="Select a Customer"
                                onSelect={HandleSelectCustomer}
                                filterOption={(input, option) => {
                                    if (option?.label) {
                                        const label = String(option.label);
                                        return label.toLowerCase().includes(input.toLowerCase());
                                    }
                                    return false;
                                }
                                }
                                options={queryCustomer.data ? queryCustomer.data.data.map((item: any) => {
                                    return { value: item.id, label: item.phone }
                                }) : []}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<CustomerForm>
                            label="First Name"
                            name="firstname"
                            rules={[{ required: true, message: 'Please input your First Name!' }]}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<CustomerForm>
                            label="Last Name"
                            name="lastname"
                            rules={[{ required: true, message: 'Please input your Last Name!' }]}
                        >
                            <Input disabled />
                        </Form.Item></Col>
                    <Col span={12}>
                        <Form.Item<CustomerForm>
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your Last Name!' }]}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[{ required: true, message: 'Please input your Address!' }]}
                        >
                            <Input.TextArea disabled />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Form
                name="contract-form"

                form={contractForm}
                className='gap-3'
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 800 }}
                initialValues={{
                    totalAmount: "",
                    rate: "",
                    status: ""
                }}
                autoComplete="off"
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <h1 className='text-cyan-500 text-lg'>Contract Information Form</h1>
                    </Col>
                    <Col span={12}>
                        <Form.Item<ContractForm>
                            label="Rate"
                            name="rate"
                            rules={[{ required: true, message: 'Please input your Rate!' },
                            () => ({
                                validator(_, value) {
                                    value = Number(value)
                                    if (isNaN(value)) {
                                        return Promise.reject(new Error('Value must be number'));
                                    }
                                    if (value <= 0) {
                                        return Promise.reject(new Error('Value must more than 0'));
                                    }
                                    return Promise.resolve(value)
                                },
                            })
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item<ContractForm>
                            label="Total Amount"
                            name="totalAmount"
                            rules={[{ required: true, message: 'Please input your Total Amount!' },
                            () => ({
                                validator(_, value) {
                                    value = Number(value)
                                    if (isNaN(value)) {
                                        return Promise.reject(new Error('Value must be number'));
                                    }
                                    if (value <= 0) {
                                        return Promise.reject(new Error('Value must more than 0'));
                                    }
                                    const minAmount = loanForm.getFieldValue('minAmount');
                                    const maxAmount = loanForm.getFieldValue('maxAmount');

                                    if (minAmount && maxAmount) {
                                        if ((value < minAmount || value > maxAmount)) {
                                            return Promise.reject(new Error("Total Amount Not In Loan Range"));
                                        }
                                    }

                                    return Promise.resolve(value)
                                },
                            })
                            ]}
                        >
                            <Input />
                        </Form.Item></Col>
                    <Col span={20}>
                        <Form.Item<ContractForm>
                            label="Date Range"
                            name="dateRange"
                            rules={[{ required: true, message: 'Please select date range!' },
                            ({
                                validator(_, value) {
                                    if (!value || value.length !== 2) return Promise.resolve();

                                    const minRange = loanForm.getFieldValue('minRange');
                                    const maxRange = loanForm.getFieldValue("maxRange")
                                    const start = value[0];
                                    const end = value[1];

                                    const diffInYears = end.diff(start, 'year', true); // fractional year diff

                                    if (!(diffInYears >= parseFloat(minRange)) || !(diffInYears <= parseFloat(maxRange))) {
                                        return Promise.reject(
                                            new Error(`Date Not In Years Range`)
                                        );
                                    }
                                    return Promise.resolve();

                                },
                            }),
                            ]}
                        >
                            <RangePicker
                                disabledDate={(current) => {
                                    return current && current < dayjs().startOf('day');
                                }}
                                style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    {ParamId && <Col span={16}>
                        <Form.Item<ContractForm>
                            label="Status"
                            name="status"
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>}
                    {ParamId && <Col span={8}>
                        <Button type='default' color='red' variant='filled' onClick={HandleDeactivateLoan} disabled={isDisableDeactivate}>
                            Deactivate Loan
                        </Button>
                    </Col>}
                </Row>
            </Form>
            <div className='flex gap-2 justify-center items-center fixed bottom-10 w-full'>
                <Button type='default' color='default' onClick={() => router.push("/dashboard")}>
                    Back
                </Button>
                <Button type='default' color='primary' variant='solid' onClick={HandleSubmitAllForm}>
                    {!!ParamId ? "Update" :  "Create"}
                </Button>
            </div>
        </div>
    )
}

export default ContractPage