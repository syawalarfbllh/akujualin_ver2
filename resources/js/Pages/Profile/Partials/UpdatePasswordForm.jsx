import { useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { PasswordInput, Button, Stack, Title, Text, Group, Transition } from '@mantine/core';
import { IconKey, IconDeviceFloppy } from '@tabler/icons-react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <Title order={3} fw={700}>Keamanan Akun</Title>
                <Text size="sm" c="dimmed" mt={5}>
                    Gunakan password panjang dan acak agar akun Anda tetap aman.
                </Text>
            </header>

            <form onSubmit={updatePassword} style={{ marginTop: '1.5rem' }}>
                <Stack gap="md" maw={600}>
                    <PasswordInput
                        label="Password Saat Ini"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        error={errors.current_password}
                        leftSection={<IconKey size={16} />}
                    />

                    <PasswordInput
                        label="Password Baru"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        leftSection={<IconKey size={16} />}
                    />

                    <PasswordInput
                        label="Konfirmasi Password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        error={errors.password_confirmation}
                        leftSection={<IconKey size={16} />}
                    />

                    <Group justify="flex-end">
                        <Transition mounted={recentlySuccessful} transition="fade" duration={400}>
                            {(styles) => <Text size="sm" c="teal" style={styles}>Berhasil Diubah.</Text>}
                        </Transition>
                        <Button type="submit" color="orange" loading={processing} leftSection={<IconDeviceFloppy size={18}/>}>
                            Update Password
                        </Button>
                    </Group>
                </Stack>
            </form>
        </section>
    );
}