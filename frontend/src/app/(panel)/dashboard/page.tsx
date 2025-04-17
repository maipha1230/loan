"use client"
import CommonTable from '@/components/CommonTable';
import CustomerModal from '@/components/Modal/CustomerModal';
import { useLoading } from '@/provider/loading';
import { GetCustomerList, RemoveCustomer } from '@/service/customer';
import { CancelContract, GetContractList } from '@/service/loan';
import { ConfirmDialog, SuccessDialog } from '@/utils/SweetAlert';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
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


function DashboardPage() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { startLoading, stopLoading } = useLoading()

    const columns: ColumnsType<ContractModel> = [
        {
            title: 'No.',
            dataIndex: 'id',
            key: 'id',
            render: (_, __, index) => {
                return index + 1
            }
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'Customer',
            render: (_, record) => {
                return `${record.Customer.firstname} ${record.Customer.lastname}`
            }
        },
        {
            title: 'Loan',
            dataIndex: 'Loan',
            key: 'Loan',
            render: (_, record) => {
                return record.Loan.loanName
            }
        },
        {
            title: 'Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (value) => {
                return new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(value)
            }
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
            render: (value) => {
                return `${value}%`
            }
        },
        {
            title: 'status',
            dataIndex: 'status',
            key: 'status',
            render: (value) => {
                return (
                    <>
                        {value === 'ACTIVE' && <div className='text-green-500'>{value}</div>}
                        {value === 'CANCEL' && <div className='text-red-500'>{value}</div>}
                    </>
                );
            }
        },
        {
            title: 'Contract At',
            dataIndex: 'createdAt',
            key: 'createdAt',
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
                        <Button color="cyan" variant='outlined' onClick={() => router.push(`/contract?id=${value}`)}>Edit</Button>
                    </div>
                )
            },
        },
    ]

    const contractQuery = useQuery({
        queryKey: ['contracts'],
        queryFn: GetContractList,

    })

    useEffect(() => {
        if (contractQuery.isFetching) {
            startLoading()
        } else {
            stopLoading()
        }
    }, [contractQuery])

    return (
        <div className='w-full h-auto flex flex-col gap-3 p-3'>
            <h2 className='text-cyan-500 text-2xl'>Contract List</h2>
            <div className='w-full flex justify-end'>
                <Button color='primary' variant='solid' onClick={() => router.push("/contract")} >Create Contract</Button>
            </div>
            <CommonTable
                columns={columns}
                data={contractQuery.data?.data}
                rowKey="id"
                loading={contractQuery.isLoading}
            />
        </div>
    )
}

export default DashboardPage