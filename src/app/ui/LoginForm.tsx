'use client'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { supabase } from '@/db/client'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
    const router = useRouter();
    const inputsSchema = z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
    });

    type Inputs = z.infer<typeof inputsSchema>;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(inputsSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const { email, password } = data;
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) {
            console.error('Login Failed: ', error.message);
            return;
        }
        router.push('/dashboard');
    }

    return (
        <form className='text-center' onSubmit={handleSubmit(onSubmit)}>
            <input {...register('email')} type='email' />
            <p>{errors.email?.message}</p>
            <input {...register('password')} type='password' />
            <p>{errors.password?.message}</p>
            <input type='submit' value='Log in' />
            <div>
                <Link href='/signup'>Not a member? Sign Up!</Link>
            </div>
        </form>
    )
}   