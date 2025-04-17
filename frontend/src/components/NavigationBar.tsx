'use client'
import { ConfirmDialog, SuccessDialog } from '@/utils/SweetAlert';
import { CaretDownFilled, DownOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Drawer, Dropdown, Menu, Space, Typography } from 'antd';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        label: 'Sign Out',
        key: 'sign-out',
        icon: <LogoutOutlined />,
    },
];

function NavigationBar() {
    const [openDrawer, setOpenDrawer] = useState(false);

    const showDrawer = () => setOpenDrawer(true);
    const onCloseDrawer = () => setOpenDrawer(false);
    const onClickMenu: MenuProps['onClick'] = async (e) => {
        if (e.key === 'sign-out') {
            const result = await ConfirmDialog({
                title: "Sign Out",
                text: "Are you sure ?",
                showConfirmButton: true,
                showCancelText: true
            })
            if (result.isConfirmed) {
                await SuccessDialog({
                    title: "Success",
                    text: "Sign Out Success",
                    showConfirmButton: false,
                    showCancelText: false,
                    timer: 3000
                })
                signOut({ callbackUrl: '/sign-in' });
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                return
            }
        }
    };
    return (
        <div className='w-full min-w-screen h-[50px] bg-cyan-700 flex justify-between items-center px-2'>
            <div className='flex gap-1 items-center'>
                <Button
                    type="text"
                    icon={<MenuOutlined />}
                    onClick={showDrawer}
                    style={{ fontSize: '20px', width: 48, height: 48, color: 'white' }}
                />
                <h1 className='text-2xl text-white'>
                    Loan Management System
                </h1>
            </div>

            <Dropdown menu={{ items, onClick: onClickMenu }} className='cursor-pointer'>
                <Space>
                    <CaretDownFilled style={{ color: "#ffffff" }} className='font-bold' />
                </Space>
            </Dropdown>
            {/* Drawer */}
            <Drawer
                title="Menu"
                placement="left"
                onClose={onCloseDrawer}
                open={openDrawer}
            >
                <div className="flex flex-col gap-3">
                    <Link href="/dashboard" passHref>
                        <Button type="default" block onClick={onCloseDrawer}>Home</Button>
                    </Link>
                    <Link href="/loan" passHref>
                        <Button type="default" block onClick={onCloseDrawer}>Loan</Button>
                    </Link>
                    <Link href="/customer" passHref>
                        <Button type="default" block onClick={onCloseDrawer}>Customer</Button>
                    </Link>
                    <Link href="/contract" passHref>
                        <Button type="default" block onClick={onCloseDrawer}>Contract</Button>
                    </Link>
                </div>
            </Drawer>
        </div>
    )
}

export default NavigationBar