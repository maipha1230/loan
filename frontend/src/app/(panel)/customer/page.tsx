"use client"
import CommonTable from '@/components/CommonTable';
import CustomerModal from '@/components/Modal/CustomerModal';
import { useLoading } from '@/provider/loading';
import { GetCustomerList, RemoveCustomer } from '@/service/customer';
import { ConfirmDialog, SuccessDialog } from '@/utils/SweetAlert';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'

type Customer = {
    id: number;
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    address: string;
    createdAt: string;
    updatedAt: string;
};


function CustomerPage() {
    const queryClient = useQueryClient()
    const { startLoading, stopLoading } = useLoading()
    const [selectedCustomerId, setSelectedCustomer] = useState<number | undefined>(undefined)
    const [customerModalTitle, setCustomerModalTitle] = useState<string>("Create Customer")
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns: ColumnsType<Customer> = [
        {
            title: 'No.',
            dataIndex: 'id',
            key: 'id',
            render: (_, __, index) => {
                return index + 1
            }
        },
        {
            title: 'First Name',
            dataIndex: 'firstname',
            key: 'firstname',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastname',
            key: 'lastname'
        },
        {
            title: 'phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Manage',
            dataIndex: 'id',
            key: 'id',
            align: "center",
            render: (value, record) => {
                return (
                    <div className='flex flex-row gap-1 justify-center items-center'>
                        <Button color="cyan" variant='outlined' onClick={() => showModal("Edit Customer", value)}>Edit</Button>
                        <Button danger onClick={() => handleRemove(value, `${record.firstname} ${record.lastname}`)}>Remove</Button>
                    </div>
                )
            },
        },
    ]

    const { data: customerList, isLoading, error } = useQuery({
        queryKey: ['customers'],
        queryFn: GetCustomerList
    })

    useEffect(() => {
        if (isLoading) {
            startLoading()
        } else {
            stopLoading()
        }
    }, [isLoading])

    const showModal = (title: string, customerId?: number) => {
        setCustomerModalTitle(title)
        if (customerId) {
            setSelectedCustomer(customerId)
        }
        setIsModalOpen(true);
    }
    const handleOk = async () => {
        setIsModalOpen(false);
        setSelectedCustomer(undefined)
        queryClient.invalidateQueries({ queryKey: ['customers'] })
    };
    const handleCancel = () => {
        setIsModalOpen(false)
        setSelectedCustomer(undefined)
    };

    const handleRemove = async (customerId: number, customerName: string) => {
        const result = await ConfirmDialog({
            text: `Do you want to Remove ${customerName}`,
            title: "Are you sure ?",
            showConfirmButton: true,
            showCancelText: true,
            confirmText: "Yes",
            cancelText: "No",
        })
        if (result.isConfirmed) {
            const response = await RemoveCustomer(customerId)
            if (response) {
                await SuccessDialog({
                    title: "Remove Customer Success",
                    showConfirmButton: false,
                    showCancelText: false,
                    text: "",
                    timer: 3000
                })
                queryClient.invalidateQueries({ queryKey: ['customers'] })
            }
        }
    }

    return (
        <div className='w-full h-auto flex flex-col gap-3 p-3'>
            <h2 className='text-cyan-500 text-2xl'>Customer List</h2>
            <div className='w-full flex justify-end'>
                <Button color='primary' variant='solid' onClick={() => showModal("Create Customer")}>Create Customer</Button>
            </div>
            {customerList && <CommonTable columns={columns} data={customerList.data} rowKey="id" loading={isLoading}></CommonTable>}


            {/* modal */}
            {
                isModalOpen &&
                <CustomerModal title={customerModalTitle} onOk={handleOk} onCancel={handleCancel} open={isModalOpen} customerId={selectedCustomerId} />
            }
        </div>
    )
}

export default CustomerPage