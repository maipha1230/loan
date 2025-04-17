"use client"
import CommonTable from '@/components/CommonTable';
import LoanModal from '@/components/Modal/LoanModal';
import { useLoading } from '@/provider/loading';
import { GetLoanList, RemoveLoan } from '@/service/loan'
import { ConfirmDialog, SuccessDialog } from '@/utils/SweetAlert';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'

type Loan = {
    id: number;
    loanName: string;
    minAmount: number;
    maxAmount: number;
    minRange: number;
    maxRange: number;
    createdAt: string;
    updatedAt: string;
};


function LoanPage() {
    const queryClient = useQueryClient()
    const { startLoading, stopLoading } = useLoading();
    const [selectedLoanId, setSelectedLoanId] = useState<number | undefined>(undefined)
    const [loanModalTitle, setLoanModalTitle] = useState<string>("Create Loan")
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns: ColumnsType<Loan> = [
        {
            title: 'No.',
            dataIndex: 'id',
            key: 'id',
            render: (_, __, index) => {
                return index + 1
            }
        },
        {
            title: 'Name of Loan',
            dataIndex: 'loanName',
            key: 'loanName',
        },
        {
            title: 'Minimum Amount',
            dataIndex: 'minAmount',
            key: 'minAmount',
            render: (value) => {
                return Number(value) == 0 ?
                    "Not Required" :
                    new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(value)
            }
        },
        {
            title: 'Maximum Amount',
            dataIndex: 'maxAmount',
            key: 'maxAmount',
            render: (value) => {
                return Number(value) == 0 ?
                    "Not Required" :
                    new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(value)
            }
        },
        {
            title: 'Minimum Range',
            dataIndex: 'minRange',
            key: 'minRange',
            render: (value) => {
                return Number(value) == 0 ?
                    "Not Required" :
                    new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(value)
            }
        },
        {
            title: 'Maximum Rang',
            dataIndex: 'maxRange',
            key: 'maxRange',
            render: (value) => {
                return Number(value) == 0 ?
                    "Not Required" :
                    new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(value)
            }
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
                        <Button color="cyan" variant='outlined' onClick={() => showModal("Edit Loan", value)}>Edit</Button>
                        <Button danger onClick={() => handleRemove(value, record.loanName)}>Remove</Button>
                    </div>
                )
            },
        },
    ]

    const { data: loanList, isLoading, error } = useQuery({
        queryKey: ['loans'],
        queryFn: GetLoanList
    })

    useEffect(() => {
        if (isLoading) {
            startLoading()
        } else {
            stopLoading()
        }
    }, [isLoading])

    const showModal = (title: string, loanId?: number) => {
        setLoanModalTitle(title)
        if (loanId) {
            setSelectedLoanId(loanId)
        }
        setIsModalOpen(true);
    }
    const handleOk = async () => {
        setIsModalOpen(false);
        setSelectedLoanId(undefined)
        queryClient.invalidateQueries({ queryKey: ['loans'] })
    };
    const handleCancel = () => {
        setIsModalOpen(false)
        setSelectedLoanId(undefined)
    };

    const handleRemove = async (loanId: number, loanName: string) => {
        const result = await ConfirmDialog({
            text: `Do you want to Remove ${loanName}`,
            title: "Are you sure ?",
            showConfirmButton: true,
            showCancelText: true,
            confirmText: "Yes",
            cancelText: "No",
        })
        if (result.isConfirmed) {
            const response = await RemoveLoan(loanId)
            if (response) {
                await SuccessDialog({
                    title: "Remove Loan Success",
                    showConfirmButton: false,
                    showCancelText: false,
                    text: "",
                    timer: 3000
                })
                queryClient.invalidateQueries({ queryKey: ['loans'] })
            }
        }
    }

    return (
        <div className='w-full h-auto flex flex-col gap-3 p-3'>
            <h2 className='text-cyan-500 text-2xl'>Loan List</h2>
            <div className='w-full flex justify-end'>
                <Button color='primary' variant='solid' onClick={() => showModal("Create Loan")}>Create Loan</Button>
            </div>
            {loanList && <CommonTable columns={columns} data={loanList.data} rowKey="id" loading={isLoading}></CommonTable>}


            {/* modal */}
            {
                isModalOpen &&
                <LoanModal title={loanModalTitle} onOk={handleOk} onCancel={handleCancel} open={isModalOpen} loanId={selectedLoanId} />
            }
        </div>
    )
}

export default LoanPage