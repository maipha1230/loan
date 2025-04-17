"use client";
import React, { useState } from 'react'
import { getSession, signIn, useSession } from "next-auth/react"
import type { FormProps } from 'antd';
import { Button, Form, Input, Typography } from 'antd';
import { redirect, useRouter } from 'next/navigation';
import { SuccessDialog, WarningDialog } from '@/utils/SweetAlert';

type FieldType = {
    username: string;
    password: string;
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

function SignInPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false)

    const onFinish = async (values: FieldType) => {
        try {
            setError(null);
            setLoading(true);

            const result = await signIn("credentials", {
                username: values.username,
                password: values.password,
                redirect: false,
            });

            setLoading(false);

            if (result?.error) {
                setError(result.error);
                await WarningDialog({
                    title: "Unauthorized",
                    text: "Username or Password Incorrect",
                    timer: 3000
                })
                return;
            }

            const session = await getSession();

            if (session && session.user) {
                const { accessToken, refreshToken } = session.user;

                if (accessToken && refreshToken) {
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);
                }
                router.push("/");
                await SuccessDialog({
                    title: "Success",
                    text: "Sign In Success",
                    showConfirmButton: false,
                    showCancelText: false,
                    timer: 3000,
                });
            }
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
            await WarningDialog({
                title: "Unauthorized",
                text: "Username or Password Incorrect",
                timer: 3000
            })
            return
        }
    };
    return (
        <div className='w-full h-auto min-h-screen bg-slate-200 flex flex-col items-center justify-center gap-4'>
            <div className='w-[500px] h-auto min-h-[200px] bg-white rounded-3xl flex flex-col items-center gap-3'>
                <Typography.Title level={3} className="text-center">
                    Sign In
                </Typography.Title>
                <Form
                    name="sign-in-form"
                    className='gap-3'
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ username: "", password: "" }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label={null}>
                        <div className='w-full flex gap-2'>
                            <Button type="primary" htmlType="submit">
                                Sign In
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default SignInPage