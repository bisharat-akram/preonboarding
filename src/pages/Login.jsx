import sparklogin from '../assets/sparklogin.png'
import logogreen from '../assets/logogreen.png' 
import { Button, Checkbox, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { signIn, fetchUserAttributes } from "aws-amplify/auth"
import { useDispatch } from 'react-redux';
import { createUser } from '../redux/actions/userAction';
const onFinishFailed = (errorInfo) => {
	console.log('Failed:', errorInfo);
};
export default function Login() {

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const onFinish = async (values) => {
		try {
			let signin = await signIn({ username: values.email, password: values.password });
			let user = await fetchUserAttributes();
			dispatch(createUser({...signin,...user}))
			navigate('/');
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="flex flex-auto w-screen justify-center items-center">
			<div className='w-6/12 flex flex-col items-center  h-screen gap-4 background-grid'>
				<div style={{ marginTop: '96px', lineHeight: '38px' }}>
					<img src={logogreen}></img>
				</div>

				<p className='text-3xl font-bold font-inter' style={{ marginTop: '96px', lineHeight: '38px' }}>Welcome back</p>

				<p className='text-grey' >Welcome back! Please enter your details.</p>
				<div className='w-6/12'>
					<Form
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

						<div className='flex gap-6 justify-between' style={{ width: '360px' }}>
							<Form.Item
								name="remember"
								valuePropName="checked"
								wrapperCol={{
									span: 24,
								}}
							>
								<Checkbox>Remember me</Checkbox>
							</Form.Item>
							<Form.Item 
							
								name="Forgot Password"
								wrapperCol={{
									span: 24,
								}}
							>
								<a href="#" className='text-[#097455] hover:text-[#097455]'>Forgot Password</a>
							</Form.Item>
						</div>
						<Form.Item
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
								style={{  borderRadius: '8px', height: '50px' }}
							>
								Submit
							</Button>
						</Form.Item>

					</Form>
				</div>
				<p>Don't have an account?<a href="/signup" className='text-[#097455] hover:text-[#097455]'> Request Access</a></p>
			</div>
			<div className='w-6/12 flex-auto justify-center  items-center h-screen '><img src={sparklogin} className='object-cover w-full h-full'></img></div>
		</div>
	)
}