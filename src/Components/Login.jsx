import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const LoginPage = async (e) => {
        e.preventDefault();
        try {
            const Data = {
                phone: phone,
                password: password
            }
            const res = await axios.post('https://api.fruteacorp.uz/auth/signin', Data);
            
            const token = res?.data?.data?.accessToken?.token;
            if (token) {
                localStorage.setItem('accessToken', token);
                toast.success("Muvaffaqiyatli kirildi!");
                navigate('/home');
            } else {
                toast.error("Noto‘g‘ri foydalanuvchi yoki parol!");
            }
        } catch (error) {
            console.error("Login xatosi:", error);
            toast.error("Server xatosi yoki noto‘g‘ri ma'lumot!");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
                <form onSubmit={LoginPage}>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm mb-2">Phone</label>
                        <input
                            type="tel"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm mb-2">Parol</label>
                        <input
                            type="password"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
