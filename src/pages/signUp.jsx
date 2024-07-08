import sparklogin from '../assets/sparklogin.png'
import logogreen from '../assets/logogreen.png'
import { Button, Checkbox, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { signUp, confirmSignUp } from "aws-amplify/auth"
import { useState } from 'react';

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

export default function SignUp() {
    const [sendOtp, setSendOtp] = useState(true);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        try {
           
            console.log(values)
            const { isSignUpComplete, nextStep } = await confirmSignUp({
                username: values.email,
                confirmationCode: values.otp
            });
            navigate('/login')
        } catch (err) {
            console.log(err);
        }
    };
    const sendOtpToUser = async () => {
        try {
            const values =form.getFieldsValue();
            console.log(values)
            await signUp({
                username: values.email,
                name: values.name,
                password: values.password,
                options: {
                    userAttributes: {
                        email: values.email,
                        name: values.name
                        },
                        }
                        })
                    setSendOtp(false);
            // navigate('/login');
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="flex flex-auto w-screen justify-center items-center">
            <div className='w-6/12 flex flex-col items-center  h-screen gap-4 background-grid'>
                <div style={{ marginTop: '96px', lineHeight: '38px' }}>
                    <img src={logogreen} alt='logo'></img>
                </div>

                <p className='text-3xl font-bold font-inter' style={{ marginTop: '96px', lineHeight: '38px' }}>Welcome back</p>

                <p className='text-grey' >Welcome back! Please enter your details.</p>
                <div className='w-6/12'>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        layout="vertical"
                        className='flex flex-col justify-center items-center'
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            wrapperCol={{
                                span: 24,
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your name!',
                                },
                            ]}
                        >
                            <Input placeholder="Olivia" style={{ height: '40px', borderRadius: '8px', width: '360px' }} />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            wrapperCol={{
                                span: 24,
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input placeholder="olivia@acme.com" style={{ height: '40px', borderRadius: '8px', width: '360px' }} />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            wrapperCol={{
                                span: 24,
                            }}

                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password className='w-full' style={{ height: '40px', borderRadius: '8px', width: '360px' }} />
                        </Form.Item>
                        {!sendOtp ?<Form.Item
                            label="Otp"
                            name="otp"
                            wrapperCol={{
                                span: 24,
                            }}

                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your OTP!',
                                },
                            ]}
                        >
                            <Input className='w-full' style={{ height: '40px', borderRadius: '8px', width: '360px' }} />
                        </Form.Item>:''}
                        {sendOtp ?<Form.Item
                            className='w-full'
                            wrapperCol={{
                                span: 24,
                            }}
                            style={{ width: '360px' }}
                        >
                            <Button
                                type="primary"
                                className='w-full'
                                style={{ backgroundColor:'#17b26a', borderRadius: '8px', height: '50px' }}
                                onClick={(e) => sendOtpToUser()}
                            >
                                Send Otp
                            </Button>
                        </Form.Item> : <Form.Item
                            className='w-full'
                            wrapperCol={{
                                span: 24,
                            }}
                            style={{ width: '360px' }}
                        >
                            <Button
                                type="primary"
                                htmlType="submit"
                                className='w-full'
                                style={{ backgroundColor: '#17b26a', borderRadius: '8px', height: '50px' }}
                            // onClick={() => navigate("/")}
                            >
                                Submit
                            </Button>
                        </Form.Item>}

                    </Form>
                </div>
                <p>Don't have an account?<a href="/signup" className='text-[#079455] hover:text-[#079455]'> Request Access</a></p>
            </div>
            <div className='w-6/12 flex-auto justify-center  items-center h-screen '><img src={sparklogin} className='object-cover w-full h-full'></img></div>
        </div>
    )
}