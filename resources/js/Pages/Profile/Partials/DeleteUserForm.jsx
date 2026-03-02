import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button, Modal, PasswordInput, Stack, Title, Text, Group, Alert } from '@mantine/core';
import { IconAlertTriangle, IconTrash } from '@tabler/icons-react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);

    const { data, setData, delete: destroy, processing, reset, errors } = useForm({
        password: '',
    });

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => {},
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    return (
        <section className={className}>
            <header>
                <Title order={3} fw={700} c="red">Hapus Akun</Title>
                <Text size="sm" c="dimmed" mt={5}>
                    Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen.
                </Text>
            </header>

            <Alert variant="light" color="red" title="Peringatan" icon={<IconAlertTriangle />} mt="lg">
                Proses ini tidak dapat dibatalkan. Pastikan Anda telah mengamankan data penting.
            </Alert>

            <Button color="red" variant="light" mt="lg" onClick={() => setConfirmingUserDeletion(true)} leftSection={<IconTrash size={18}/>}>
                Hapus Akun Saya
            </Button>

            <Modal opened={confirmingUserDeletion} onClose={closeModal} title="Konfirmasi Penghapusan Akun" centered radius="md">
                <form onSubmit={deleteUser}>
                    <Stack>
                        <Text size="sm">
                            Apakah Anda yakin ingin menghapus akun? Masukkan password Anda untuk mengonfirmasi.
                        </Text>
                        <PasswordInput
                            label="Password"
                            placeholder="Password Anda"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            required
                        />
                        <Group justify="flex-end" mt="md">
                            <Button variant="default" onClick={closeModal}>Batal</Button>
                            <Button color="red" type="submit" loading={processing}>Hapus Sekarang</Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </section>
    );
}