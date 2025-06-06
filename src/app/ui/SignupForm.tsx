'use client'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { supabase } from '@/db/client'
import { useRouter } from 'next/navigation'
export default function SignupForm() {
    const router = useRouter();
    const inputsSchema = z.object(
        {
            name: z.string().min(1, 'This is required'),
            email: z.string().email('Invalid email'),
            password: z.string().min(8, 'Password must be at least 8 characters'),
        }
    )

    type Inputs = z.infer<typeof inputsSchema>

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(inputsSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    });

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const { name, email, password } = data;
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options:
            {
                data: { name }
            }
        });
        if (error) {
            console.error('Signup Failed: ', error.message);
            return;
        }
        router.push('/emailver')
    }

    return (
        <form className='text-center' onSubmit={handleSubmit(onSubmit)}>
            <input {...register('name')} type='text' placeholder='enter your name' />
            <p>{errors.name?.message}</p>
            <input {...register('email')} type='email' placeholder='enter email address' />
            <p>{errors.email?.message}</p>
            <input {...register('password')} type='password' placeholder='enter password' />
            <p>{errors.password?.message}</p>
            <input type='submit' value='Sign up' />
            <div>
                <Link href='/login'>Already a member? Log In!</Link>
            </div>
        </form>
    )
}