import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { TextInput, PasswordInput, Checkbox, Button, Group, Anchor, Stack, Text as MantineText } from '@mantine/core'; // <--- ALIAS
import GuestLayout from '@/Layouts/GuestLayout';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <form onSubmit={submit}>
                <Stack>
                    <TextInput
                        label="Email"
                        placeholder="nama@email.com"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                        radius="md"
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Rahasia Anda"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        radius="md"
                    />

                    <Group justify="space-between" mt="sm">
                        <Checkbox
                            label="Ingat Saya"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        {canResetPassword && (
                            <Anchor component={Link} href={route('password.request')} size="sm">
                                Lupa password?
                            </Anchor>
                        )}
                    </Group>

                    <Button fullWidth mt="xl" type="submit" loading={processing}>
                        Masuk Sekarang
                    </Button>

                    <MantineText align="center" size="sm" mt="xs">
                        Belum punya akun?{' '}
                        <Anchor component={Link} href={route('register')} fw={700}>
                            Daftar
                        </Anchor>
                    </MantineText>
                </Stack>
            </form>
        </GuestLayout>
    );
}