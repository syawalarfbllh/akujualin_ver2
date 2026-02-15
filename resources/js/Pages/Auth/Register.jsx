import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { TextInput, PasswordInput, Button, Stack, Text as MantineText, Anchor } from '@mantine/core'; // <--- ALIAS
import GuestLayout from '@/Layouts/GuestLayout';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <Stack>
                    <TextInput
                        label="Nama Lengkap"
                        placeholder="Contoh: Budi Santoso"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                    />

                    <TextInput
                        label="Email"
                        placeholder="budi@univ.ac.id"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Minimal 8 karakter"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                    />

                    <PasswordInput
                        label="Konfirmasi Password"
                        placeholder="Ulangi password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        error={errors.password_confirmation}
                    />

                    <Button fullWidth mt="xl" type="submit" loading={processing}>
                        Daftar Akun Baru
                    </Button>
                    
                    <MantineText align="center" size="sm" mt="xs">
                        Sudah punya akun?{' '}
                        <Anchor component={Link} href={route('login')} fw={700}>
                            Login
                        </Anchor>
                    </MantineText>
                </Stack>
            </form>
        </GuestLayout>
    );
}