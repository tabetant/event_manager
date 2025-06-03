'use client'
import { useRouter } from 'next/navigation'
export default function App() {
    const router = useRouter();
    return (
        <>
            <h1>Welcome to Event Manager</h1>
            <div>
                <button onClick={() => router.push('/signup')}>Sign Up</button>
            </div>
            <div>
                <button onClick={() => router.push('/login')}>Log In</button>
            </div>
            <div>
                <button onClick={() => router.push('/dashboard')}>Dashboard</button>
            </div>
        </>
    )
}